import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from '@/lib/mongodb';
import { MongoClient } from 'mongodb';

// GET all events
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
    
    const client = await (connectToDatabase as unknown as Promise<MongoClient>);
    const db = client.db();
    
    // Get all events, sorted by date (newest first)
    const events = await db.collection('events')
      .find({})
      .sort({ date: -1 })
      .toArray();
    
    return NextResponse.json({
      events,
      count: events.length
    });
    
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new event
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
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
    
    // Remove any limit on recap images - we'll rely on client compression
    // Process images if needed but don't artificially limit them
    
    // Add metadata
    const newEvent = {
      ...eventData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: session.user?.email,
      updatedBy: session.user?.email
    };
    
    // Insert into database
    const client = await (connectToDatabase as unknown as Promise<MongoClient>);
    const db = client.db();
    const result = await db.collection('events').insertOne(newEvent);
    
    return NextResponse.json({
      message: "Event created successfully",
      eventId: result.insertedId.toString()
    });
    
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
