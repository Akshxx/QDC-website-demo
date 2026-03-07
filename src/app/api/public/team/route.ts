import { NextRequest, NextResponse } from "next/server";
import { getAllTeamMembers } from "@/lib/services/teamService";
import { TeamMember } from "@/types/team";

// GET handler for fetching all active team members for public display
export async function GET(request: NextRequest) {
  try {
    // Fetch all team members
    const allMembers = await getAllTeamMembers();
    
    // Filter to only include active members
    const activeMembers = allMembers.filter(member => member.isActive);
    
    // Return the filtered list
    return NextResponse.json({ members: activeMembers });
    
  } catch (error) {
    console.error("Error fetching public team data:", error);
    return NextResponse.json(
      { message: "Internal server error", members: [] },
      { status: 500 }
    );
  }
}
