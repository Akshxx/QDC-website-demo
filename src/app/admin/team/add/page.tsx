"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { TeamMemberFormData, HierarchyLevel, TeamDomain, TeamCategory } from "@/types/team";
import ImageUploader from "@/components/ImageUploader";

export default function AddTeamMemberPage() {
  const initialFormData: TeamMemberFormData = {
    name: "",
    position: "",
    hierarchyLevel: "member", // Changed default to member
    category: "team",
    subcategory: "current",
    domain: null,
    email: "",
    phone: "",
    image: "",
    bio: "",
    socialLinks: {
      linkedin: "",
      twitter: "",
      github: "",
      website: "",
    },
    isActive: true,
    displayOrder: 0
  };

  const [formData, setFormData] = useState<TeamMemberFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Determine if user is superadmin
  const isSuperAdmin = session?.user?.role === "superadmin";

  // Define all hierarchy level options with updated structure
  const allHierarchyLevels: { 
    value: HierarchyLevel, 
    label: string, 
    category: TeamCategory, // Fix: Use TeamCategory type instead of string literal
    requiresDomain?: boolean 
  }[] = [
    // Administration section
    { value: 'dean', label: 'Dean', category: 'administration' },
    { value: 'chairperson', label: 'Chairperson', category: 'administration' },
    { value: 'associate-chairperson', label: 'Associate Chairperson', category: 'administration' },
    { value: 'hod', label: 'Head of Department (HOD)', category: 'administration' },
    
    // Faculty section
    { value: 'faculty-convenor', label: 'Faculty Convenor', category: 'team' },
    { value: 'faculty-co-convenor', label: 'Faculty Co-Convenor', category: 'team' },
    
    // Founding team
    { value: 'founding-member', label: 'Founding Team Member', category: 'team' },
    
    // Executive board (Core Team)
    { value: 'president', label: 'President', category: 'team' },
    { value: 'vice-president', label: 'Vice President', category: 'team' },
    { value: 'secretary', label: 'Secretary', category: 'team' },
    { value: 'vice-secretary', label: 'Vice Secretary', category: 'team' },
    
    // Domain-based roles (Core Team)
    { value: 'domain-lead', label: 'Domain Lead', category: 'team', requiresDomain: true },
    { value: 'associate-lead', label: 'Associate Lead', category: 'team', requiresDomain: true },
    { value: 'associate', label: 'Associate', category: 'team', requiresDomain: true },
    { value: 'member', label: 'Member', category: 'team', requiresDomain: true },
  ];

  // Define domain options
  const domainOptions = [
    { value: 'web-development', label: 'Technical - Web Development' },
    { value: 'cloud-computing', label: 'Technical - Cloud Computing' },
    { value: 'events', label: 'Events' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'creatives', label: 'Creatives' },
  ];
  
  // Filter hierarchy levels based on role
  const hierarchyLevels = isSuperAdmin 
    ? allHierarchyLevels  // Superadmin sees all options
    : allHierarchyLevels.filter(level => 
        // Allow regular admins to add domain team members AND executive board members
        ['domain-lead', 'associate-lead', 'associate', 'member',
         'president', 'vice-president', 'secretary', 'vice-secretary'].includes(level.value));

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested socialLinks
    if (name.startsWith('socialLinks.')) {
      const socialLinkKey = name.split('.')[1] as keyof typeof formData.socialLinks;
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialLinkKey]: value
        }
      }));
      return;
    }
    
    // Handle hierarchyLevel selection which affects domain requirement
    if (name === 'hierarchyLevel') {
      const selectedLevel = hierarchyLevels.find(level => level.value === value);
      if (selectedLevel) {
        let subcategory: 'founding' | 'current' | null = null;
        
        if (value === 'founding-member') subcategory = 'founding';
        else if (['president', 'vice-president', 'secretary', 'vice-secretary', 
                  'domain-lead', 'associate-lead', 'associate', 'member'].includes(value as HierarchyLevel)) {
          subcategory = 'current';
        }
        
        // Check if domain is required but not set
        const requiresDomain = selectedLevel.requiresDomain === true;
        
        setFormData(prev => ({
          ...prev,
          hierarchyLevel: value as HierarchyLevel,
          category: selectedLevel.category as TeamCategory, // Fix: Cast to TeamCategory
          subcategory,
          // Reset domain if not needed for this role
          domain: requiresDomain ? (prev.domain || null) : null
        }));
      }
      return;
    }
    
    // Handle domain field explicitly
    if (name === 'domain') {
      setFormData(prev => ({
        ...prev,
        domain: value as TeamDomain || null
      }));
      return;
    }
    
    // Handle regular input fields
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Handle image change from ImageUploader component
  const handleImageChange = (imageData: string) => {
    setFormData(prev => ({
      ...prev,
      image: imageData
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create team member');
      }

      setSuccess("Team member created successfully!");
      
      // Reset form
      setFormData(initialFormData);
      
      // Redirect after showing success message
      setTimeout(() => {
        router.push("/admin/team");
      }, 1500);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/admin");
    }
  }, [status, router]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  // Render form
  if (status === "authenticated") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-3xl mx-auto py-8">
          {/* Page header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Team Member</h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {isSuperAdmin 
                  ? "Create any type of team member"
                  : "Create a new current team member"}
              </p>
            </div>
            <Link
              href="/admin/team"
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Back to Team List
            </Link>
          </div>

          {/* Show a role-based permission alert for regular admins */}
          {!isSuperAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
            >
              <p className="text-sm text-blue-800 dark:text-blue-300">
                As a regular administrator, you can add and manage core team members, including the executive board.
                Contact a super administrator to add administration members or founding team members.
              </p>
            </motion.div>
          )}

          {/* Form card */}
          <motion.div 
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-6">
              {/* Success/Error messages */}
              {success && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-md">
                  {success}
                </div>
              )}
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-md">
                  {error}
                </div>
              )}
              
              {/* Add Team Member Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Basic Information</h3>
                  
                  <div className="space-y-4">
                    {/* Name and Position */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Position/Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="position"
                          name="position"
                          type="text"
                          required
                          value={formData.position}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600"
                        />
                      </div>
                    </div>
                    
                    {/* Hierarchy Level */}
                    <div>
                      <label htmlFor="hierarchyLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Role in Organization <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="hierarchyLevel"
                        name="hierarchyLevel"
                        required
                        value={formData.hierarchyLevel}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600"
                      >
                        <optgroup label="Core Team - Executive Board">
                          <option value="president">President</option>
                          <option value="vice-president">Vice President</option>
                          <option value="secretary">Secretary</option>
                          <option value="vice-secretary">Vice Secretary</option>
                        </optgroup>
                        
                        <optgroup label="Core Team - Domain Roles">
                          <option value="domain-lead">Domain Lead</option>
                          <option value="associate-lead">Associate Lead</option>
                          <option value="associate">Associate</option>
                          <option value="member">Member</option>
                        </optgroup>
                        
                        {isSuperAdmin && (
                          <>
                            <optgroup label="Administration">
                              <option value="dean">Dean</option>
                              <option value="chairperson">Chairperson</option>
                              <option value="associate-chairperson">Associate Chairperson</option>
                              <option value="hod">Head of Department (HOD)</option>
                            </optgroup>
                            
                            <optgroup label="Faculty">
                              <option value="faculty-convenor">Faculty Convenor</option>
                              <option value="faculty-co-convenor">Faculty Co-Convenor</option>
                            </optgroup>
                            
                            <optgroup label="Other">
                              <option value="founding-member">Founding Team Member</option>
                            </optgroup>
                          </>
                        )}
                      </select>
                      {!isSuperAdmin && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          As a regular admin, you can create core team members including executive board and domain members.
                        </p>
                      )}
                    </div>
                    
                    {/* Order within hierarchy */}
                    <div>
                      <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Display Order (within same role)
                      </label>
                      <input
                        id="displayOrder"
                        name="displayOrder"
                        type="number"
                        min="0"
                        value={formData.displayOrder}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Lower numbers appear first in the list when multiple people have the same role.
                      </p>
                    </div>
                    
                    {/* Active Status */}
                    <div className="flex items-center">
                      <input
                        id="isActive"
                        name="isActive"
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Active (visible on website)
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Domain selection - only show if the selected role requires a domain */}
                {(formData.hierarchyLevel === 'domain-lead' || 
                  formData.hierarchyLevel === 'associate-lead' ||
                  formData.hierarchyLevel === 'associate' ||
                  formData.hierarchyLevel === 'member') && (
                  <div>
                    <label htmlFor="domain" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Domain <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="domain"
                      name="domain"
                      required
                      value={formData.domain || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600"
                    >
                      <option value="" disabled>Select a domain</option>
                      {domainOptions.map(domain => (
                        <option key={domain.value} value={domain.value}>{domain.label}</option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Select the domain this team member belongs to
                    </p>
                  </div>
                )}
                
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="text"
                        value={formData.phone || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Profile */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Profile Details</h3>
                  
                  <div className="space-y-4">
                    {/* Replace image URL input with ImageUploader */}
                    <ImageUploader
                      currentImage={formData.image || ""}
                      onImageChange={handleImageChange}
                      className="mb-4"
                    />
                    
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Biography/Description
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={formData.bio || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Social Links */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Social Links</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="socialLinks.linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        LinkedIn
                      </label>
                      <input
                        id="socialLinks.linkedin"
                        name="socialLinks.linkedin"
                        type="text"
                        value={formData.socialLinks?.linkedin || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="socialLinks.twitter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Twitter
                      </label>
                      <input
                        id="socialLinks.twitter"
                        name="socialLinks.twitter"
                        type="text"
                        value={formData.socialLinks?.twitter || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="socialLinks.github" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        GitHub
                      </label>
                      <input
                        id="socialLinks.github"
                        name="socialLinks.github"
                        type="text"
                        value={formData.socialLinks?.github || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="socialLinks.website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Personal Website
                      </label>
                      <input
                        id="socialLinks.website"
                        name="socialLinks.website"
                        type="text"
                        value={formData.socialLinks?.website || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Form submission buttons */}
                <div className="flex justify-end gap-4 pt-4">
                  <Link
                    href="/admin/team"
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium disabled:opacity-50 transition-colors flex items-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      "Create Team Member"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
}
