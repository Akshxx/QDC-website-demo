import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/**
 * Updates profile image across all relevant collections
 */
export async function syncProfileImage(userId: string, imageData: string): Promise<boolean> {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // 1. Update teamMemberProfile with both image and imageUrl fields
    await db.collection('teamMemberProfiles').updateOne(
      { userId },
      { 
        $set: { 
          image: imageData,
          imageUrl: imageData, // Make sure both fields are updated
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
    
    // 2. Find the related teamMember document via userAccountId
    const teamMember = await db.collection('teamMembers').findOne({ userAccountId: userId });
    
    // 3. Update teamMember if found
    if (teamMember) {
      await db.collection('teamMembers').updateOne(
        { userAccountId: userId },
        {
          $set: {
            image: imageData,
            updatedAt: new Date()
          }
        }
      );
    }
    
    return true;
  } catch (error) {
    console.error("Error syncing profile image:", error);
    return false;
  }
}

/**
 * Updates profile information across all relevant collections
 */
export async function syncProfileData(userId: string, profileData: any): Promise<boolean> {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const { bio, phone, socialLinks } = profileData;
    
    // 1. Update teamMemberProfile
    await db.collection('teamMemberProfiles').updateOne(
      { userId },
      { 
        $set: { 
          bio,
          phone,
          socialLinks,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
    
    // 2. Update teamMember if exists
    const teamMember = await db.collection('teamMembers').findOne({ userAccountId: userId });
    
    if (teamMember) {
      await db.collection('teamMembers').updateOne(
        { userAccountId: userId },
        {
          $set: {
            bio,
            phone,
            socialLinks,
            updatedAt: new Date()
          }
        }
      );
    }
    
    return true;
  } catch (error) {
    console.error("Error syncing profile data:", error);
    return false;
  }
}

/**
 * Gets combined profile data from multiple collections
 */
export async function getCompleteProfileData(userId: string) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Get user account data
    const user = await db.collection('teamMemberUsers').findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      return null;
    }
    
    // Get profile data
    const profile = await db.collection('teamMemberProfiles').findOne({ userId });
    
    // If profile exists but we also have a team member entry, merge image data
    if (profile) {
      // Check if this user has a team member entry that might have newer image
      const teamMember = await db.collection('teamMembers').findOne({ userAccountId: userId });
      
      if (teamMember && teamMember.image) {
        // If team member exists and has an image, make sure profile has the same image
        profile.image = teamMember.image;
        
        // Update the profile image silently to sync
        await db.collection('teamMemberProfiles').updateOne(
          { userId },
          { 
            $set: { 
              image: teamMember.image,
              imageUrl: teamMember.image,
              updatedAt: new Date()
            }
          }
        );
      }
    }
    
    // Return combined data
    return {
      ...user,
      ...profile
    };
  } catch (error) {
    console.error("Error getting complete profile data:", error);
    return null;
  }
}
