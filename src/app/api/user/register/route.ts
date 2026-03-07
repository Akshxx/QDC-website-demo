import { NextRequest, NextResponse } from "next/server";
import { createUserAccount } from "@/lib/services/userService";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { name, username, email, password, hierarchyLevel, domain } = await request.json();
    
    // Enhanced validation to ensure all fields are filled
    if (!name || !username || !email || !password || !hierarchyLevel) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }
    
    // Validate domain is provided when required
    if (['member', 'associate', 'associate-lead', 'domain-lead'].includes(hierarchyLevel) && !domain) {
      return NextResponse.json(
        { message: "Domain is required for this role" },
        { status: 400 }
      );
    }
    
    // Validate role selection
    const allowedRoles = ["domain-lead", "associate-lead", "associate", "member"];
    if (!allowedRoles.includes(hierarchyLevel)) {
      return NextResponse.json(
        { message: "Invalid role selected" },
        { status: 400 }
      );
    }

    // For debugging - log the domain value 
    console.log("Registration domain value:", domain, typeof domain);
    
    // Generate position based on role WITHOUT including domain
    let position = hierarchyLevel.replace('-', ' ');
    position = position.charAt(0).toUpperCase() + position.slice(1);
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create the userData object explicitly to ensure domain is included
    const userData = {
      name,
      username,
      email,
      password: hashedPassword,
      position,
      hierarchyLevel,
      // Ensure domain is properly passed (not undefined)
      domain: domain || null, 
      isApproved: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Log the complete userData object for verification
    console.log("User data for registration:", {
      ...userData,
      password: "[REDACTED]",
      domain: userData.domain // Explicitly log the domain
    });
    
    // Create user account with the prepared userData
    const user = await createUserAccount(userData);
    
    if (!user) {
      return NextResponse.json(
        { message: "User already exists with this username or email" },
        { status: 400 }
      );
    }
    
    // Return success without exposing password
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
    
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
