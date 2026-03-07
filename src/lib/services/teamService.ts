import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';
import { TeamMember, HierarchyLevel } from '@/types/team';

// Update the hierarchyOrder object to include all HierarchyLevel values
const hierarchyOrder: Record<HierarchyLevel, number> = {
  // Administration levels (lowest number = highest rank)
  'dean': 1,
  'chairperson': 2,
  'associate-chairperson': 3,
  'hod': 4,
  
  // Faculty levels
  'faculty-convenor': 5,
  'faculty-co-convenor': 6,
  
  // Founding team
  'founding-member': 7,
  
  // Executive board (Core Team)
  'president': 8,
  'vice-president': 9,
  'secretary': 10,
  'vice-secretary': 11,
  
  // Domain leads and members
  'domain-lead': 12,
  'associate-lead': 13,
  'associate': 14,
  'member': 15,
  
  // Legacy value
  'current-member': 16
};

/**
 * Create a new team member
 */
export async function createTeamMember(data: Omit<TeamMember, '_id' | 'createdAt' | 'updatedAt'>): Promise<TeamMember> {
  const client = await clientPromise;
  const db = client.db();
  
  const teamMemberData = {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const result = await db.collection('teamMembers').insertOne(teamMemberData);
  
  return {
    ...teamMemberData,
    _id: result.insertedId.toString()
  } as unknown as TeamMember;
}

/**
 * Get all team members
 */
export async function getAllTeamMembers(): Promise<TeamMember[]> {
  const client = await clientPromise;
  const db = client.db();
  
  const members = await db.collection('teamMembers').find({}).toArray();
  
  // Convert MongoDB documents to TeamMember objects with proper typing
  const teamMembers = members.map(member => ({
    ...member,
    _id: member._id.toString()
  })) as unknown as TeamMember[];
  
  // Sort by hierarchy level and then by displayOrder if available
  return teamMembers.sort((a, b) => {
    // First sort by hierarchy level order
    const orderA = hierarchyOrder[a.hierarchyLevel] || 999;
    const orderB = hierarchyOrder[b.hierarchyLevel] || 999;
    
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    
    // Then sort by displayOrder if within same hierarchy level
    return (a.displayOrder || 0) - (b.displayOrder || 0);
  });
}

/**
 * Get team member by ID
 */
export async function getTeamMemberById(id: string): Promise<TeamMember | null> {
  const client = await clientPromise;
  const db = client.db();
  
  if (!ObjectId.isValid(id)) {
    return null;
  }
  
  const member = await db.collection('teamMembers').findOne({ _id: new ObjectId(id) });
  
  if (!member) {
    return null;
  }
  
  return {
    ...member,
    _id: member._id.toString()
  } as unknown as TeamMember;
}

/**
 * Update team member
 */
export async function updateTeamMember(id: string, data: Partial<TeamMember>): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db();
  
  if (!ObjectId.isValid(id)) {
    return false;
  }
  
  // Create a new object for the update data to avoid modifying the original
  const updateData: Record<string, any> = {
    ...data,
    updatedAt: new Date()
  };
  
  // Don't allow updating _id, createdAt
  delete updateData._id;
  delete updateData.createdAt;
  
  const result = await db.collection('teamMembers').updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );
  
  return result.modifiedCount === 1;
}

/**
 * Delete team member
 */
export async function deleteTeamMember(id: string): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db();
  
  if (!ObjectId.isValid(id)) {
    return false;
  }
  
  const result = await db.collection('teamMembers').deleteOne({ _id: new ObjectId(id) });
  
  return result.deletedCount === 1;
}

/**
 * Get team statistics
 */
export async function getTeamStats() {
  const client = await clientPromise;
  const db = client.db();
  
  const totalMembers = await db.collection('teamMembers').countDocuments();
  const administrationMembers = await db.collection('teamMembers').countDocuments({ category: 'administration' });
  const teamMembers = await db.collection('teamMembers').countDocuments({ category: 'team' });
  const foundingMembers = await db.collection('teamMembers').countDocuments({ subcategory: 'founding' });
  const currentMembers = await db.collection('teamMembers').countDocuments({ subcategory: 'current' });
  
  return {
    totalMembers,
    administrationMembers,
    teamMembers,
    foundingMembers,
    currentMembers
  };
}

// If there's a function that sorts by hierarchy level, it should now work correctly
export const sortTeamMembersByHierarchy = (members: TeamMember[]): TeamMember[] => {
  return [...members].sort((a, b) => {
    // Primary sort by hierarchyOrder
    const orderDiff = hierarchyOrder[a.hierarchyLevel] - hierarchyOrder[b.hierarchyLevel];
    if (orderDiff !== 0) return orderDiff;
    
    // Secondary sort by displayOrder (if present)
    if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
      return a.displayOrder - b.displayOrder;
    }
    
    // Tertiary sort by name
    return a.name.localeCompare(b.name);
  });
};
