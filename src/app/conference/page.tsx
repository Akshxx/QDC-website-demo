"use client";
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

// Import components
import ConferenceBackground from './components/ConferenceBackground';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
// Registration section removed since the event is free
import TracksSection from './components/TracksSection';
import CommitteeMembersSection from './components/CommitteeMembersSection';
import SpeakersSection from './components/SpeakersSection';
import VenueSection from './components/VenueSection';
import CallForPapersSection from './components/CallForPapersSection';

export default function SeminarPage() {
  // Use animation controls for all major sections
  const aboutControls = useAnimation();
  // Registration controls removed
  const tracksControls = useAnimation();
  const committeeControls = useAnimation();
  const speakersControls = useAnimation();
  
  // Start animations immediately on component mount
  useEffect(() => {
    const startAnimations = async () => {
      // Start animations with slight staggering
      await aboutControls.start('visible');
      // Registration animation removed
      await tracksControls.start('visible');
      await committeeControls.start('visible');
      await speakersControls.start('visible');
    };
    
    startAnimations();
  }, [aboutControls, tracksControls, committeeControls, speakersControls]);
  
  return (
    <div className="relative min-h-screen pt-24 sm:pt-28 pb-16 px-0 sm:px-2 md:px-4 lg:px-6 bg-gradient-to-b from-white to-amber-50/30 dark:from-gray-900 dark:to-gray-900 overflow-hidden">
      {/* Background decorations */}
      <ConferenceBackground />
      
      <div className="container relative z-1 mx-auto max-w-full lg:max-w-[90rem]">
        {/* Main sections - Registration section removed */}
        <HeroSection />
        <AboutSection controls={aboutControls} />
        <TracksSection controls={tracksControls} />
        <CallForPapersSection />
        <CommitteeMembersSection controls={committeeControls} />
        <SpeakersSection controls={speakersControls} />
        <VenueSection />
      </div>
    </div>
  );
}
