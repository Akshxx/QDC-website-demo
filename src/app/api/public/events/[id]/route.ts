import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { MongoClient, ObjectId } from 'mongodb';
import { Event } from '@/types/events';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Update to use await params
    const { id } = await params;
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid event ID" },
        { status: 400 }
      );
    }

    const client = await (connectToDatabase as unknown as Promise<MongoClient>);
    const db = client.db();
    
    // Find the event by ID
    const event = await db.collection('events').findOne({ 
      _id: new ObjectId(id),
      isActive: true 
    });
    
    if (!event) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }
    
    // Prepare the response
    const formattedEvent = {
      ...event,
      _id: event._id.toString()
    };
    
    return NextResponse.json({ event: formattedEvent });
    
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
