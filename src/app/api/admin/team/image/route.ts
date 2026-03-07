import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { syncProfileImage } from "@/lib/services/profileSyncService";

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
    
    // Only admins and superadmins can update team members
    const userRole = session.user.role as string | undefined;
    if (!userRole || !['admin', 'superadmin'].includes(userRole)) {
      return NextResponse.json(
        { message: "Insufficient permissions" },
        { status: 403 }
      );
    }
    
    // Parse request body
    const { teamMemberId, imageData } = await request.json();
    
    if (!teamMemberId || !imageData) {
      return NextResponse.json(
        { message: "Team member ID and image data are required" },
        { status: 400 }
      );
    }
    
    // Connect to database
    const client = await clientPromise;
    const db = client.db();
    
    // Find team member
    const teamMember = await db.collection('teamMembers').findOne({
      _id: new ObjectId(teamMemberId)
    });
    
    if (!teamMember) {
      return NextResponse.json(
        { message: "Team member not found" },
        { status: 404 }
      );
    }
    
    // Update team member image
    await db.collection('teamMembers').updateOne(
      { _id: new ObjectId(teamMemberId) },
      {
        $set: {
          image: imageData,
          updatedAt: new Date()
        }
      }
    );
    
    // If this team member has a user account, sync to profile as well
    if (teamMember.userAccountId) {
      // Use the improved synchronization method
      await syncUserProfileImage(teamMember.userAccountId, imageData, db);
    }
    
    return NextResponse.json({
      message: "Team member image updated successfully"
    });
    
  } catch (error) {
    console.error("Error updating team member image:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Enhanced function to ensure the image is updated in both imageUrl and image fields
async function syncUserProfileImage(userId: string, imageData: string, db: any): Promise<void> {
  try {
    // Update both image and imageUrl in the teamMemberProfiles collection
    await db.collection('teamMemberProfiles').updateOne(
      { userId },
      { 
        $set: { 
          image: imageData,
          imageUrl: imageData, // Ensure both fields are updated
          updatedAt: new Date()
        }
      },
      { upsert: true } // Create the profile if it doesn't exist
    );
    
    // Also verify if there are any duplicate profiles and fix them
    const profiles = await db.collection('teamMemberProfiles').find({ userId }).toArray();
    
    if (profiles.length > 1) {
      console.warn(`Multiple profiles found for user ${userId}. Keeping only the most recent one.`);
      
      // Sort by updatedAt descending to find most recent
      profiles.sort((a: any, b: any) => {
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return dateB - dateA;
      });
      
      // Keep only the most recent profile
      const mostRecent = profiles[0];
      
      // Delete all others
      for (let i = 1; i < profiles.length; i++) {
        await db.collection('teamMemberProfiles').deleteOne({ _id: profiles[i]._id });
      }
      
      // Make sure the most recent one has the correct image data
      await db.collection('teamMemberProfiles').updateOne(
        { _id: mostRecent._id },
        { 
          $set: { 
            image: imageData,
            imageUrl: imageData,
            updatedAt: new Date()
          }
        }
      );
    }
    
    console.log(`Successfully updated profile image for user ${userId}`);
  } catch (error) {
    console.error(`Error syncing profile image for user ${userId}:`, error);
    throw error;
  }
}
