"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from './AnimationTypes';
import { sectionContainer } from './SectionStyles';
import Image from 'next/image';

type AboutSectionProps = {
  controls: any;
};

const AboutSection: React.FC<AboutSectionProps> = ({ controls }) => {
  return (
    <motion.section
      id="about"
      className={sectionContainer}
      variants={staggerContainer}
      initial="hidden"
      animate={controls}
    >
      <motion.div variants={fadeIn} className="text-center mb-10 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-bold relative inline-block">
          About the Workshop
          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"></div>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Left column - Updated image sizing for better mobile display */}
        <motion.div 
          variants={fadeIn} 
          className="relative h-72 md:h-96 w-full rounded-2xl overflow-hidden border border-amber-100/50 dark:border-amber-800/30 shadow-xl"
        >
          <Image
            src="/images/rpw.png"
            alt="Research Paper Writing Workshop"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>

        {/* Right column - Updated content about research paper writing */}
        <motion.div variants={fadeIn} className="space-y-4 md:space-y-6">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            QDC Research Nexus 2025
          </h3>
          
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            The QDC Research Nexus brings you a comprehensive workshop focused on the art and science of effective research paper writing. This educational session is designed to help students, researchers, and faculty members develop the skills needed to craft compelling research papers.
          </p>
          
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Led by experienced academics and published researchers, this workshop will cover everything from selecting a research topic to navigating the publication process. Attendees will learn practical techniques for structuring papers, creating impactful abstracts, conducting literature reviews, and presenting findings in a clear and compelling manner.
          </p>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800/30">
            <h4 className="font-semibold text-lg text-amber-800 dark:text-amber-300 mb-2">Key Benefits</h4>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Understand how to structure research papers effectively
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Learn techniques for crafting compelling abstracts and introductions
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Gain insights into the academic publishing process
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Receive hands-on guidance with practical writing exercises
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AboutSection;
