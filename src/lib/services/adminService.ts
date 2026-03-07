import { compare, hash } from 'bcryptjs';
import { Document, ObjectId, WithId } from 'mongodb';
import clientPromise from '../mongodb';
import { AdminUser } from '../models/AdminUser';

export async function createAdminUser(userData: Omit<AdminUser, '_id' | 'createdAt'>): Promise<AdminUser | null> {
  const client = await clientPromise;
  const db = client.db();
  
  // Check if user already exists
  const existingUser = await db.collection('adminUsers').findOne({ username: userData.username });
  if (existingUser) {
    return null;
  }
  
  // Hash the password
  const hashedPassword = await hash(userData.password, 10);
  
  // Create user without _id to let MongoDB generate it
  const userToInsert = {
    ...userData,
    password: hashedPassword,
    createdAt: new Date()
  };
  
  const result = await db.collection('adminUsers').insertOne(userToInsert);
  
  return {
    ...userToInsert,
    _id: result.insertedId.toString()
  };
}

export async function verifyAdminCredentials(username: string, password: string): Promise<AdminUser | null> {
  try {
    console.log("Verifying credentials for:", username);
    
    const client = await clientPromise;
    console.log("MongoDB connection established");
    
    const db = client.db();
    
    const user = await db.collection('adminUsers').findOne({ username });
    console.log("User lookup result:", user ? "User found" : "User not found");
    
    if (!user) return null;
    
    const isValid = await compare(password, user.password as string);
    console.log("Password validation:", isValid ? "Valid" : "Invalid");
    
    if (!isValid) return null;
    
    // Update last login time
    await db.collection('adminUsers').updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );
    
    // Convert MongoDB document to AdminUser type
    return {
      ...user,
      _id: user._id.toString(),
    } as unknown as AdminUser;
  } catch (error) {
    console.error("Error in verifyAdminCredentials:", error);
    return null;
  }
}

export async function getAdminUserById(id: string): Promise<AdminUser | null> {
  const client = await clientPromise;
  const db = client.db();
  
  try {
    const objectId = new ObjectId(id);
    const user = await db.collection('adminUsers').findOne({ _id: objectId });
    
    if (!user) return null;
    
    return {
      ...user,
      _id: user._id.toString()
    } as unknown as AdminUser;
  } catch (error) {
    console.error("Invalid ObjectId format:", error);
    return null;
  }
}

export async function getAllAdminUsers(): Promise<AdminUser[]> {
  const client = await clientPromise;
  const db = client.db();
  
  const users = await db.collection('adminUsers').find({}).toArray();
  
  return users.map(user => ({
    ...user,
    _id: user._id.toString()
  })) as unknown as AdminUser[];
}

/**
 * Delete an admin user by ID
 * @param adminId The MongoDB ObjectId of the admin to delete
 * @returns Promise<boolean> True if deletion was successful
 */
export async function deleteAdminUser(adminId: string): Promise<boolean> {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Check if adminId is a valid ObjectId
    if (!ObjectId.isValid(adminId)) {
      console.error('Invalid ObjectId format:', adminId);
      return false;
    }
    
    // Delete the admin user
    const result = await db
      .collection('adminUsers')
      .deleteOne({ _id: new ObjectId(adminId) });
    
    return result.deletedCount === 1;
  } catch (error) {
    console.error('Error deleting admin user:', error);
    return false;
  }
}

/**
 * Get admin statistics including counts
 * @returns Promise with statistics object
 */
export async function getAdminStats() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Get current date and calculate relevant dates for stats
    const currentDate = new Date();
    
    // First day of this month
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    // First day of last month
    const startOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    startOfLastMonth.setHours(0, 0, 0, 0);
    
    // Format dates for MongoDB queries
    const currentDateStr = currentDate.toISOString().split('T')[0];
    
    // FIXED: Query adminUsers collection instead of users collection
    const totalAdmins = await db.collection("adminUsers").countDocuments({
      role: { $in: ["admin", "superadmin"] }
    });
    
    const superAdmins = await db.collection("adminUsers").countDocuments({
      role: "superadmin"
    });
    
    const regularAdmins = await db.collection("adminUsers").countDocuments({
      role: "admin"
    });
    
    // If no createdAt field exists in documents, use a fallback
    let newAdminsThisMonth = 0;
    try {
      newAdminsThisMonth = await db.collection("adminUsers").countDocuments({
        role: { $in: ["admin", "superadmin"] },
        createdAt: { $gte: startOfMonth.toISOString() }
      });
    } catch (err) {
      console.log("Could not query by createdAt timestamp: ", err);
      // Fallback - just show total count if we can't filter by date
    }
    
    // Calculate event statistics (unchanged)
    const totalEvents = await db.collection("events").countDocuments();
    
    const eventsThisMonth = await db.collection("events").countDocuments({
      createdAt: { $gte: startOfMonth.toISOString() }
    });

    // Get upcoming events (events with dates >= current date)
    const upcomingEvents = await db.collection("events").countDocuments({
      date: { $gte: currentDateStr }
    });
    
    // Get past events (events with dates < current date)
    const pastEvents = await db.collection("events").countDocuments({
      date: { $lt: currentDateStr }
    });
    
    // Get events created in the last month to calculate change
    const eventsLastMonth = await db.collection("events").countDocuments({
      createdAt: { 
        $gte: startOfLastMonth.toISOString(),
        $lt: startOfMonth.toISOString()
      }
    });
    
    // Calculate percent change
    const eventChange = eventsLastMonth === 0 
      ? 100 // If no events last month, growth is 100%
      : Math.round((eventsThisMonth - eventsLastMonth) / eventsLastMonth * 100);
    
    return {
      totalAdmins,
      superAdmins,
      regularAdmins,
      newAdminsThisMonth,
      events: {
        total: totalEvents,
        thisMonth: eventsThisMonth,
        upcoming: upcomingEvents,
        past: pastEvents,
        change: eventChange
      }
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    // Return default values on error rather than throwing
    return {
      totalAdmins: 0,
      superAdmins: 0,
      regularAdmins: 0,
      newAdminsThisMonth: 0,
      events: {
        total: 0,
        thisMonth: 0,
        upcoming: 0,
        past: 0,
        change: 0
      }
    };
  }
}
