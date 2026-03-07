import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createTeamMember, getAllTeamMembers, getTeamStats } from "@/lib/services/teamService";

// GET handler for fetching all team members or stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statsOnly = searchParams.get('stats') === 'true';
    
    if (statsOnly) {
      const stats = await getTeamStats();
      return NextResponse.json(stats);
    }
    
    const members = await getAllTeamMembers();
    return NextResponse.json({ members });
    
  } catch (error) {
    console.error("Error fetching team data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST handler for creating new team members
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Only admins and superadmins can create team members
    const userRole = session.user.role as string | undefined;
    if (!userRole || !['admin', 'superadmin'].includes(userRole)) {
      return NextResponse.json(
        { message: "Insufficient permissions" },
        { status: 403 }
      );
    }
    
    // Parse request body
    const teamMemberData = await request.json();
    
    // Validate required fields
    if (!teamMemberData.name || !teamMemberData.position || !teamMemberData.hierarchyLevel) {
      return NextResponse.json(
        { message: "Name, position, and hierarchy level are required" },
        { status: 400 }
      );
    }
    
    // Role-based permission check for regular admins
    if (userRole === 'admin') {
      // Define the roles that regular admins can create
      const allowedRoles = [
        'president', 'vice-president', 'secretary', 'vice-secretary',
        'domain-lead', 'associate-lead', 'associate', 'member'
      ];
      
      if (!allowedRoles.includes(teamMemberData.hierarchyLevel)) {
        return NextResponse.json(
          { message: "Regular admins can only create core team members (executive board and domain members)" },
          { status: 403 }
        );
      }
    }
    
    // Set default values
    teamMemberData.isActive = teamMemberData.isActive ?? true;
    
    // Create team member
    const newTeamMember = await createTeamMember(teamMemberData);
    
    return NextResponse.json({
      message: "Team member created successfully",
      member: newTeamMember
    });
    
  } catch (error) {
    console.error("Error creating team member:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
