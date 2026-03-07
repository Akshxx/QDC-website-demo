import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Increase maximum request size for this API route
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Increase from default 4mb to 10mb
    },
  },
};

// GET single event by ID - Update parameter types for Next.js 15
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Use await to get params
    const { id } = await params;
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid event ID" },
        { status: 400 }
      );
    }
    
    const client = await connectToDatabase;
    const db = client.db();
    
    const event = await db.collection('events').findOne({
      _id: new ObjectId(id)
    });
    
    if (!event) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }
    
    // Convert ObjectId to string for frontend compatibility
    return NextResponse.json({
      event: {
        ...event,
        _id: event._id.toString()
      }
    });
    
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// UPDATE event - Update parameter types for Next.js 15
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Use await to get params
    const { id } = await params;
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid event ID" },
        { status: 400 }
      );
    }
    
    const eventData = await request.json();
    
    // Basic validation
    if (!eventData.title || !eventData.date) {
      return NextResponse.json(
        { message: "Title and date are required fields" },
        { status: 400 }
      );
    }
    
    const client = await connectToDatabase;
    const db = client.db();
    
    // Check if event exists before updating
    const existingEvent = await db.collection('events').findOne({
      _id: new ObjectId(id)
    });
    
    if (!existingEvent) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }
    
    // Prepare the update data
    const updateData = {
      ...eventData,
      updatedAt: new Date().toISOString(),
      updatedBy: session.user?.email
    };
    
    // Remove _id from update data if it exists
    if (updateData._id) delete updateData._id;
    
    // Process recap images - IMPROVED WITHOUT HARD LIMITS
    if (updateData.recapImages && Array.isArray(updateData.recapImages)) {
      // Instead of limiting to 10 images, ensure they're optimized
      // Calculate total image size with proper typing
      const totalImageSize = updateData.recapImages.reduce((size: number, img: string) => 
        size + (typeof img === 'string' ? img.length : 0), 0);
      
      // If total size is very large (over 10MB), implement progressive quality reduction
      if (totalImageSize > 10 * 1024 * 1024) {
        console.warn(`Large image payload (${Math.round(totalImageSize/1024/1024)}MB) - consider optimizing client-side compression`);
        
        // Continue with the update - we'll trust the client-side compression
        // No artificial limit on number of images
      }
    }
    
    // Update the event in the database
    const result = await db.collection('events').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: "Event updated successfully",
      eventId: id
    });
    
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE event - Update parameter types for Next.js 15
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Use await to get params
    const { id } = await params;
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid event ID" },
        { status: 400 }
      );
    }
    
    const client = await connectToDatabase;
    const db = client.db();
    
    const result = await db.collection('events').deleteOne({
      _id: new ObjectId(id)
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: "Event deleted successfully"
    });
    
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
