import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';
import { TeamMember } from '@/types/team';

// Define TeamMemberUser type
interface TeamMemberUser {
  _id: string | ObjectId;
  name: string;
  username: string;
  email: string;
  password: string;
  position: string;
  hierarchyLevel: string;
  domain?: string; // Explicitly defined as optional
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create a new team member user account
 */
export async function createUserAccount(userData: Omit<TeamMemberUser, '_id'>): Promise<TeamMemberUser | null> {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Check for existing user
    const existingUser = await db.collection('teamMemberUsers').findOne({
      $or: [
        { username: userData.username },
        { email: userData.email }
      ]
    });
    
    if (existingUser) {
      return null;
    }
    
    // Log the domain value for debugging
    console.log("createUserAccount received domain:", userData.domain);
    
    // Ensure the domain field is explicitly included
    const userToInsert = {
      ...userData,
      domain: userData.domain || null // Explicitly handle the domain field
    };
    
    // Insert user with all fields including domain
    const result = await db.collection('teamMemberUsers').insertOne(userToInsert);
    
    if (result.acknowledged) {
      const newUser = await db.collection('teamMemberUsers').findOne({ _id: result.insertedId });
      
      // Add explicit null check before using newUser
      if (!newUser) {
        console.error("User was inserted but could not be retrieved");
        return null;
      }
      
      // Now it's safe to access properties on newUser
      console.log("Created user in database:", {
        ...newUser,
        password: "[REDACTED]",
        domain: newUser.domain // Explicitly log the domain to verify
      });
      
      return newUser as TeamMemberUser;
    }
    
    return null;
  } catch (error) {
    console.error("Error creating user account:", error);
    return null;
  }
}

/**
 * Get a team member user by username
 */
export async function getUserByUsername(username: string): Promise<TeamMemberUser | null> {
  const client = await clientPromise;
  const db = client.db();
  
  const user = await db.collection('teamMemberUsers').findOne({ username });
  
  if (!user) {
    return null;
  }
  
  return {
    ...user,
    _id: user._id.toString()
  } as unknown as TeamMemberUser;
}

/**
 * Get a team member user by ID
 */
export async function getUserById(id: string): Promise<TeamMemberUser | null> {
  const client = await clientPromise;
  const db = client.db();
  
  if (!ObjectId.isValid(id)) {
    return null;
  }
  
  const user = await db.collection('teamMemberUsers').findOne({ _id: new ObjectId(id) });
  
  if (!user) {
    return null;
  }
  
  return {
    ...user,
    _id: user._id.toString()
  } as unknown as TeamMemberUser;
}

/**
 * Get all team member users
 */
export async function getAllTeamMemberUsers(): Promise<TeamMemberUser[]> {
  const client = await clientPromise;
  const db = client.db();
  
  const users = await db.collection('teamMemberUsers').find({}).toArray();
  
  return users.map(user => ({
    ...user,
    _id: user._id.toString()
  })) as unknown as TeamMemberUser[];
}

/**
 * Approve a team member user
 */
export async function approveTeamMemberUser(id: string): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db();
  
  if (!ObjectId.isValid(id)) {
    return false;
  }
  
  const result = await db.collection('teamMemberUsers').updateOne(
    { _id: new ObjectId(id) },
    { $set: { 
        isApproved: true,
        updatedAt: new Date() 
      } 
    }
  );
  
  // If approval is successful, also sync the user data to the team members collection
  if (result.modifiedCount === 1) {
    await syncTeamMemberFromUser(id);
  }
  
  return result.modifiedCount === 1;
}

/**
 * Delete a team member user
 */
export async function deleteTeamMemberUser(id: string): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db();
  
  if (!ObjectId.isValid(id)) {
    return false;
  }
  
  const result = await db.collection('teamMemberUsers').deleteOne({ _id: new ObjectId(id) });
  
  // Also remove any profile data
  if (result.deletedCount === 1) {
    await db.collection('teamMemberProfiles').deleteOne({ userId: id });
    // Also remove any team member entry
    await db.collection('teamMembers').deleteOne({ userAccountId: id });
  }
  
  return result.deletedCount === 1;
}

/**
 * Get a user's profile
 */
