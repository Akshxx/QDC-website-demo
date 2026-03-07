"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const CallToActionSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-qwik-blue/90 to-qwik-green/90 text-white">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to join our community?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg mb-8 opacity-90"
          >
            Become part of our vibrant community and start your cloud journey today. Connect with like-minded individuals and expand your technical horizons.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link href="https://www.instagram.com/qdc_srmist/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-qwik-blue rounded-md shadow-lg hover:bg-gray-100 transition duration-300"
              >
                Follow Now
              </motion.button>
            </Link>
            <Link href="/team">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border border-white text-white hover:bg-white/10 rounded-md transition duration-300"
              >
                Meet Our Team
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
