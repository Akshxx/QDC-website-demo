"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const HeroSection: React.FC = () => {
  return (
    <div className="relative z-10 rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-gray-800/90 shadow-xl border border-amber-100/50 dark:border-amber-800/30 overflow-hidden mb-10 md:mb-20 mx-2 md:mx-0">
      {/* Decorative header stripe */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"></div>
      
      {/* Workshop badge */}
      <div className="absolute top-4 md:top-6 left-3 md:left-6 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-amber-100 dark:bg-amber-900/50 border border-amber-200 dark:border-amber-700 shadow-sm">
        <div className="flex items-center">
          <span className="h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-amber-500 mr-1.5 md:mr-2 animate-pulse"></span>
          <span className="text-xs font-semibold text-amber-800 dark:text-amber-200">QDC Research Nexus 2025</span>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-5 md:gap-8 p-3 sm:p-5 md:p-8 lg:p-10 pt-16 md:pt-16 lg:pt-20">
        {/* Left Column - Workshop Info */}
        <motion.div
          className="z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 text-gray-900 dark:text-white leading-tight bg-gradient-to-r from-amber-700 to-amber-500 dark:from-amber-300 dark:to-amber-500 bg-clip-text text-transparent">
          QDC Research Nexus 2025
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-amber-600 dark:text-amber-300">
            Master the Art of Academic Publishing
          </p>
          
          {/* Info box */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 border border-amber-200 dark:border-amber-700/50 mb-5 md:mb-8 shadow-md">
            <div className="flex flex-col space-y-3 md:space-y-3">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-amber-100 dark:bg-amber-900/80 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Date</p>
                  <p className="font-medium text-sm md:text-base text-gray-900 dark:text-gray-100">19th August, 2025</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-amber-100 dark:bg-amber-900/80 flex-shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Venue</p>
                  <div>
                    <p className="font-medium text-sm md:text-base text-gray-900 dark:text-gray-100">TP404-405, Tech Park</p>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">SRM Institute of Science and Technology</p>
                  </div>
                </div>
              </div>
              
              {/* Free entry indicator */}
              <div className="flex items-center">
                <div className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-amber-100 dark:bg-amber-900/80 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Entry</p>
                  <p className="font-medium text-sm md:text-base text-green-600 dark:text-green-400">Free Workshop</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Register button */}
          <div className="flex justify-center md:justify-start px-0">
            <a 
              href="https://forms.gle/Pa1zCcewbGRGUjdVA"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full sm:w-auto"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto py-3.5 md:py-4 px-6 md:px-8 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 md:gap-3 transition-all duration-300 shadow-lg whitespace-nowrap text-base md:text-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Register Now
              </motion.button>
            </a>
          </div>
        </motion.div>
        
        {/* Right Column - Workshop Image */}
        <motion.div 
          className="relative flex justify-center items-center mt-8 md:mt-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Background decorative elements */}
          <div className="absolute inset-0 -z-1">
            <div className="absolute top-1/4 left-1/4 w-48 md:w-64 h-48 md:h-64 rounded-full bg-amber-100/60 dark:bg-amber-900/30 blur-md"></div>
            <div className="absolute bottom-1/3 right-1/4 w-32 md:w-48 h-32 md:h-48 rounded-full bg-amber-200/50 dark:bg-amber-800/30 blur-md"></div>
          </div>
          
          {/* Workshop illustration - we'll reuse the conference image for now */}
          <motion.div 
            className="relative z-10 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96"
            animate={{ 
              y: [0, -5, 0],
              rotateZ: [0, 1.5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          >
            <Image
              src="/conf.png"
              alt="Research Workshop Logo"
              fill
              className="object-contain drop-shadow-xl"
              priority
              sizes="(max-width: 768px) 16rem, (max-width: 1024px) 20rem, 24rem"
              quality={95}
            />
            
            {/* Floating elements */}
            <motion.div 
              className="absolute inset-0 z-1" 
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1.5 w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-amber-400/80 shadow-lg shadow-amber-300/50"></div>
              <div className="absolute bottom-1/4 right-0 w-2.5 md:w-2.5 h-2.5 md:h-2.5 rounded-full bg-amber-500/80 shadow-lg shadow-amber-400/50"></div>
              <div className="absolute bottom-0 left-1/3 w-2 md:w-2 h-2 md:h-2 rounded-full bg-amber-600/80 shadow-lg shadow-amber-500/50"></div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Bottom decorative bar */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-amber-500/10 dark:from-amber-800/20 dark:via-amber-700/20 dark:to-amber-800/20 border-t border-amber-200/50 dark:border-amber-800/50 h-2"></div>
    </div>
  );
};

export default HeroSection;
