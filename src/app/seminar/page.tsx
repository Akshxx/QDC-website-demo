"use client";
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

// Import only the components we need
import ConferenceBackground from '../conference/components/ConferenceBackground';
import HeroSection from '../conference/components/HeroSection';
import AboutSection from '../conference/components/AboutSection';
import VenueSection from '../conference/components/VenueSection';
// Import the renamed workshop section
import ResearchWorkshopSection from '../conference/components/CallForPapersSection';

export default function SeminarPage() {
  // Use animation controls only for the about section now
  const aboutControls = useAnimation();
  
  // Start animation immediately on component mount
  useEffect(() => {
    const startAnimations = async () => {
      // Start about section animation
      await aboutControls.start('visible');
    };
    
    startAnimations();
  }, [aboutControls]);
  
  return (
    <div className="relative min-h-screen pt-24 sm:pt-28 pb-16 px-0 sm:px-2 md:px-4 lg:px-6 bg-gradient-to-b from-white to-amber-50/30 dark:from-gray-900 dark:to-gray-900 overflow-hidden">
      {/* Background decorations */}
      <ConferenceBackground />
      
      <div className="container relative z-1 mx-auto max-w-full lg:max-w-[90rem]">
        {/* Simplified sections - removed TracksSection, CommitteeMembersSection, and SpeakersSection */}
        <HeroSection />
        <AboutSection controls={aboutControls} />
        <ResearchWorkshopSection />
        <VenueSection />
      </div>
    </div>
  );
}
