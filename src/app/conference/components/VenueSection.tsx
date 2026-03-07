"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from './AnimationTypes';
import { sectionContainer } from './SectionStyles';
import Image from 'next/image';
import Link from 'next/link';

const VenueSection: React.FC = () => {
  return (
    <motion.section
      id="venue"
      className={sectionContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
    >
      <motion.div variants={fadeIn} className="text-center mb-10 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-bold relative inline-block">
          Workshop Venue
          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"></div>
        </h2>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          Join us at our state-of-the-art facility for an interactive learning experience
        </p>
      </motion.div>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Left - Venue Info - Now takes 2 columns */}
        <motion.div variants={fadeIn} className="md:col-span-2 space-y-4 md:space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">TP404-405, Tech Park</h3>
          
          <p className="text-gray-700 dark:text-gray-300">
            SRM Institute of Science and Technology<br />
            Kattankulathur, Chennai 603203<br />
            Tamil Nadu, India
          </p>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-amber-100 dark:border-amber-900/30 shadow-md space-y-4">
            <h4 className="font-medium text-lg text-gray-900 dark:text-white">Workshop Facilities</h4>
            
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-amber-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Modern classroom setting with multimedia capabilities
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-amber-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                High-speed WiFi for all participants
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-amber-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Breakout spaces for group activities and discussions
              </li>
              
            </ul>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700/50">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium text-amber-600 dark:text-amber-400">Arrival:</span> Participants are encouraged to arrive 15 minutes early for check-in and setup.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center md:justify-start">
            <a 
              href="https://forms.gle/Pa1zCcewbGRGUjdVA" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium flex items-center gap-2 transition-colors shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Register for the Workshop
              </motion.button>
            </a>
          </div>
        </motion.div>
        
        {/* Right - Map and Image - Now takes 3 columns */}
        <motion.div variants={fadeIn} className="md:col-span-3 space-y-6">
          {/* Map Embed */}
          <div className="aspect-video w-full h-auto rounded-xl overflow-hidden border border-amber-100 dark:border-amber-900/30 shadow-lg">
            <iframe
              title="SRM Tech Park Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.0412429067196!2d80.04186021531542!3d12.823054322324296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52f712b82a78d9%3A0xfdb366d42adb89a6!2sSRM%20Institute%20of%20Science%20and%20Technology!5e0!3m2!1sen!2sin!4v1646464125461!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
            ></iframe>
          </div>
          
          {/* Venue image */}
          
        </motion.div>
      </div>
    </motion.section>
  );
};

export default VenueSection;
