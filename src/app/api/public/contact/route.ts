import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { MongoClient } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Please provide name, email, and message" }, 
        { status: 400 }
      );
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address" },
        { status: 400 }
      );
    }
    
    // Fix the MongoDB client access
    const client = await (connectToDatabase as unknown as Promise<MongoClient>);
    const db = client.db();
    
    // Insert into the database
    await db.collection('contactInquiries').insertOne({
      name,
      email,
      subject: subject || "General Inquiry",
      message,
      status: "unread",
      createdAt: new Date(),
    });
    
    return NextResponse.json({ 
      message: "Contact message submitted successfully" 
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error saving contact message:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
