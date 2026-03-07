import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { approveTeamMemberUser } from "@/lib/services/userService";

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
    
    // Only admins and superadmins can approve users
    const userRole = session.user.role as string | undefined;
    if (!userRole || !['admin', 'superadmin'].includes(userRole)) {
      return NextResponse.json(
        { message: "Insufficient permissions" },
        { status: 403 }
      );
    }
    
    // Get user ID from request body
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }
    
    // Approve the user
    const approved = await approveTeamMemberUser(userId);
    
    if (!approved) {
      return NextResponse.json(
        { message: "User not found or could not be approved" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: "User approved successfully"
    });
    
  } catch (error) {
    console.error("Error approving user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}