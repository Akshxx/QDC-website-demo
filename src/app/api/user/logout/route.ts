import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    // Fix: await cookies()
    const cookieStore = await cookies();
    
    // Clear the user token cookie
    cookieStore.delete("userToken");
    
    return NextResponse.json({
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("Error logging out:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
