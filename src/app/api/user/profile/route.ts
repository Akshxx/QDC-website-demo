import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getUserById } from "@/lib/services/userService";
import { syncProfileData, getCompleteProfileData, syncProfileImage } from "@/lib/services/profileSyncService";

// GET handler for retrieving user profile
export async function GET(request: NextRequest) {
  try {
    // Fix: await the cookies() function
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
    
    // Get user from database
    const userId = (decoded as any).id;
    
    // Get complete profile data (from multiple collections)
    const profile = await getCompleteProfileData(userId);
    
    if (!profile) {
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(profile);
    
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST handler for updating user profile
export async function POST(request: NextRequest) {
  try {
    // Fix: await the cookies() function
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
    
    // Parse profile data from request
    const profileData = await request.json();
    
    // If there's an image in the profile data, sync it explicitly
    if (profileData.image) {
      await syncProfileImage(userId, profileData.image);
    }
    
    // Use the sync service to update all collections
    const updated = await syncProfileData(userId, profileData);
    
    if (!updated) {
      return NextResponse.json(
        { message: "Failed to update profile" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: "Profile updated successfully"
    });
    
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
