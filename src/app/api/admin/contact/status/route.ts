import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request: NextRequest) {
  try {
    // Verify the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const { messageId, status } = await request.json();
    
    // Validate inputs
    if (!messageId || !ObjectId.isValid(messageId)) {
      return NextResponse.json({ message: "Invalid message ID" }, { status: 400 });
    }
    
    if (!['read', 'unread', 'archived'].includes(status)) {
      return NextResponse.json({ message: "Invalid status value" }, { status: 400 });
    }

    // Update the message status in the database - Use contactInquiries collection
    const client = await connectToDatabase;
    const db = client.db();
    
    const result = await db.collection('contactInquiries').updateOne(
      { _id: new ObjectId(messageId) },
      { 
        $set: { 
          status,
          updatedAt: new Date().toISOString(),
          updatedBy: session.user?.email || session.user?.name || 'unknown'
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Message status updated successfully",
      status: status
    });
    
  } catch (error) {
    console.error("Error updating message status:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
