import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET contact message by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid contact message ID" }, { status: 400 });
    }

    const client = await connectToDatabase;
    const db = client.db();

    const message = await db.collection('contactMessages').findOne({ _id: new ObjectId(id) });

    if (!message) {
      return NextResponse.json({ message: "Contact message not found" }, { status: 404 });
    }

    return NextResponse.json({ message: { ...message, _id: message._id.toString() } });

  } catch (error) {
    console.error("Error fetching contact message:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// PUT contact message by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid contact message ID" }, { status: 400 });
    }

    const updateData = await request.json();
    const client = await connectToDatabase;
    const db = client.db();

    const result = await db.collection('contactMessages').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Contact message not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Contact message updated successfully" });

  } catch (error) {
    console.error("Error updating contact message:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// DELETE handler for removing a single contact message
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get message ID from params
    const { id } = await params;
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid message ID" },
        { status: 400 }
      );
    }

    // Connect to database and delete the message - Use contactInquiries collection
    const client = await connectToDatabase;
    const db = client.db();
    
    const result = await db.collection('contactInquiries').deleteOne({
      _id: new ObjectId(id)
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Message not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: "Message deleted successfully" });
    
  } catch (error) {
    console.error("Error deleting contact message:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
