"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SubmitPage() {
  // Initialize countdown with zeros
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // Updated to August 12
  useEffect(() => {
    // Set deadline to August 12, 2025 (updated from August 10)
    const targetDate = new Date('2025-08-12T00:00:00');
    
    const updateCountdown = () => {
      const now = new Date();
      
      // Calculate the time difference in milliseconds
      const difference = targetDate.getTime() - now.getTime();
      
      // Check if the date is in the future
      if (difference > 0) {
        // Calculate days, hours, minutes, and seconds
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        // Update the countdown state
        setCountdown({ days, hours, minutes, seconds });
      } else {
        // If the date is in the past, set the countdown to zeros
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    
    // Update the countdown immediately
    updateCountdown();
    
    // Set up interval to update the countdown every second
    const interval = setInterval(updateCountdown, 1000);
    
    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen pt-28 pb-16 px-4 md:px-8 bg-gradient-to-b from-white to-amber-50/30 dark:from-gray-900 dark:to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-200/10 dark:bg-amber-700/10 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-amber-300/10 dark:bg-amber-600/10 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-amber-100/50 dark:border-amber-900/30 overflow-hidden"
        >
          {/* Decorative header stripe */}
          <div className="h-1.5 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"></div>
          
          <div className="p-8 md:p-12 text-center">
            <div className="inline-block mb-6">
              <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Paper Submission Coming Soon
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10">
              Our paper submission system is being prepared and will be available shortly.
              <br />Check back soon for updates.
            </p>
            
            {/* Updated to August 12 */}
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
              Target Date: August 12, 2025
            </p>
            
            {/* Countdown timer */}
            <div className="mb-12">
              <h3 className="text-lg font-medium text-amber-700 dark:text-amber-300 mb-4">Submissions Open In</h3>
              <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{countdown.days}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Days</div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{countdown.hours}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Hours</div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{countdown.minutes}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Mins</div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{countdown.seconds}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Secs</div>
                </div>
              </div>
            </div>
            
            {/* Return button */}
            <Link href="/conference" className="inline-block mt-8">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200 transition-colors border border-gray-200 dark:border-gray-700 font-medium"
              >
                Return to Seminar
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
