"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface UserProfile {
  _id: string;
  name: string;
  username: string;
  email: string;
  position: string;
  hierarchyLevel: string;
  domain?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  
  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/user/me');
        
        if (res.status === 401) {
          // Unauthorized - redirect to login
          router.push('/userlogin');
          return;
        }
        
        if (!res.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await res.json();
        setProfile(userData);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Could not load your profile information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [router]);

  // We'll implement update functionality in a separate step
  // For now, we'll just redirect back to dashboard
  const handleUpdate = () => {
    router.push('/userdashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Simple header with back button */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image 
              src="/images/qdc.png" 
              alt="QDC Logo" 
              width={100} 
              height={40} 
              className="h-8 w-auto"
            />
            <div className="ml-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Edit your basic information
              </p>
            </div>
          </div>
          
          <Link href="/userdashboard" className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Card with form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Personal Information</h2>
            
            {/* Success/Error messages */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-md">
                {success}
              </div>
            )}
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-md">
                {error}
              </div>
            )}
            
            {/* Read-only form for now - note that these are not editable yet */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white">
                  {profile?.name}
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  To change your name, please contact an administrator
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white">
                  {profile?.username}
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Usernames cannot be changed
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white">
                  {profile?.email}
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  To change your email, please contact an administrator
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Position</label>
                <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white">
                  {profile?.position}
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  This is your official position in the club
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white">
                  {profile?.hierarchyLevel.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </div>
              </div>
              
              {profile?.domain && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Domain</label>
                  <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white">
                    {profile.domain.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </div>
                </div>
              )}
              
              <div className="pt-4 flex justify-end">
                <Link 
                  href="/userdashboard"
                  className="py-2 px-4 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition-colors"
                >
                  Back to Dashboard
                </Link>
                
                {/* Removed the Change Password button */}
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
