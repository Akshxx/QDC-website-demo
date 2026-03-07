import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid event ID" },
        { status: 400 }
      );
    }

    const client = await connectToDatabase;
    const db = client.db();
    
    // Find only the recapImages field to minimize data transfer
    const event = await db.collection('events').findOne(
      { _id: new ObjectId(id) },
      { projection: { recapImages: 1 } }
    );
    
    if (!event) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }
    
    // Return only the images array
    return NextResponse.json({ 
      images: event.recapImages || []
    });
    
  } catch (error) {
    console.error("Error fetching event gallery:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
