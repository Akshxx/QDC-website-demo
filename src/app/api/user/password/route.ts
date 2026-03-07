import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getUserByUsername } from "@/lib/services/userService";
import clientPromise from "@/lib/mongodb";

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
    
    // Get request data
    const { username, currentPassword, newPassword } = await request.json();
    
    if (!username || !currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }
    
    // Get user from database
    const user = await getUserByUsername(username);
    
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    
    // Verify token matches the user
    const tokenUserId = (decoded as any).id;
    if (user._id.toString() !== tokenUserId) {
      return NextResponse.json(
        { message: "Unauthorized to change this user's password" },
        { status: 403 }
      );
    }
    
    // Compare passwords
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 400 }
      );
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password in database
    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection('teamMemberUsers').updateOne(
      { username },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );
    
    if (result.modifiedCount !== 1) {
      return NextResponse.json(
        { message: "Failed to update password" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ message: "Password updated successfully" });
    
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
