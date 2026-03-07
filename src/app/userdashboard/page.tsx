"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface UserData {
  _id: string;
  name: string;
  username: string;
  email: string;
  position: string;
  hierarchyLevel: string;
  domain?: string;
  isApproved: boolean;
}

export default function UserDashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
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
        setUser(userData);
        
        // Also fetch the profile data to check if it's completed
        if (userData.isApproved) {
          const profileRes = await fetch('/api/user/profile');
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            // Consider profile complete if bio exists and is not empty
            setProfileCompleted(!!profileData.bio && profileData.bio.trim().length > 0);
          }
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Could not load your profile information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [router]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/user/logout', {
        method: 'POST'
      });
      router.push('/');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  // Format hierarchy level for display
  const formatHierarchyLevel = (level: string) => {
    return level
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Format domain for display
  const formatDomain = (domain?: string) => {
    if (!domain) return 'Not assigned';
    
    return domain
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
            <Link href="/userlogin" className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Session Expired</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Your login session has expired or you are not logged in.</p>
          <Link href="/userlogin" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Login Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Custom dashboard header - not the main website navbar */}
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
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Team Member Dashboard</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back, {user.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Main Website
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Account Status Banner */}
        <div className={`mb-8 p-4 rounded-lg ${
          user.isApproved 
            ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" 
            : "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
        }`}>
          <p className={`text-sm ${
            user.isApproved 
              ? "text-green-800 dark:text-green-300" 
              : "text-yellow-800 dark:text-yellow-300"
          }`}>
            {user.isApproved 
              ? "Your account has been approved. You now have access to all team member features." 
              : "Your account is currently pending approval by an administrator. Some features may be limited until approval."}
          </p>
        </div>
        
        {/* Dashboard Section Heading */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Your Dashboard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Personal Information Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Personal Information</h3>
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</p>
                  <p className="text-gray-900 dark:text-white">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</p>
                  <p className="text-gray-900 dark:text-white">{user.username}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-gray-900 dark:text-white">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</p>
                  <p className="text-gray-900 dark:text-white">{formatHierarchyLevel(user.hierarchyLevel)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Domain</p>
                  <p className="text-gray-900 dark:text-white">
                    {user.domain ? formatDomain(user.domain) : (
                      <span className="text-gray-500 dark:text-gray-400 italic">Not assigned</span>
                    )}
                  </p>
                </div>
              </div>
              
              <Link href="/userdashboard/profile" className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                View Profile
              </Link>
            </div>
          </motion.div>

          {/* Team Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Team Profile</h3>
                <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Complete your public team member profile that will be displayed on the QDC website.
              </p>
              
              {user.isApproved ? (
                <>
                  {/* Completed steps */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm">
                      <div className="flex-shrink-0 h-5 w-5 text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="ml-2 text-gray-700 dark:text-gray-300">Account approved</p>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className={`flex-shrink-0 h-5 w-5 ${profileCompleted ? 'text-green-500' : 'text-yellow-500'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="ml-2 text-gray-700 dark:text-gray-300">
                        {profileCompleted ? 'Public profile completed' : 'Complete your public profile'}
                      </p>
                    </div>
                  </div>

                  <Link href="/userdashboard/public-profile" className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
                    {profileCompleted ? 'Update Public Profile' : 'Complete Public Profile'}
                  </Link>
                </>
              ) : (
                <>
                  <div className="mb-6 text-yellow-600 dark:text-yellow-400 text-sm">
                    <p>You'll be able to update your public profile after your account is approved.</p>
                  </div>
                  
                  <button 
                    disabled
                    className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400 cursor-not-allowed opacity-75"
                  >
                    Awaiting Approval
                  </button>
                </>
              )}
            </div>
          </motion.div>

          {/* Password Reset Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Password Reset</h3>
                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Change your account password to keep your account secure. Regular password updates are recommended.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm">
                  <div className="flex-shrink-0 h-5 w-5 text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-2 text-gray-700 dark:text-gray-300">Strong password recommended</p>
                </div>
              </div>

              <Link href="/userdashboard/password-reset" className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none">
                Change Password
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
