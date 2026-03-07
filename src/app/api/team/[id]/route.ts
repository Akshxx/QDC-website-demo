import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTeamMemberById, updateTeamMember, deleteTeamMember } from "@/lib/services/teamService";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

// GET handler for fetching a single team member
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Use await to get params
    const { id } = await params;
    
    const member = await getTeamMemberById(id);
    
    if (!member) {
      return NextResponse.json(
        { message: "Team member not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(member);
    
  } catch (error) {
    console.error("Error fetching team member:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT handler for updating a team member
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Use await to get params
    const { id } = await params;
    
    // Only admins and superadmins can update team members
    const userRole = session.user.role as string | undefined;
    if (!userRole || !['admin', 'superadmin'].includes(userRole)) {
      return NextResponse.json(
        { message: "Insufficient permissions" },
        { status: 403 }
      );
    }
    
    // Get existing team member to check permissions
    const existingMember = await getTeamMemberById(id);
    
    if (!existingMember) {
      return NextResponse.json(
        { message: "Team member not found" },
        { status: 404 }
      );
    }
    
    // Parse update data
    const updateData = await request.json();
    
    // Role-based permission check:
    // Regular admins can now edit core team members including executive board
    if (userRole === 'admin') {
      // Check if trying to edit a restricted member type
      const restrictedRoles = ['dean', 'chairperson', 'associate-chairperson', 'hod', 
                              'faculty-convenor', 'faculty-co-convenor', 'founding-member'];
      
      if (restrictedRoles.includes(existingMember.hierarchyLevel)) {
        return NextResponse.json(
          { message: "Regular admins can only edit core team members" },
          { status: 403 }
        );
      }
      
      // Check if trying to change to a restricted role
      if (updateData.hierarchyLevel && restrictedRoles.includes(updateData.hierarchyLevel)) {
        return NextResponse.json(
          { message: "Regular admins cannot assign restricted roles" },
          { status: 403 }
        );
      }
    }
    
    // Apply the update
    const success = await updateTeamMember(id, updateData);
    
    if (!success) {
      return NextResponse.json(
        { message: "Team member not found or could not be updated" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: "Team member updated successfully"
    });
    
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE handler for removing a team member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Use await to get params
    const { id } = await params;
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid team member ID" },
        { status: 400 }
      );
    }

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();

    // First get the team member to check if they have a user account
    const teamMember = await db.collection('teamMembers').findOne({
      _id: new ObjectId(id)
    });

    if (!teamMember) {
      return NextResponse.json(
        { message: "Team member not found" },
        { status: 404 }
      );
    }

    // Check permissions based on hierarchy level
    // Only superadmins can delete certain types of members
    const userRole = session.user.role as string | undefined;
    const isSuperAdmin = userRole === "superadmin";
    
    // List of roles that regular admins can delete
    const regularAdminDeletableRoles = [
      'domain-lead', 'associate-lead', 'associate', 'member', 
      'president', 'vice-president', 'secretary', 'vice-secretary'
    ];
    
    // Check if this admin has permission to delete this team member
    if (!isSuperAdmin && !regularAdminDeletableRoles.includes(teamMember.hierarchyLevel)) {
      return NextResponse.json(
        { message: "You don't have permission to delete this team member" },
        { status: 403 }
      );
    }

    // Delete team member from teamMembers collection
    const result = await db.collection('teamMembers').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount !== 1) {
      return NextResponse.json(
        { message: "Failed to delete team member" },
        { status: 500 }
      );
    }

    // If team member has a user account, delete it as well
    if (teamMember.userAccountId) {
      await db.collection('teamMemberUsers').deleteOne({
        _id: new ObjectId(teamMember.userAccountId)
      });
      
      // Also remove any profile data
      await db.collection('teamMemberProfiles').deleteOne({ 
        userId: teamMember.userAccountId 
      });
    }

    return NextResponse.json({ message: "Team member deleted successfully" });
  } catch (error) {
    console.error("Error deleting team member:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
