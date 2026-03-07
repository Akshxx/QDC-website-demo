import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllAdminUsers } from "@/lib/services/adminService";

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Only allow admins to view admin list
    if (!session.user.role || !['admin', 'superadmin'].includes(session.user.role)) {
      return NextResponse.json(
        { message: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Get all admin users
    const admins = await getAllAdminUsers();
    
    // Return sanitized admin list (without passwords)
    return NextResponse.json({
      admins: admins.map(admin => ({
        _id: admin._id,
        username: admin.username,
        name: admin.name || null,
        email: admin.email || null,
        role: admin.role || "admin",
        lastLogin: admin.lastLogin || null,
      })),
    });
    
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
