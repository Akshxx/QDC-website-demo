import { NextRequest, NextResponse } from "next/server";
import { getUserByUsername } from "@/lib/services/userService";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    // Validate required fields
    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }
    
    // Get user from database
    const user = await getUserByUsername(username);
    
    if (!user) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }
    
    // Check if user is approved
    if (!user.isApproved) {
      return NextResponse.json(
        { message: "Your account is pending approval. Please try again later." },
        { status: 403 }
      );
    }
    
    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: "teamMember" },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "24h" }
    );
    
    // Set cookie with JWT - Fix: await cookies()
    const cookieStore = await cookies();
    cookieStore.set({
      name: "userToken",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 24 hours
      path: "/",
    });
    
    // Return success without exposing password
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({
      message: "Login successful",
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error("Error logging in user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
