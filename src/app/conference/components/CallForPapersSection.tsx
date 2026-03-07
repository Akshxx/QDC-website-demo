"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from './AnimationTypes';
import { sectionContainer } from './SectionStyles';
import Link from 'next/link';

const ResearchWorkshopSection: React.FC = () => {
  return (
    <motion.section
      id="research-workshop"
      className={sectionContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
    >
      <motion.div variants={fadeIn} className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-bold relative inline-block">
          Research Paper Writing Workshop
          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"></div>
        </h2>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          Join us to learn the art and science of effective research paper writing
        </p>
      </motion.div>

      <motion.div variants={fadeIn} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-amber-100 dark:border-amber-900/30 mb-8">
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-4">
          <h3 className="text-xl font-bold text-white">Workshop Details</h3>
        </div>
        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Workshop Date */}
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800/30">
              <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Date & Time
              </h4>
              <p className="text-gray-700 dark:text-gray-300">August 19, 2025<br />9:30 AM - 12:30 PM</p>
            </div>

            {/* Registration Deadline */}
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800/30">
              <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Registration Deadline
              </h4>
              <p className="text-gray-700 dark:text-gray-300">August 17, 2025<br />Limited seats available</p>
            </div>

            {/* Workshop Venue */}
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800/30">
              <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Venue
              </h4>
              <p className="text-gray-700 dark:text-gray-300">TP404-405, Tech Park<br />SRM Institute of Science and Technology</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Add notice about free entry */}
      <motion.div variants={fadeIn} className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800/30 mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          <h3 className="text-xl font-semibold text-amber-800 dark:text-amber-300">Free Workshop - Limited Seats</h3>
        </div>
        <p className="text-gray-700 dark:text-gray-300">
          This research paper writing workshop is free to attend. Register soon as seats are limited.
        </p>
      </motion.div>

      <motion.div variants={fadeIn} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-amber-100 dark:border-amber-900/30 mb-8">
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-4">
          <h3 className="text-xl font-bold text-white">Workshop Overview</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              This comprehensive workshop is designed to equip participants with the knowledge and skills needed to write effective research papers. Whether you're a student, early-career researcher, or seasoned professional, you'll gain valuable insights into the paper writing process.
            </p>
            
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800/30">
                <h4 className="text-lg font-semibold text-amber-800 dark:text-amber-300 mb-3">Topics Covered</h4>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Understanding research paper structure</li>
                  <li>Crafting compelling abstracts</li>
                  <li>Literature review best practices</li>
                  <li>Methodology documentation</li>
                  <li>Data presentation techniques</li>
                  <li>Writing effective discussions</li>
                  <li>Citations and reference management</li>
                </ul>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800/30">
                <h4 className="text-lg font-semibold text-amber-800 dark:text-amber-300 mb-3">What You'll Learn</h4>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>How to select research topics with potential</li>
                  <li>Techniques for organizing your research</li>
                  <li>Tips for overcoming writer's block</li>
                  <li>Common mistakes to avoid</li>
                  <li>Getting published in reputed journals</li>
                  <li>Responding to reviewer comments</li>
                  <li>Tools to enhance your research writing</li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-center mt-8">
              <a 
                href="https://forms.gle/Pa1zCcewbGRGUjdVA" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Register Now
                </motion.button>
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeIn} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-amber-100 dark:border-amber-900/30">
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-4">
          <h3 className="text-xl font-bold text-white">Workshop Format</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              This interactive workshop combines expert presentations with hands-on exercises to ensure participants gain practical experience in research paper writing.
            </p>
            
            <div className="grid gap-4 sm:grid-cols-2 mt-4">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800/30">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h4 className="text-lg font-semibold text-amber-800 dark:text-amber-300">Guided Learning</h4>
                </div>
                <p>Expert instructors with publication experience will guide you through each stage of the research paper writing process with practical examples.</p>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800/30">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <h4 className="text-lg font-semibold text-amber-800 dark:text-amber-300">Hands-on Activities</h4>
                </div>
                <p>Participate in writing exercises, peer reviews, and receive immediate feedback to improve your research writing skills.</p>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30 mt-6">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <span className="font-semibold">What to Bring:</span> Participants should bring a laptop and any research ideas or drafts they'd like to work on during the workshop. Templates and supplementary materials will be provided.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default ResearchWorkshopSection;