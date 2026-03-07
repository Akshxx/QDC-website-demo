"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer, AnimatedSectionProps } from './AnimationTypes';

const SpeakersSection: React.FC<AnimatedSectionProps> = ({ controls }) => {
  return (
    <motion.section 
      id="speakers"
      className="mb-20"
      initial="hidden"
      animate={controls}
      variants={staggerContainer}
    >
      <motion.div variants={fadeIn} className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold relative inline-block">
          Seminar Speakers
          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"></div>
        </h2>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          Distinguished experts who will be speaking at our seminar
        </p>
      </motion.div>
      
      <motion.div 
        variants={fadeIn} 
        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-amber-100 dark:border-amber-900/30 p-12"
      >
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 01.707-7.07m-2.828 9.9a9 9 0 010-12.728" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18v-6m0 0V6" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-semibold text-amber-700 dark:text-amber-300 mb-4">Coming Soon</h3>
          
          <p className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mb-6">
            Leading experts and researchers in the fields of Machine Learning, 
            Artificial Intelligence, and Computer Vision. Our lineup of speakers will be announced as we get closer to the event.
            Stay tuned for updates on our distinguished speakers who will be sharing their knowledge and insights.
          </p>
          
          <div className="flex justify-center space-x-16 mt-8">
            {/* Placeholder silhouettes for speakers */}
            <div className="flex flex-col items-center opacity-30">
              <div className="w-20 h-20 bg-gradient-to-b from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700 rounded-full"></div>
              <div className="w-16 h-2 bg-gray-300 dark:bg-gray-600 mt-3 rounded"></div>
              <div className="w-12 h-2 bg-gray-200 dark:bg-gray-700 mt-2 rounded"></div>
            </div>
            <div className="flex flex-col items-center opacity-30">
              <div className="w-20 h-20 bg-gradient-to-b from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700 rounded-full"></div>
              <div className="w-16 h-2 bg-gray-300 dark:bg-gray-600 mt-3 rounded"></div>
              <div className="w-12 h-2 bg-gray-200 dark:bg-gray-700 mt-2 rounded"></div>
            </div>
            <div className="hidden md:flex flex-col items-center opacity-30">
              <div className="w-20 h-20 bg-gradient-to-b from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700 rounded-full"></div>
              <div className="w-16 h-2 bg-gray-300 dark:bg-gray-600 mt-3 rounded"></div>
              <div className="w-12 h-2 bg-gray-200 dark:bg-gray-700 mt-2 rounded"></div>
            </div>
          </div>
          
          <div className="flex justify-center items-center gap-3 mt-8">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse delay-100"></span>
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse delay-200"></span>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default SpeakersSection;
