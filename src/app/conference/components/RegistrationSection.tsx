"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { fadeIn, staggerContainer, AnimatedSectionProps } from './AnimationTypes';
import { sectionContainer } from './SectionStyles';

const RegistrationSection: React.FC<AnimatedSectionProps> = ({ controls }) => {
  return (
    <motion.section 
      id="registration"
      className={sectionContainer}
      initial="hidden"
      animate={controls}
      variants={staggerContainer}
    >
      <motion.div variants={fadeIn} className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-bold relative inline-block">
          Registration Fees
          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"></div>
        </h2>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          Registration details will be announced soon
        </p>
      </motion.div>
      
      <div className="max-w-full mx-auto lg:max-w-5xl">
        <motion.div variants={fadeIn} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-amber-100 dark:border-amber-900/30">
          <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-4">
            <h3 className="text-xl font-bold text-white text-center">Seminar Registration Fees 2025</h3>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3 px-6 text-left text-lg font-semibold text-amber-800 dark:text-amber-300">Category</th>
                    <th className="py-3 px-6 text-right text-lg font-semibold text-amber-800 dark:text-amber-300">Fee (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/30">
                    <td className="py-4 px-6 text-gray-700 dark:text-gray-300">Student (UG / PG / Research Scholar)</td>
                    <td className="py-4 px-6 text-right font-medium text-gray-500 dark:text-gray-400 italic">To Be Decided</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/30">
                    <td className="py-4 px-6 text-gray-700 dark:text-gray-300">Faculty / Academician</td>
                    <td className="py-4 px-6 text-right font-medium text-gray-500 dark:text-gray-400 italic">To Be Decided</td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                    <td className="py-4 px-6 text-gray-700 dark:text-gray-300">Corporate Sector / Others</td>
                    <td className="py-4 px-6 text-right font-medium text-gray-500 dark:text-gray-400 italic">To Be Decided</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800/30">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Registration fee will include access to all seminar sessions, seminar activities, and refreshments. Certificate of participation will be provided to all registered attendees.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <div className="px-6 py-3 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-md font-medium text-center border border-amber-200 dark:border-amber-800/30">
                Registration opens soon
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default RegistrationSection;
