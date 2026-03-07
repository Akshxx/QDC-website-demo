"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

// Redesigned workshop announcement with updated text and direct registration link
const WorkshopAnnouncement: React.FC = () => {
  return (
    <motion.div 
      className="w-full bg-gradient-to-r from-amber-50 via-white to-amber-50 dark:from-gray-900/80 dark:via-amber-900/20 dark:to-gray-900/80 border border-amber-200 dark:border-amber-800/30 rounded-2xl mb-5 -mt-10 md:-mt-10 overflow-hidden shadow-lg"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div className="relative px-4 py-1 sm:py-1.5 sm:px-5">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200/20 dark:bg-amber-700/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
        <div className="absolute bottom-0 left-10 w-16 h-16 bg-amber-300/20 dark:bg-amber-700/10 rounded-full translate-y-1/2 blur-xl"></div>
        
        {/* Flex layout with improved mobile responsiveness */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Left - Workshop logo with reduced mobile spacing */}
          <div className="relative w-40 h-40 sm:w-44 sm:h-44 flex-shrink-0 order-1 md:order-1 -my-6 md:-my-8 mb-0">
            <Image
              src="/conf.png"
              alt="Research Workshop Logo"
              fill
              className="object-contain"
              sizes="(max-width: 640px) 10rem, 11rem"
              priority
            />
          </div>
          
          {/* Middle - Workshop info with stacked layout on mobile */}
          <div className="text-center flex-grow order-2 md:order-2 -mt-14 md:-my-1 mb-0">
            {/* Workshop title - smaller text */}
            <h3 className="text-amber-800 dark:text-amber-200 font-bold text-2xl md:text-3xl">
              QDC Research Nexus 2025
            </h3>
            
            {/* Date and venue - in separate lines for mobile with tighter spacing */}
            <div className="flex flex-col items-center gap-y-1.5 mt-1.5">
              {/* Date line */}
              <div className="flex items-center text-xs text-amber-700 dark:text-amber-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">19th August, 2025</span>
              </div>
              
              {/* Location line 1 - Hall and Auditorium */}
              <div className="flex items-center text-xs text-amber-700 dark:text-amber-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>TP 404-405, Tech Park</span>
              </div>
              
              {/* Location line 2 - University name with reduced bottom spacing */}
              <div className="text-xs text-amber-700 dark:text-amber-300 ml-4 mb-0 md:mb-0">
                SRM Institute of Science and Technology
              </div>
            </div>
          </div>
          
          {/* Right - Learn More button updated to link directly to Google form */}
          <div className="flex-shrink-0 order-3 md:order-3 w-full md:w-auto flex justify-center md:justify-start mt-0 md:mt-0 mb-2 md:mb-0">
            <a 
              href="/seminar" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <motion.div 
                className="px-10 py-2 md:px-10 md:py-3 text-xs font-medium bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-full shadow-sm flex items-center gap-1.5 cursor-pointer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="relative flex h-2 w-2 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span className="font-semibold">Register Now</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.div>
            </a>
          </div>
        </div>
        
        {/* Decorative line with gradient - keep thin */}
        <div className="absolute bottom-0 left-0 w-full h-0.5">
          <div className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>
        </div>
      </div>
    </motion.div>
  );
};

const HeroSection = () => {
  // Animation variants for staggered text reveal
  const titleContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.04
      }
    }
  };
  
  const titleLetter = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.8 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        type: "spring",
        damping: 12,
        stiffness: 200
      } 
    }
  };

  const firstLine = "Qwiklabs Developer";
  const secondLine = "Club SRMIST";
  
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 overflow-hidden">
      <div className="container px-4 md:px-6">
        {/* The workshop announcement */}
        {/* <WorkshopAnnouncement /> */}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Animated title - two lines */}
            <div className="mb-4">
              <motion.h1 
                className="text-4xl md:text-6xl font-bold tracking-tight overflow-hidden"
                variants={titleContainer}
                initial="hidden"
                animate="visible"
              >
                {/* First line animation */}
                {firstLine.split("").map((letter, index) => (
                  <motion.span 
                    key={`first-${index}`} 
                    variants={titleLetter}
                    className={letter === " " ? "inline-block mr-2" : "inline-block"}
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.h1>
              
              <motion.h1 
                className="text-4xl md:text-6xl font-bold tracking-tight overflow-hidden mt-1"
                variants={titleContainer}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.5 }}
              >
                {/* Second line animation with a slight delay */}
                {secondLine.split("").map((letter, index) => (
                  <motion.span 
                    key={`second-${index}`} 
                    variants={titleLetter}
                    className={letter === " " ? "inline-block mr-2" : "inline-block"}
                  >
                    {letter}
                  </motion.span>
                ))}
                <span className="inline-block ml-2">
                  <motion.span
                    className="ml-1 inline-block h-2 w-2 rounded-full bg-qwik-blue"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 0.5 }}
                  />
                  <motion.span
                    className="ml-1 inline-block h-2 w-2 rounded-full bg-qwik-red"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.2, repeatDelay: 0.5 }}
                  />
                  <motion.span
                    className="ml-1 inline-block h-2 w-2 rounded-full bg-qwik-yellow"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.4, repeatDelay: 0.5 }}
                  />
                  <motion.span
                    className="ml-1 inline-block h-2 w-2 rounded-full bg-qwik-green"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.6, repeatDelay: 0.5 }}
                  />
                </span>
              </motion.h1>
            </div>
            
            <motion.p 
              className="text-xl mb-8 text-gray-600 dark:text-gray-300 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              is a vibrant student community passionate about cloud and emerging tech.
              Through hands-on learning, workshops, hackathons, and global certifications, we empower students to connect, learn, and grow into future-ready developers.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
            >
              <Link href="/events">
                <motion.button 
                  className="px-6 py-3 bg-qwik-blue hover:bg-qwik-blue-dark text-white rounded-md shadow-lg transition duration-300 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Events
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </motion.button>
              </Link>
              <Link href="https://www.instagram.com/qdc_srmist/" target="_blank" rel="noopener noreferrer">
                <motion.button 
                  className="px-6 py-3 border border-qwik-blue text-qwik-blue hover:bg-qwik-blue/10 rounded-md shadow-sm transition duration-300 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Follow Us
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative h-[340px] md:h-[440px] w-full"
          >
            {/* Gradient background with decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-qwik-blue/10 to-qwik-green/10 rounded-3xl z-0">
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-qwik-yellow/30 rounded-full blur-3xl" />
              <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-qwik-red/30 rounded-full blur-3xl" />
            </div>
            
            {/* Simplified image wrapper with rounded borders */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700 z-10">
              <Image 
                src="/images/home.png" 
                alt="QDC Hero"
                fill
                priority
                style={{
                  objectFit: "cover",
                  objectPosition: "center"
                }}
                className="rounded-3xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;