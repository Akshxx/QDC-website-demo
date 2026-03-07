import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createAdminUser } from "@/lib/services/adminService";

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const body = await request.json();
    const { username, password, name, email, role } = body;

    // Validate required fields
    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    // Type-safe check for user role
    const userRole = session.user.role as string | undefined;
    
    // Permission check 1: Both admin and superadmin can create admins
    if (!userRole || !['admin', 'superadmin'].includes(userRole)) {
      return NextResponse.json(
        { message: "Insufficient permissions to create admin accounts" },
        { status: 403 }
      );
    }

    // Permission check 2: Only superadmins can create superadmins
    if (role === 'superadmin' && userRole !== 'superadmin') {
      return NextResponse.json(
        { message: "Only super administrators can create super administrator accounts" },
        { status: 403 }
      );
    }

    // Create the new admin user
    const newAdmin = await createAdminUser({
      username,
      password,
      name,
      email,
      role: role || 'admin',
    });

    // Check if creation was successful
    if (!newAdmin) {
      return NextResponse.json(
        { message: "User already exists or could not be created" },
        { status: 400 }
      );
    }

    // Return success with sanitized user data (no password)
    return NextResponse.json({
      message: "Admin user created successfully",
      user: {
        username: newAdmin.username,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
    
  } catch (error) {
    console.error("Error creating admin user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
