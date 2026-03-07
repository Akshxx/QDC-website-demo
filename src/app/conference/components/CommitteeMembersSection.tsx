"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer, AnimatedSectionProps } from './AnimationTypes';
import { sectionContainer } from './SectionStyles';

const CommitteeMembersSection: React.FC<AnimatedSectionProps> = ({ controls }) => {
  return (
    <motion.section 
      id="committee"
      className={sectionContainer}
      initial="hidden"
      animate={controls}
      variants={staggerContainer}
    >
      <motion.div variants={fadeIn} className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-bold relative inline-block">
          Committee Members
          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"></div>
        </h2>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          The organizing committee responsible for planning and coordinating the seminar
        </p>
      </motion.div>
      
      <motion.div 
        variants={fadeIn} 
        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-amber-100 dark:border-amber-900/30 p-6 sm:p-8 md:p-12"
      >
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-semibold text-amber-700 dark:text-amber-300 mb-4">Coming Soon</h3>
          
          <p className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mb-6">
            The seminar committee details will be announced shortly. 
            Our committee will include renowned academics and researchers who will ensure 
            the highest quality of content and organization for this event.
          </p>
          
          <div className="flex justify-center items-center gap-3 mt-4">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse delay-100"></span>
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse delay-200"></span>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default CommitteeMembersSection;
