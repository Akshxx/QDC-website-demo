"use client";

import React, { useState, useEffect } from "react"; // Explicitly import React
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { TeamMember } from "@/types/team";

export default function TeamManagementPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"administration" | "team">("administration");
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Determine if user is superadmin
  const isSuperAdmin = session?.user?.role === "superadmin";

  // Fetch team members
  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/team');
      
      if (!res.ok) {
        throw new Error('Failed to fetch team members');
      }
      
      const data = await res.json();
      setMembers(data.members || []);
      setError("");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/admin");
    }
    
    if (status === "authenticated") {
      fetchTeamMembers();
    }
  }, [status, router]);

  // Delete team member
  const handleDeleteMember = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) {
      return;
    }
    
    try {
      const res = await fetch(`/api/team/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        throw new Error('Failed to delete team member');
      }
      
      // Remove from state
      setMembers(prevMembers => prevMembers.filter(member => member._id !== id));
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
    }
  };

  // Filter members based on active tab
  const filteredMembers = members.filter(member => member.category === activeTab);
  
  // Get display name for hierarchy level
  const getHierarchyName = (level: string): string => {
    switch (level) {
      // Administration roles
      case 'dean': return 'Dean';
      case 'chairperson': return 'Chairperson';
      case 'associate-chairperson': return 'Associate Chairperson';
      case 'hod': return 'HOD';
      // Faculty roles
      case 'faculty-convenor': return 'Faculty Convenor';
      case 'faculty-co-convenor': return 'Faculty Co-Convenor';
      // Founding team
      case 'founding-member': return 'Founding Team';
      // Executive board
      case 'president': return 'President';
      case 'vice-president': return 'Vice President';
      case 'secretary': return 'Secretary';
      case 'vice-secretary': return 'Vice Secretary';
      // Domain roles
      case 'domain-lead': return 'Domain Lead';
      case 'associate-lead': return 'Associate Lead';
      case 'associate': return 'Associate';
      case 'member': return 'Member';
      // Legacy
      case 'current-member': return 'Current Team';
      default: return level;
    }
  };

  // Helper function to check if admin can delete this member
  const canDeleteMember = (member: TeamMember): boolean => {
    // Super admins can delete any member
    if (isSuperAdmin) return true;
    
    // Regular admins can now delete core team members including executive board
    return ['member', 'associate', 'associate-lead', 'domain-lead',
            'president', 'vice-president', 'secretary', 'vice-secretary'].includes(member.hierarchyLevel);
  };

  // Enhanced debug function with better domain handling
  function formatDomainDisplay(domain: any): string {
    // Even more detailed debugging
    console.log("Domain value received:", domain);
    console.log("Domain type:", typeof domain);
    console.log("Domain stringified:", JSON.stringify(domain));
    
    if (!domain) return "Unknown";
    
    try {
      // Handle string directly
      if (typeof domain === 'string') {
        return domain.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      }
      
      // Handle any other type by converting to string
      return String(domain);
    } catch (error) {
      console.error("Error formatting domain:", error);
      return "Error";
    }
  }

  // Completely rewritten domain display function with better visibility
  function getDomainDisplay(member: TeamMember): React.ReactNode | null {
    console.log(`Domain for ${member.name}:`, member.domain);
    
    // Always check if domain exists and is not null or empty string
    if (!member.domain) {
      // Return null for empty domains to avoid showing empty labels
      return null;
    }
    
    // Format domain text for display
    let domainText;
    try {
      if (typeof member.domain === 'string') {
        domainText = member.domain.split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      } else {
        domainText = String(member.domain);
      }
    } catch (error) {
      console.error("Error formatting domain:", error);
      domainText = "Unknown";
    }
    
    // Return a properly styled domain label
    return (
      <div className="mt-2">
        <span className="inline-flex items-center px-3 py-1 rounded text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 shadow-sm">
          {domainText}
        </span>
      </div>
    );
  }

  // Loading state
  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto py-8">
          {/* Page header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team Management</h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Manage administration and team members displayed on your website
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/team/add"
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
              >
                Add New Member
              </Link>
              <Link
                href="/admin/home"
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Tabs for Administration / Team */}
          <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap -mb-px">
              <button
                onClick={() => setActiveTab("administration")}
                className={`inline-flex items-center px-4 py-2 mr-2 ${
                  activeTab === "administration" 
                    ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400" 
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Administration
              </button>
              <button
                onClick={() => setActiveTab("team")}
                className={`inline-flex items-center px-4 py-2 ${
                  activeTab === "team" 
                    ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400" 
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Team Members
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-md">
              {error}
            </div>
          )}

          {/* Add role-based permissions info alert */}
          {!isSuperAdmin && (
            <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                As a regular administrator, you can add and manage core team members, including the executive board.
                Administration members and founding team members can only be managed by super administrators.
              </p>
            </div>
          )}

          {/* Team members list */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            {filteredMembers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Position
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredMembers.map((member) => (
                      <tr key={member._id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {member.image ? (
                                <img 
                                  className="h-10 w-10 rounded-full object-cover" 
                                  src={member.image} 
                                  alt={member.name} 
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                                  {member.name.substring(0, 1)}
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {member.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {member.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-200 mb-1">
                            {member.position}
                          </div>
                          
                          {/* Improved domain display with better visibility */}
                          {member.domain && getDomainDisplay(member)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                            {getHierarchyName(member.hierarchyLevel)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            member.isActive
                              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                          }`}>
                            {member.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link 
                              href={`/admin/team/edit/${member._id}`}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                            >
                              Edit
                            </Link>
                            {canDeleteMember(member) && (
                              <button
                                onClick={() => member._id && handleDeleteMember(member._id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                              >
                                Delete
                              </button>
                            )}
                            {!canDeleteMember(member) && (
                              <span
                                className="text-gray-400 dark:text-gray-500 cursor-not-allowed relative group"
                                title="Only super admins can delete this type of team member"
                              >
                                Delete
                                <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 -mt-12 -ml-10 w-48">
                                  Only super admins can delete this team member
                                </span>
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                {loading ? "Loading..." : "No team members found in this category."}
                <div className="mt-2">
                  <Link 
                    href="/admin/team/add" 
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Add your first team member
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
