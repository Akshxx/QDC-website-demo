import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Image 
                src="/images/qdc.png" 
                alt="QDC Logo" 
                width={150} 
                height={50}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              Qwiklabs Developer Club is a student community at SRM Institute of Science and Technology dedicated to fostering technical skills, innovation, and professional growth.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://in.linkedin.com/company/qwiklabs-developer-club-srmist" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/qdc_srmist/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-500 dark:text-gray-400 dark:hover:text-pink-400"
              >
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://www.facebook.com/qdc.srmist/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
              >
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-base text-gray-600 dark:text-gray-400 hover:text-qwik-blue dark:hover:text-qwik-blue-light">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-base text-gray-600 dark:text-gray-400 hover:text-qwik-blue dark:hover:text-qwik-blue-light">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-base text-gray-600 dark:text-gray-400 hover:text-qwik-blue dark:hover:text-qwik-blue-light">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-base text-gray-600 dark:text-gray-400 hover:text-qwik-blue dark:hover:text-qwik-blue-light">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/userlogin" className="text-base text-gray-600 dark:text-gray-400 hover:text-qwik-blue dark:hover:text-qwik-blue-light">
                  Member Login
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Information - Updated with correct details */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <address className="not-italic">
              <p className="text-base text-gray-600 dark:text-gray-400 mb-3">
                Qwiklabs Developer Club
              </p>
              <p className="text-base text-gray-600 dark:text-gray-400 mb-3">
                SRM Institute of Science and Technology
                <br />
                SRM Nagar, Kattankulathur - 603 203
                <br />
                Chengalpattu District, Tamil Nadu
              </p>
              <div className="text-base text-gray-600 dark:text-gray-400 space-y-1">
                <p>
                  <a href="mailto:admin@qdcsrmist.in" className="hover:text-qwik-blue dark:hover:text-qwik-blue-light">
                    admin@qdcsrmist.in
                  </a>
                </p>
                <p>
                  <a href="mailto:qdc.srmist@gmail.com" className="hover:text-qwik-blue dark:hover:text-qwik-blue-light">
                    qdc.srmist@gmail.com
                  </a>
                </p>
              </div>
            </address>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8 text-center">
          <p className="text-base text-gray-500 dark:text-gray-400">
            &copy; {currentYear} Qwiklabs Developer Club. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
