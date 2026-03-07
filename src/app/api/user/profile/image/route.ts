import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getUserById } from "@/lib/services/userService";
import { syncProfileImage } from "@/lib/services/profileSyncService";

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
    
    // Parse request body
    const { imageData } = await request.json();
    
    if (!imageData) {
      return NextResponse.json(
        { message: "Image data is required" },
        { status: 400 }
      );
    }
    
    // Validate image data (basic check)
    if (typeof imageData === 'string' && 
       (!imageData.startsWith('http') && !imageData.startsWith('data:image/'))) {
      return NextResponse.json(
        { message: "Invalid image format. Must be a URL or base64 data" },
        { status: 400 }
      );
    }
    
    // Sync image across collections
    const updated = await syncProfileImage(userId, imageData);
    
    if (!updated) {
      return NextResponse.json(
        { message: "Failed to update profile image" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: "Profile image updated successfully"
    });
    
  } catch (error) {
    console.error("Error updating profile image:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
