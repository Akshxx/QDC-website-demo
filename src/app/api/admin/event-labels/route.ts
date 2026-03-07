import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from '@/lib/mongodb';
import { MongoClient } from 'mongodb';

// GET all event labels
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
    
    // Get all event labels
    const labels = await db.collection('eventLabels').find({}).toArray();
    
    return NextResponse.json({
      labels,
      count: labels.length
    });
    
  } catch (error) {
    console.error("Error fetching event labels:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new event label
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
    
    const body = await request.json();
    
    // Basic validation
    if (!body.name) {
      return NextResponse.json(
        { message: "Label name is required" },
        { status: 400 }
      );
    }
    
    const client = await (connectToDatabase as unknown as Promise<MongoClient>);
    const db = client.db();
    
    // Check if label already exists
    const existingLabel = await db.collection('eventLabels').findOne({ name: body.name });
    if (existingLabel) {
      return NextResponse.json(
        { message: "Label with this name already exists" },
        { status: 400 }
      );
    }
    
    // Add created timestamp
    const labelData = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Insert into the database
    const result = await db.collection('eventLabels').insertOne(labelData);
    
    return NextResponse.json({
      message: "Event label created successfully",
      labelId: result.insertedId
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating event label:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
