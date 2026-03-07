import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { MongoClient, ObjectId } from 'mongodb';
import { EventLabel, Event as EventType } from '@/types/events';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const filter = url.searchParams.get('filter') || 'all'; // all, upcoming, past
    
    const client = await (connectToDatabase as unknown as Promise<MongoClient>);
    const db = client.db();
    
    // Build query based on filter parameter and only return active events
    let query: any = { isActive: true };
    
    if (filter === 'upcoming') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query.date = { $gte: today.toISOString().split('T')[0] };
    } else if (filter === 'past') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query.date = { $lt: today.toISOString().split('T')[0] };
    }
    
    // Get total count
    const total = await db.collection('events').countDocuments(query);
    
    // Get events, sorted by date
    const sortDirection = filter === 'past' ? -1 : 1; // Past events newest first, upcoming events soonest first
    
    const events = await db.collection('events')
      .find(query)
      .sort({ date: sortDirection })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();
    
    // Get all labels referenced in the events
    let labels: EventLabel[] = []; // Properly define the type
    const labelIds = Array.from(new Set(events.flatMap(event => event.labels || [])));
    
    if (labelIds.length > 0) {
      // Convert string IDs to ObjectId
      const objectIds = labelIds
        .filter(id => id && typeof id === 'string' && ObjectId.isValid(id))
        .map(id => new ObjectId(id));
        
      if (objectIds.length > 0) {
        const labelDocs = await db.collection('eventLabels')
          .find({ _id: { $in: objectIds } })
          .toArray();
          
        // Properly convert the MongoDB documents to EventLabel type
        labels = labelDocs.map(doc => ({
          _id: doc._id.toString(), // Convert ObjectId to string
          name: doc.name,
          color: doc.color
        })) as EventLabel[];
      }
    }
    
    return NextResponse.json({
      events,
      labels,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
