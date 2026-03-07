"use client";
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import DomainSection from './components/DomainSection';
import EventsSection from './components/EventsSection';
import CallToActionSection from './components/CallToActionSection';

const Home = () => {
  // Animate content sections with a staggered effect
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  return (
    <motion.div 
      className="relative z-10 pointer-events-auto"
      initial="hidden"
      animate="visible"
      variants={contentVariants}
    >
      <motion.div variants={sectionVariants}>
        <HeroSection />
      </motion.div>
      
      <motion.div variants={sectionVariants}>
        <FeaturesSection />
      </motion.div>
      
      <motion.div variants={sectionVariants}>
        <DomainSection />
      </motion.div>
      
      <motion.div variants={sectionVariants}>
        <EventsSection />
      </motion.div>
      
      <motion.div variants={sectionVariants}>
        <CallToActionSection />
      </motion.div>
    </motion.div>
  );
}

export default Home;