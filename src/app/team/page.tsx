"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TeamMember, TeamDomain } from '@/types/team';

// Move formatDomainName to be a standalone function outside of any component
// This makes it accessible to all components in the file
function formatDomainName(domain: string | null | undefined): string | null {
  if (!domain) return null;
  
  // Format domain text by capitalizing words and replacing hyphens with spaces
  return domain.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Add state for the selected member and modal visibility
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Open modal with selected member
  const openMemberDetail = (member: TeamMember) => {
    setSelectedMember(member);
    setShowModal(true);
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    // Restore scrolling
    document.body.style.overflow = 'auto';
  };

  // Close modal when pressing escape key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, []);

  // Fetch team members on component mount
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/public/team');
        
        if (!response.ok) {
          throw new Error('Failed to load team members');
        }
        
        const data = await response.json();
        setTeamMembers(data.members || []);
      } catch (err: any) {
        setError(err.message || 'Error loading team members');
        console.error('Error fetching team members:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeamMembers();
  }, []);

  // Group members by hierarchy level
  const administration = teamMembers.filter(member => member.category === 'administration');
  const teamSection = teamMembers.filter(member => member.category === 'team');
  
  // Further group team members by their specific roles
  const dean = administration.filter(member => member.hierarchyLevel === 'dean');
  const chairperson = administration.filter(member => member.hierarchyLevel === 'chairperson');
  const associateChairpersons = administration.filter(member => member.hierarchyLevel === 'associate-chairperson');
  const hod = administration.filter(member => member.hierarchyLevel === 'hod');
  
  const facultyConvenors = teamSection.filter(member => member.hierarchyLevel === 'faculty-convenor');
  const facultyCoConvenors = teamSection.filter(member => member.hierarchyLevel === 'faculty-co-convenor');
  const foundingMembers = teamSection.filter(member => member.hierarchyLevel === 'founding-member');
  
  // Core Team - Executive Board
  const executiveBoard = [
    ...teamSection.filter(member => member.hierarchyLevel === 'president'),
    ...teamSection.filter(member => member.hierarchyLevel === 'vice-president'),
    ...teamSection.filter(member => member.hierarchyLevel === 'secretary'),
    ...teamSection.filter(member => member.hierarchyLevel === 'vice-secretary'),
  ];
  
  // Core Team - Domain Leads
  const domainLeads = teamSection.filter(member => member.hierarchyLevel === 'domain-lead')
    .sort((a, b) => {
      // Sort by domain first, then by display order
      const domainA = (a.domain || '') as string;
      const domainB = (b.domain || '') as string;
      if (domainA !== domainB) return domainA > domainB ? 1 : -1;
      return (a.displayOrder || 0) - (b.displayOrder || 0);
    });
  
  // Core Team - Associate Leads
  const associateLeads = teamSection.filter(member => member.hierarchyLevel === 'associate-lead')
    .sort((a, b) => {
      const domainA = (a.domain || '') as string;
      const domainB = (b.domain || '') as string;
      if (domainA !== domainB) return domainA > domainB ? 1 : -1;
      return (a.displayOrder || 0) - (b.displayOrder || 0);
    });
  
  // Core Team - Associates
  const associates = teamSection.filter(member => member.hierarchyLevel === 'associate')
    .sort((a, b) => {
      const domainA = (a.domain || '') as string;
      const domainB = (b.domain || '') as string;
      if (domainA !== domainB) return domainA > domainB ? 1 : -1;
      return (a.displayOrder || 0) - (b.displayOrder || 0);
    });
  
  // Core Team - Regular Members
  const regularMembers = teamSection.filter(member => member.hierarchyLevel === 'member')
    .sort((a, b) => {
      const domainA = (a.domain || '') as string;
      const domainB = (b.domain || '') as string;
      if (domainA !== domainB) return domainA > domainB ? 1 : -1;
      return (a.displayOrder || 0) - (b.displayOrder || 0);
    });

  // Helper function to get domain display name
  const getDomainDisplayName = (domain: string | null | undefined): string => {
    switch(domain) {
      case 'web-development': return 'Web Development';
      case 'cloud-computing': return 'Cloud Computing';
      case 'events': return 'Events';
      case 'corporate': return 'Corporate';
      case 'creatives': return 'Creatives';
      default: return domain || '';
    }
  };

  return (
    <div className="pt-24 mt-4 pb-16"> {/* Added mt-4 here */}
      {/* Page Header */}
      <div className="container px-4 md:px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Team</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Meet the dedicated people behind Qwiklabs Developer Club, from our administration to our team members.
          </p>
        </motion.div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-qwik-blue"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="container px-4 md:px-6">
          <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg text-center text-red-700 dark:text-red-400">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Team Content - Only show when not loading and no error */}
      {!loading && !error && (
        <div className="container px-4 md:px-6">
          {/* Administration Section */}
          <section className="mb-16">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-center mb-2">Administration</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-qwik-blue to-qwik-green mx-auto mb-12"></div>
            </motion.div>

            {/* Dean */}
            {dean.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-6">Dean</h3>
                <div className="flex flex-wrap justify-center gap-6">
                  {dean.map((member) => (
                    <AdminMemberCard 
                      key={member._id} 
                      member={member} 
                      onClick={() => openMemberDetail(member)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Chairperson */}
            {chairperson.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-6">Chairperson</h3>
                <div className="flex flex-wrap justify-center gap-6">
                  {chairperson.map((member) => (
                    <AdminMemberCard 
                      key={member._id} 
                      member={member} 
                      onClick={() => openMemberDetail(member)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Associate Chairpersons */}
            {associateChairpersons.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-6">
                  Associate Chairpersons
                </h3>
                <div className="flex flex-wrap justify-center gap-6">
                  {associateChairpersons.map((member) => (
                    <AdminMemberCard 
                      key={member._id} 
                      member={member}
                      onClick={() => openMemberDetail(member)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* HOD */}
            {hod.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-6">
                  Head of Department
                </h3>
                <div className="flex flex-wrap justify-center gap-6">
                  {hod.map((member) => (
                    <AdminMemberCard 
                      key={member._id} 
                      member={member}
                      onClick={() => openMemberDetail(member)}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Team Section */}
          <section>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-center mb-2">Our Team</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-qwik-red to-qwik-yellow mx-auto mb-12"></div>
            </motion.div>

            {/* Faculty Convenors */}
            {facultyConvenors.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-6">
                  Faculty Convenor
                </h3>
                <div className="flex flex-wrap justify-center gap-6">
                  {facultyConvenors.map((member) => (
                    <TeamMemberCard 
                      key={member._id} 
                      member={member}
                      onClick={() => openMemberDetail(member)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Faculty Co-Convenors */}
            {facultyCoConvenors.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-6">
                  Faculty Co-Convenors
                </h3>
                <div className="flex flex-wrap justify-center gap-6">
                  {facultyCoConvenors.map((member) => (
                    <TeamMemberCard 
                      key={member._id} 
                      member={member}
                      onClick={() => openMemberDetail(member)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Founding Team */}
            {foundingMembers.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-6">
                  Founding Team
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {foundingMembers.map((member) => (
                    <TeamMemberCard 
                      key={member._id} 
                      member={member} 
                      compact
                      onClick={() => openMemberDetail(member)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Core Team Section */}
            {(executiveBoard.length > 0 || domainLeads.length > 0 || associateLeads.length > 0 || 
              associates.length > 0 || regularMembers.length > 0) && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-10">
                  Core Team
                </h3>
                
                {/* Executive Board - Modified to ensure 4 members display in one row */}
                {executiveBoard.length > 0 && (
                  <div className="mb-12">
                    <h4 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-6">
                      Executive Board
                    </h4>
                    <div className={`
                      ${executiveBoard.length === 4 
                        ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6' 
                        : 'flex flex-wrap justify-center gap-6'}
                    `}>
                      {executiveBoard.map((member) => (
                        <TeamMemberCard 
                          key={member._id} 
                          member={member} 
                          onClick={() => openMemberDetail(member)}
                          // Make cards slightly smaller when exactly 4 to fit on smaller screens
                          compact={executiveBoard.length === 4}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Domain Leads */}
                {domainLeads.length > 0 && (
                  <div className="mb-12">
                    <h4 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-6">
                      Domain Leads
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                      {domainLeads.map((member) => (
                        <TeamMemberCard 
                          key={member._id} 
                          member={member}
                          domain={getDomainDisplayName(member.domain)}
                          onClick={() => openMemberDetail(member)}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Associate Leads */}
                {associateLeads.length > 0 && (
                  <div className="mb-12">
                    <h4 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-6">
                      Associate Leads
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                      {associateLeads.map((member) => (
                        <TeamMemberCard 
                          key={member._id} 
                          member={member}
                          domain={getDomainDisplayName(member.domain)}
                          onClick={() => openMemberDetail(member)}
                          compact
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Associates */}
                {associates.length > 0 && (
                  <div className="mb-12">
                    <h4 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-6">
                      Associates
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {associates.map((member) => (
                        <TeamMemberCard 
                          key={member._id} 
                          member={member}
                          domain={getDomainDisplayName(member.domain)}
                          onClick={() => openMemberDetail(member)}
                          compact
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Regular Members */}
                {regularMembers.length > 0 && (
                  <div>
                    <h4 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-6">
                      Members
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {regularMembers.map((member) => (
                        <TeamMemberCard 
                          key={member._id} 
                          member={member}
                          domain={getDomainDisplayName(member.domain)}
                          onClick={() => openMemberDetail(member)}
                          compact
                          extraCompact
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Team Member Detail Modal */}
      <AnimatePresence>
        {showModal && selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Close button */}
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 z-10"
              >
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Modal content */}
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Left side - Image */}
                  <div className="md:w-1/3 flex flex-col items-center">
                    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-qwik-blue/20 mb-4">
                      {selectedMember.image ? (
                        <img 
                          src={selectedMember.image} 
                          alt={selectedMember.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-6xl font-light">
                          {selectedMember.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Role badge */}
                    <div className="mb-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium 
                        ${selectedMember.category === 'administration' 
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' 
                          : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                        }`}
                      >
                        {getRoleName(selectedMember.hierarchyLevel)}
                      </span>
                    </div>

                    {/* Social links */}
                    {(selectedMember.socialLinks?.linkedin || 
                      selectedMember.socialLinks?.twitter || 
                      selectedMember.socialLinks?.github || 
                      selectedMember.socialLinks?.website) && (
                      <div className="flex justify-center gap-4 mt-2">
                        {selectedMember.socialLinks?.linkedin && (
                          <a 
                            href={selectedMember.socialLinks.linkedin}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                          >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                          </a>
                        )}
                        {selectedMember.socialLinks?.github && (
                          <a 
                            href={selectedMember.socialLinks.github}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                          </a>
                        )}
                        {selectedMember.socialLinks?.twitter && (
                          <a 
                            href={selectedMember.socialLinks.twitter}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-blue-400 dark:text-gray-400 dark:hover:text-blue-400"
                          >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                          </a>
                        )}
                        {selectedMember.socialLinks?.website && (
                          <a 
                            href={selectedMember.socialLinks.website}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Right side - Content */}
                  <div className="md:w-2/3">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                      {selectedMember.name}
                    </h2>
                    
                    <p className="text-lg text-qwik-blue dark:text-qwik-blue-light font-medium mb-4">
                      {selectedMember.position}
                    </p>
                    
                    {/* Contact info */}
                    {(selectedMember.email || selectedMember.phone) && (
                      <div className="mb-6 space-y-2">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Contact Information
                        </h3>
                        
                        {selectedMember.email && (
                          <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <a href={`mailto:${selectedMember.email}`} className="text-gray-700 dark:text-gray-300 hover:text-qwik-blue dark:hover:text-qwik-blue-light">
                              {selectedMember.email}
                            </a>
                          </div>
                        )}
                        
                        {selectedMember.phone && (
                          <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <a href={`tel:${selectedMember.phone}`} className="text-gray-700 dark:text-gray-300 hover:text-qwik-blue dark:hover:text-qwik-blue-light">
                              {selectedMember.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Biography */}
                    {selectedMember.bio && (
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                          Biography
                        </h3>
                        <div className="prose dark:prose-invert prose-sm md:prose-base max-w-none text-gray-600 dark:text-gray-300">
                          <p>{selectedMember.bio}</p>
                        </div>
                      </div>
                    )}

                    {/* CTA Section */}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                        Connect with {selectedMember.name}:
                      </h3>
                      <div className="flex gap-2">
                        {selectedMember.email && (
                          <a
                            href={`mailto:${selectedMember.email}`}
                            className="px-4 py-2 bg-qwik-blue hover:bg-qwik-blue-dark text-white rounded-md text-sm transition-colors"
                          >
                            Send an Email
                          </a>
                        )}
                        {selectedMember.socialLinks?.linkedin && (
                          <a
                            href={selectedMember.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-[#0A66C2] hover:bg-[#084d94] text-white rounded-md text-sm transition-colors flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                            Connect on LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Backdrop click to close */}
            <div 
              className="absolute inset-0 z-[-1]" 
              onClick={closeModal}
            ></div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper function to get role display name
function getRoleName(hierarchyLevel: string): string {
  switch (hierarchyLevel) {
    case 'dean': return 'Dean';
    case 'chairperson': return 'Chairperson';
    case 'associate-chairperson': return 'Associate Chairperson';
    case 'hod': return 'Head of Department';
    case 'faculty-convenor': return 'Faculty Convenor';
    case 'faculty-co-convenor': return 'Faculty Co-Convenor';
    case 'founding-member': return 'Founding Team';
    case 'president': return 'President';
    case 'vice-president': return 'Vice President';
    case 'secretary': return 'Secretary';
    case 'vice-secretary': return 'Vice Secretary';
    case 'domain-lead': return 'Domain Lead';
    case 'associate-lead': return 'Associate Lead';
    case 'associate': return 'Associate';
    case 'member': return 'Member';
    default: return hierarchyLevel;
  }
}

// Admin Member Card Component
function AdminMemberCard({ member, onClick }: { member: TeamMember; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, cursor: 'pointer' }}
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden max-w-sm w-full"
    >
      <div className="p-1 bg-gradient-to-r from-qwik-blue to-qwik-green">
        <div className="bg-white dark:bg-gray-800 p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 mb-4 overflow-hidden rounded-full border-4 border-qwik-blue/20">
              {member.image ? (
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-4xl font-light">
                  {member.name.charAt(0)}
                </div>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
            <p className="text-qwik-blue dark:text-qwik-blue-light font-semibold">{member.position}</p>
            
            {member.bio && (
              <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
                {member.bio}
              </p>
            )}
            
            {member.email && (
              <a 
                href={`mailto:${member.email}`}
                className="mt-2 text-sm text-qwik-blue dark:text-qwik-blue-light hover:underline"
              >
                {member.email}
              </a>
            )}
            
            {/* Social Links */}
            {(member.socialLinks?.linkedin || member.socialLinks?.twitter || 
              member.socialLinks?.github || member.socialLinks?.website) && (
              <div className="flex justify-center space-x-3 mt-4">
                {member.socialLinks?.linkedin && (
                  <a 
                    href={member.socialLinks.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                )}
                {member.socialLinks?.twitter && (
                  <a 
                    href={member.socialLinks.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-400 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                )}
                {member.socialLinks?.github && (
                  <a 
                    href={member.socialLinks.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                )}
                {member.socialLinks?.website && (
                  <a 
                    href={member.socialLinks.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Team Member Card Component
function TeamMemberCard({ 
  member, 
  domain,
  compact = false,
  extraCompact = false,
  onClick 
}: { 
  member: TeamMember; 
  domain?: string;
  compact?: boolean;
  extraCompact?: boolean;
  onClick: () => void;
}) {
  const isFacultyRole = member.hierarchyLevel === 'faculty-convenor' || member.hierarchyLevel === 'faculty-co-convenor';
  const isExecutiveRole = ['president', 'vice-president', 'secretary', 'vice-secretary'].includes(member.hierarchyLevel);
  const isDomainRole = ['domain-lead', 'associate-lead', 'associate', 'member'].includes(member.hierarchyLevel);
  
  // Determine card color gradient based on role
  let cardColor = 'from-qwik-blue to-qwik-green'; // Default
  
  if (isExecutiveRole) {
    cardColor = 'from-purple-600 to-indigo-600'; // Executive board
  } else if (member.hierarchyLevel === 'domain-lead') {
    cardColor = 'from-amber-500 to-orange-500'; // Domain leads
  } else if (member.hierarchyLevel === 'associate-lead') {
    cardColor = 'from-lime-500 to-green-600'; // Associate leads
  } else if (member.hierarchyLevel === 'associate') {
    cardColor = 'from-cyan-500 to-blue-500'; // Associates
  } else if (member.hierarchyLevel === 'member') {
    cardColor = 'from-gray-400 to-gray-600'; // Regular members
  } else if (isFacultyRole) {
    cardColor = 'from-qwik-green to-qwik-blue'; // Faculty
  } else if (member.hierarchyLevel === 'founding-member') {
    cardColor = 'from-qwik-red to-qwik-yellow'; // Founding members
  }
  
  // Card sizing based on compact modes
  const imageSize = extraCompact ? 'w-16 h-16' : compact ? 'w-20 h-20' : 'w-28 h-28';
  const nameSize = extraCompact ? 'text-base' : compact ? 'text-lg' : 'text-xl';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, cursor: 'pointer' }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${
        extraCompact ? 'max-w-full' : 
        compact ? 'max-w-full' : 'max-w-sm w-full'
      }`}
    >
      <div className={`p-1 bg-gradient-to-r ${cardColor}`}>
        <div className={`bg-white dark:bg-gray-800 ${extraCompact ? 'p-3' : 'p-4'}`}>
          <div className="flex flex-col items-center text-center">
            <div className={`${imageSize} mb-3 overflow-hidden rounded-full border-2 border-qwik-blue/20`}>
              {member.image ? (
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-3xl font-light">
                  {member.name.charAt(0)}
                </div>
              )}
            </div>
            
            <h3 className={`${nameSize} font-bold text-gray-900 dark:text-white ${extraCompact ? 'line-clamp-1' : ''}`}>
              {member.name}
            </h3>
            
            <p className={`text-qwik-blue dark:text-qwik-blue-light ${extraCompact ? 'text-xs' : 'text-sm'} font-medium`}>
              {member.position}
            </p>
            
            {/* Use only passed domain prop for display - not domainDisplay */}
            {isDomainRole && domain && (
              <span className={`mt-1 ${compact ? 'text-xs' : 'text-sm'} bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-0.5 text-gray-800 dark:text-gray-200`}>
                {domain}
              </span>
            )}
            
            {/* Show email for faculty roles */}
            {isFacultyRole && member.email && !extraCompact && (
              <a 
                href={`mailto:${member.email}`}
                className="mt-2 text-sm text-qwik-green dark:text-qwik-green-light hover:underline"
              >
                {member.email}
              </a>
            )}
            
            {!extraCompact && !compact && member.bio && (
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                {member.bio}
              </p>
            )}
            
            {/* Restore social media icons for founding and non-extraCompact cards */}
            {!extraCompact && (member.socialLinks?.linkedin || 
                            member.socialLinks?.github || 
                            member.socialLinks?.twitter || 
                            member.socialLinks?.website) && (
              <div className="flex justify-center space-x-2 mt-3">
                {member.socialLinks?.linkedin && (
                  <a 
                    href={member.socialLinks.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                )}
                {member.socialLinks?.github && (
                  <a 
                    href={member.socialLinks.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                )}
                {member.socialLinks?.twitter && (
                  <a 
                    href={member.socialLinks.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                )}
                {member.socialLinks?.website && (
                  <a 
                    href={member.socialLinks.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </a>
                )}
              </div>
            )}
            
            {/* Minimal click indicator for the most compact cards */}
            {extraCompact && (
              <span className="mt-1 w-5 h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
