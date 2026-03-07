import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import { Document } from 'mongodb';

// Define type for contact message based on the actual form data
interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  subject: string;
  status: 'read' | 'unread' | 'archived';
  createdAt: string;
}

// GET handler for fetching all contact messages
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      console.log("Unauthorized access attempt to contact messages");
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("Authenticated user:", session.user?.email || session.user?.name);
    
    // Connect to database
    const client = await connectToDatabase;
    const db = client.db();
    
    // Get collection names for debugging
    const collections = await db.listCollections().toArray();
    console.log("Available collections:", collections.map(c => c.name));
    
    // IMPORTANT: Use contactInquiries collection (matches the collection used in the public contact API)
    const collectionName = 'contactInquiries';
    
    console.log(`Querying collection: ${collectionName}`);
    
    // Get all contact messages sorted by creation date (newest first)
    const mongoMessages = await db.collection(collectionName)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    console.log(`Raw messages count from database: ${mongoMessages.length}`);
    
    if (mongoMessages.length > 0) {
      console.log("Sample message structure:", 
        JSON.stringify({
          _id: mongoMessages[0]._id,
          name: mongoMessages[0].name,
          email: mongoMessages[0].email,
          subject: mongoMessages[0].subject,
          status: mongoMessages[0].status || "unread"
        })
      );
    }
    
    // Format the messages for the frontend
    const messages: ContactMessage[] = mongoMessages.map(msg => {
      try {
        // Format date properly
        let formattedDate = msg.createdAt;
        
        if (msg.createdAt) {
          if (msg.createdAt instanceof Date) {
            formattedDate = msg.createdAt.toISOString();
          } else if (typeof msg.createdAt === 'string') {
            formattedDate = msg.createdAt;
          } else {
            formattedDate = new Date().toISOString();
          }
        } else {
          formattedDate = new Date().toISOString();
        }
        
        return {
          _id: msg._id.toString(),
          name: msg.name || "Unknown",
          email: msg.email || "no-email@example.com",
          message: msg.message || "",
          subject: msg.subject || "General Inquiry",
          status: msg.status || 'unread',
          createdAt: formattedDate,
        };
      } catch (err) {
        console.error("Error processing message:", err);
        return {
          _id: msg._id ? msg._id.toString() : "error-id",
          name: "Error Processing Message",
          email: "error@example.com",
          message: "This message could not be processed correctly.",
          subject: "Error",
          status: 'unread',
          createdAt: new Date().toISOString(),
        };
      }
    });
    
    console.log(`Processed ${messages.length} contact messages`);
    
    return NextResponse.json({ messages });
    
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json(
      { message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}
