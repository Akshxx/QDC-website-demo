"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { TeamMemberFormData, HierarchyLevel, TeamMember, TeamDomain, TeamCategory } from "@/types/team";
import ImageUploader from "@/components/ImageUploader";

export default function EditTeamMemberPage() {
  const params = useParams();
  const memberId = params.id as string;

  const [formData, setFormData] = useState<TeamMemberFormData | null>(null);
  const [originalHierarchy, setOriginalHierarchy] = useState<HierarchyLevel | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [permissionError, setPermissionError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();
  const { data: session, status } = useSession();

  const isSuperAdmin = session?.user?.role === "superadmin";

  const allHierarchyLevels: { 
    value: HierarchyLevel, 
    label: string, 
    category: TeamCategory,
    requiresDomain?: boolean 
  }[] = [
    { value: 'dean', label: 'Dean', category: 'administration' },
    { value: 'chairperson', label: 'Chairperson', category: 'administration' },
    { value: 'associate-chairperson', label: 'Associate Chairperson', category: 'administration' },
    { value: 'hod', label: 'Head of Department (HOD)', category: 'administration' },
    { value: 'faculty-convenor', label: 'Faculty Convenor', category: 'team' },
    { value: 'faculty-co-convenor', label: 'Faculty Co-Convenor', category: 'team' },
    { value: 'founding-member', label: 'Founding Team Member', category: 'team' },
    { value: 'president', label: 'President', category: 'team' },
    { value: 'vice-president', label: 'Vice President', category: 'team' },
    { value: 'secretary', label: 'Secretary', category: 'team' },
    { value: 'vice-secretary', label: 'Vice Secretary', category: 'team' },
    { value: 'domain-lead', label: 'Domain Lead', category: 'team', requiresDomain: true },
    { value: 'associate-lead', label: 'Associate Lead', category: 'team', requiresDomain: true },
    { value: 'associate', label: 'Associate', category: 'team', requiresDomain: true },
    { value: 'member', label: 'Member', category: 'team', requiresDomain: true },
  ];

  const domainOptions = [
    { value: 'web-development', label: 'Technical - Web Development' },
    { value: 'cloud-computing', label: 'Technical - Cloud Computing' },
    { value: 'events', label: 'Events' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'creatives', label: 'Creatives' },
  ];

  useEffect(() => {
    const fetchTeamMember = async () => {
      if (!memberId || status !== 'authenticated') return;

      try {
        setLoading(true);
        const res = await fetch(`/api/team/${memberId}`);

        if (!res.ok) {
          throw new Error('Failed to fetch team member');
        }

        const member = await res.json();

        setOriginalHierarchy(member.hierarchyLevel);

        setFormData({
          name: member.name || "",
          position: member.position || "",
          hierarchyLevel: member.hierarchyLevel,
          category: member.category,
          subcategory: member.subcategory || null,
          email: member.email || "",
          phone: member.phone || "",
          image: member.image || "",
          bio: member.bio || "",
          socialLinks: member.socialLinks || {
            linkedin: "",
            twitter: "",
            github: "",
            website: "",
          },
          isActive: member.isActive ?? true,
          displayOrder: member.displayOrder || 0,
          domain: member.domain || null,
        });

        if (!isSuperAdmin && 
            !['member', 'associate', 'associate-lead', 'domain-lead', 
              'president', 'vice-president', 'secretary', 'vice-secretary'].includes(member.hierarchyLevel)) {
          setPermissionError("You don't have permission to edit this team member. Only super administrators can edit administration members or founding team members.");
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMember();
  }, [memberId, status, isSuperAdmin]);

  const hierarchyLevels = isSuperAdmin 
    ? allHierarchyLevels
    : [
        { value: 'president', label: 'President', category: 'team' },
        { value: 'vice-president', label: 'Vice President', category: 'team' },
        { value: 'secretary', label: 'Secretary', category: 'team' },
        { value: 'vice-secretary', label: 'Vice Secretary', category: 'team' },
        { value: 'domain-lead', label: 'Domain Lead', category: 'team', requiresDomain: true },
        { value: 'associate-lead', label: 'Associate Lead', category: 'team', requiresDomain: true },
        { value: 'associate', label: 'Associate', category: 'team', requiresDomain: true },
        { value: 'member', label: 'Member', category: 'team', requiresDomain: true },
      ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!formData) return;

    const { name, value } = e.target;

    if (name.startsWith('socialLinks.')) {
      const socialLinkKey = name.split('.')[1] as keyof typeof formData.socialLinks;
      setFormData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          socialLinks: {
            ...prev.socialLinks,
            [socialLinkKey]: value
          }
        } as TeamMemberFormData;
      });
      return;
    }

    if (name === 'hierarchyLevel') {
      const selectedLevel = hierarchyLevels.find(level => level.value === value);
      if (selectedLevel) {
        let subcategory: 'founding' | 'current' | null = null;
        if (value === 'founding-member') subcategory = 'founding';
        else if (['president', 'vice-president', 'secretary', 'vice-secretary', 
                 'domain-lead', 'associate-lead', 'associate', 'member'].includes(value as HierarchyLevel)) {
          subcategory = 'current';
        }

        const requiresDomain = selectedLevel.requiresDomain === true;

        setFormData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            hierarchyLevel: value as HierarchyLevel,
            category: selectedLevel.category as TeamCategory,
            subcategory,
            domain: requiresDomain ? (prev.domain || null) : null
          } as TeamMemberFormData;
        });
      }
      return;
    }

    if (name === 'domain') {
      setFormData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          domain: value ? value as TeamDomain : null
        } as TeamMemberFormData;
      });
      return;
    }

    setFormData((prev) => {
      if (!prev) return prev;
      return { 
        ...prev, 
        [name]: value 
      } as TeamMemberFormData;
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;

    const { name, checked } = e.target;
    setFormData((prev) => {
      if (!prev) return prev;
      return { 
        ...prev, 
        [name]: checked 
      } as TeamMemberFormData;
    });
  };

  const handleImageChange = (imageData: string) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        image: imageData
      } as TeamMemberFormData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData) return;

    if (!isSuperAdmin && originalHierarchy && 
        !['member', 'associate', 'associate-lead', 'domain-lead',
          'president', 'vice-president', 'secretary', 'vice-secretary'].includes(originalHierarchy)) {
      setError("You don't have permission to edit this team member");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/team/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update team member');
      }

      setSuccess("Team member updated successfully!");
      
      setTimeout(() => {
        router.push("/admin/team");
      }, 1500);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/admin");
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Team Member Not Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "The team member you're looking for could not be loaded."}
          </p>
          <Link
            href="/admin/team"
            className="inline-block px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Team List
          </Link>
        </div>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-3xl mx-auto py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Team Member</h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Update team member information
              </p>
            </div>
            <Link
              href="/admin/team"
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Back to Team List
            </Link>
          </div>

          {permissionError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            >
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-sm text-red-800 dark:text-red-300 font-medium">
                    {permissionError}
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                    You can view the information but cannot make changes. Please contact a super administrator if changes are needed.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div 
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-6">
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
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Basic Information</h3>
                  
                  <div className="space-y-4">
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
                          disabled={!!permissionError}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
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
                          disabled={!!permissionError}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                    
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
                        disabled={!isSuperAdmin || !!permissionError}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
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
                      {!isSuperAdmin && !permissionError && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          As a regular admin, you cannot change the role of team members.
                        </p>
                      )}
                    </div>
                    
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
                          disabled={!!permissionError}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
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
                        disabled={!!permissionError}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Lower numbers appear first in the list when multiple people have the same role.
                      </p>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="isActive"
                        name="isActive"
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={handleCheckboxChange}
                        disabled={!!permissionError}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Active (visible on website)
                      </label>
                    </div>
                  </div>
                </div>
                
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
                        disabled={!!permissionError}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
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
                        disabled={!!permissionError}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Profile Details</h3>
                  
                  <div className="space-y-4">
                    <ImageUploader
                      currentImage={formData?.image || ""}
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
                        disabled={!!permissionError}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
                
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
                        disabled={!!permissionError}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
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
                        disabled={!!permissionError}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
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
                        disabled={!!permissionError}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
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
                        disabled={!!permissionError}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-4 pt-4">
                  <Link
                    href="/admin/team"
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={submitting || !!permissionError}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium disabled:opacity-50 transition-colors flex items-center"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </>
                    ) : (
                      "Update Team Member"
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