export async function getUserProfile(userId: string): Promise<Partial<TeamMember> | null> {
  const client = await clientPromise;
  const db = client.db();
  
  if (!ObjectId.isValid(userId)) {
    return null;
  }
  
  // First check if user exists
  const user = await db.collection('teamMemberUsers').findOne({ _id: new ObjectId(userId) });
  
  if (!user) {
    return null;
  }
  
  // Try to find existing profile
  const profile = await db.collection('teamMemberProfiles').findOne({ userId: userId });
  
  if (!profile) {
    // Return basic profile with user data if no specific profile exists
    return {
      name: user.name,
      position: user.position,
      hierarchyLevel: user.hierarchyLevel,
      email: user.email
    };
  }
  
  return {
    ...profile,
    _id: profile._id.toString()
  } as unknown as Partial<TeamMember>;
}

/**
 * Update a user's profile
 */
export async function updateUserProfile(userId: string, profileData: Partial<TeamMember>): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db();
  
  if (!ObjectId.isValid(userId)) {
    return false;
  }
  
  // Check if profile already exists
  const existingProfile = await db.collection('teamMemberProfiles').findOne({ userId });
  
  // Create update data with only MongoDB compatible fields
  const updateData: any = {
    userId,
    updatedAt: new Date()
  };
  
  // Copy all fields from profileData except _id
  Object.keys(profileData).forEach(key => {
    if (key !== '_id') {
      updateData[key] = profileData[key as keyof typeof profileData];
    }
  });
  
  // Fix: Use separate variables for different result types
  if (existingProfile) {
    // Update existing profile
    const updateResult = await db.collection('teamMemberProfiles').updateOne(
      { userId },
      { $set: updateData }
    );
    
    // If user is approved, also sync the data to team members collection
    const user = await db.collection('teamMemberUsers').findOne({ _id: new ObjectId(userId) });
    if (user && user.isApproved) {
      await syncTeamMemberFromUser(userId);
    }
    
    return updateResult.modifiedCount === 1 || updateResult.matchedCount === 1;
  } else {
    // Create new profile
    updateData.createdAt = new Date();
    const insertResult = await db.collection('teamMemberProfiles').insertOne(updateData);
    
    // If user is approved, also sync the data to team members collection
    const user = await db.collection('teamMemberUsers').findOne({ _id: new ObjectId(userId) });
    if (user && user.isApproved) {
      await syncTeamMemberFromUser(userId);
    }
    
    return !!insertResult.insertedId;
  }
}

/**
 * Create or update team member from approved user
 */
export async function syncTeamMemberFromUser(userId: string): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db();
  
  if (!ObjectId.isValid(userId)) {
    return false;
  }
  
  // Get user and profile data
  const user = await db.collection('teamMemberUsers').findOne({ _id: new ObjectId(userId) });
  const profile = await db.collection('teamMemberProfiles').findOne({ userId });
  
  if (!user || !user.isApproved) {
    return false; // User not found or not approved
  }
  
  console.log("Syncing team member from user, user data:", {
    ...user,
    password: "[REDACTED]",
    domain: user.domain // Log to verify domain exists in user record
  });
  
  // Combine user and profile data - omit _id to avoid TypeScript errors
  const teamMemberData: any = {
    name: user.name,
    position: user.position,
    hierarchyLevel: user.hierarchyLevel,
    category: 'team', // All users are team members
    subcategory: 'current',
    email: user.email,
    phone: profile?.phone || '',
    image: profile?.image || '',
    bio: profile?.bio || '',
    socialLinks: profile?.socialLinks || {},
    isActive: true,
    // Fix: Get domain from user record first, then try profile as fallback
    domain: user.domain || profile?.domain || null,
    displayOrder: 0,
    updatedAt: new Date(),
    userAccountId: userId // Link to the user account
  };
  
  console.log("Team member data being saved with domain:", teamMemberData.domain);
  
  // Check if team member already exists
  const existingTeamMember = await db.collection('teamMembers').findOne({ userAccountId: userId });
  
  // Fix: Use separate variables for different result types
  if (existingTeamMember) {
    // Update existing team member
    const updateResult = await db.collection('teamMembers').updateOne(
      { userAccountId: userId },
      { $set: teamMemberData }
    );
    
    return updateResult.modifiedCount === 1 || updateResult.matchedCount === 1;
  } else {
    // Create new team member
    teamMemberData.createdAt = new Date();
    const insertResult = await db.collection('teamMembers').insertOne(teamMemberData);
    
    return !!insertResult.insertedId;
  }
}
