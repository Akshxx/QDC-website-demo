export type TeamCategory = 'administration' | 'team';
export type TeamSubcategory = 'founding' | 'current' | null;

// Fix hierarchy levels to include all role options
export type HierarchyLevel = 
  // Administration levels
  | 'dean'
  | 'chairperson'
  | 'associate-chairperson'
  | 'hod'
  // Faculty levels
  | 'faculty-convenor'
  | 'faculty-co-convenor'
  // Founding members
  | 'founding-member'
  // Current team (Core Team) hierarchy
  | 'president'
  | 'vice-president'
  | 'secretary'
  | 'vice-secretary'
  // Domain leads and members
  | 'domain-lead'
  | 'associate-lead'
  | 'associate'
  | 'member'
  // Legacy value - keeping for compatibility 
  | 'current-member';

// Fix the TeamDomain type by adding separators between union values
export type TeamDomain = 
  | 'web-development'
  | 'cloud-computing'
  | 'events'
  | 'corporate'
  | 'creatives'
  | null;

export interface TeamMember {
  _id?: string;
  name: string;
  position: string;
  hierarchyLevel: HierarchyLevel; 
  category: TeamCategory;
  subcategory?: TeamSubcategory;
  domain?: TeamDomain; // Allow domain to be undefined or one of the domain types
  email?: string;
  phone?: string;
  image?: string;
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  displayOrder?: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TeamMemberFormData extends Omit<TeamMember, '_id' | 'createdAt' | 'updatedAt'> {}
