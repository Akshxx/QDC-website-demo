"use client";

import React from 'react';
import HeroSection from './home/components/HeroSection';
import FeaturesSection from './home/components/FeaturesSection';
import DomainSection from './home/components/DomainSection';
import EventsSection from './home/components/EventsSection';
import CallToActionSection from './home/components/CallToActionSection';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <motion.div 
      className="relative z-10 pointer-events-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <HeroSection />
      <FeaturesSection />
      <DomainSection />
      <EventsSection />
      <CallToActionSection />
    </motion.div>
  );
}