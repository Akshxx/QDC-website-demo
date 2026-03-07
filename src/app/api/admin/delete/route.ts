import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteAdminUser } from "@/lib/services/adminService";

export async function DELETE(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Type-safe check for user role
    const userRole = session.user.role as string | undefined;
    
    // Only superadmins can delete admin accounts
    if (!userRole || userRole !== 'superadmin') {
      return NextResponse.json(
        { message: "Only super administrators can delete admin accounts" },
        { status: 403 }
      );
    }

    // Parse the request body to get admin ID
    const body = await request.json();
    const { adminId } = body;

    if (!adminId) {
      return NextResponse.json(
        { message: "Admin ID is required" },
        { status: 400 }
      );
    }

    // Prevent admins from deleting their own account
    if (session.user.id === adminId) {
      return NextResponse.json(
        { message: "You cannot delete your own account" },
        { status: 400 }
      );
    }

    // Delete the admin user
    const result = await deleteAdminUser(adminId);

    if (!result) {
      return NextResponse.json(
        { message: "Admin user not found or could not be deleted" },
        { status: 404 }
      );
    }

    // Return success
    return NextResponse.json({
      message: "Admin user successfully deleted"
    });
    
  } catch (error) {
    console.error("Error deleting admin user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
