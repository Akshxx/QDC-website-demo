import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getUserById } from "@/lib/services/userService";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/**
 * Utility endpoint to force synchronization of profile data between collections
 */
export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("userToken")?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }
    
    // Get user ID from token
    const userId = (decoded as any).id;
    
    // Get user from database to verify existence
    const user = await getUserById(userId);
    
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Get profile data
    const profile = await db.collection('teamMemberProfiles').findOne({ userId });
    
    if (!profile) {
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 }
      );
    }
    
    // Find the team member linked to this user
    const teamMember = await db.collection('teamMembers').findOne({ userAccountId: userId });
    
    if (!teamMember) {
      return NextResponse.json(
        { message: "No team member found for this user" },
        { status: 404 }
      );
    }
    
    // Determine which image to use (prefer profile.image, fall back to profile.imageUrl)
    const imageToUse = profile.image || profile.imageUrl || "";
    
    // Update both collections to ensure they have the same image
    
    // Update profile
    await db.collection('teamMemberProfiles').updateOne(
      { userId },
      { 
        $set: { 
          image: imageToUse,
          imageUrl: imageToUse,
          updatedAt: new Date()
        }
      }
    );
    
    // Update team member
    await db.collection('teamMembers').updateOne(
      { userAccountId: userId },
      {
        $set: {
          image: imageToUse,
          bio: profile.bio || "",
          phone: profile.phone || "",
          socialLinks: profile.socialLinks || {},
          updatedAt: new Date()
        }
      }
    );
    
    return NextResponse.json({
      message: "Profile and team member image synchronized successfully",
      image: imageToUse.substring(0, 50) + "..." // Return a preview of the image data
    });
    
  } catch (error) {
    console.error("Error synchronizing profile:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
