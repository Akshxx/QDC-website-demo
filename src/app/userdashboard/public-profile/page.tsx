"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import ImageUploader from "@/components/ImageUploader";

interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;
}

interface ProfileData {
  bio: string;
  image: string;
  phone: string;
  socialLinks: SocialLinks;
}

export default function PublicProfilePage() {
  const [formData, setFormData] = useState<ProfileData>({
    bio: "",
    image: "",
    phone: "",
    socialLinks: {
      linkedin: "",
      twitter: "",
      github: "",
      website: ""
    }
  });
  
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const router = useRouter();
  
  // Enhanced fetch data function
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch user info
      const userRes = await fetch('/api/user/me');
      if (userRes.status === 401) {
        router.push('/userlogin');
        return;
      }
      
      if (!userRes.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const userData = await userRes.json();
      setUserData(userData);
      
      // Fetch profile data if user is approved
      if (userData.isApproved) {
        // Add cache-busting parameter to avoid browser caching
        const timestamp = new Date().getTime();
        const profileRes = await fetch(`/api/user/profile?t=${timestamp}`);
        
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          
          console.log("Profile data loaded:", {
            bio: profileData.bio,
            imagePreview: profileData.image ? `${profileData.image.substring(0, 30)}...` : "None",
            phone: profileData.phone
          });
          
          // Use both image and imageUrl fields, preferring image if available
          const profileImage = profileData.image || profileData.imageUrl || "";
          
          setFormData({
            bio: profileData.bio || "",
            image: profileImage,
            phone: profileData.phone || "",
            socialLinks: {
              linkedin: profileData.socialLinks?.linkedin || "",
              twitter: profileData.socialLinks?.twitter || "",
              github: profileData.socialLinks?.github || "",
              website: profileData.socialLinks?.website || ""
            }
          });
          
          // Update refresh timestamp
          setLastRefreshed(new Date());
        }
      } else {
        // Not approved - go back to dashboard
        router.push('/userdashboard');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Could not load your profile information. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle manual refresh
  const handleRefresh = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    await fetchData();
  };
  
  // Fetch user data and profile on mount
  useEffect(() => {
    fetchData();
  }, [router]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle socialLinks fields
    if (name.startsWith('socialLinks.')) {
      const socialField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialField]: value
        }
      }));
    } else {
      // Handle regular fields
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle image change from ImageUploader component
  const handleImageChange = async (imageData: string) => {
    setFormData(prev => ({
      ...prev,
      image: imageData
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSubmitting(true);
    setError("");
    setSuccess("");
    
    try {
      // First update profile data
      const profileRes = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!profileRes.ok) {
        const data = await profileRes.json();
        throw new Error(data.message || "Failed to update profile");
      }
      
      // Update image specifically to ensure sync
      if (formData.image) {
        const imageRes = await fetch('/api/user/profile/image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ imageData: formData.image })
        });
        
        if (!imageRes.ok) {
          const data = await imageRes.json();
          console.warn("Image sync warning:", data.message);
          // Continue execution even if image sync has issues
        }
      }
      
      setSuccess("Your public profile has been updated successfully!");
      
      // Redirect after success
      setTimeout(() => {
        router.push('/userdashboard');
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Add force sync function
  const handleForceSync = async () => {
    try {
      setSyncing(true);
      const res = await fetch('/api/user/profile/sync', {
        method: 'POST',
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to sync profile");
      }
      
      // After syncing, refresh the data
      await fetchData();
      
      setSuccess("Profile synchronized successfully!");
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (err: any) {
      setError(err.message || "An error occurred during sync. Please try again.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">Loading profile editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with refresh and sync buttons */}
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
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Public Team Profile</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Update your details for the website
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Add refresh button */}
            <button
              type="button"
              onClick={handleRefresh}
              className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Refresh
            </button>
            
            {/* Add sync button */}
            <button
              type="button"
              onClick={handleForceSync}
              className="flex items-center text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
              disabled={syncing || loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              {syncing ? "Syncing..." : "Force Sync"}
            </button>
            
            <Link href="/userdashboard" className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Last refreshed timestamp */}
        <div className="text-right mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Last refreshed: {lastRefreshed.toLocaleTimeString()}
          </span>
        </div>
        
        {/* Card with form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Your Public Profile Information</h2>
            
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
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image */}
              <ImageUploader 
                currentImage={formData.image} 
                onImageChange={handleImageChange}
              />

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  placeholder="+91 1234567890"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Optional - This will be publicly visible on the website
                </p>
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio / About Me
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  placeholder="Write a short bio about yourself"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  This will be displayed on your team profile
                </p>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Social Media Links</h3>
                
                <div className="space-y-3">
                  {/* LinkedIn */}
                  <div>
                    <label htmlFor="socialLinks.linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      LinkedIn
                    </label>
                    <input
                      id="socialLinks.linkedin"
                      name="socialLinks.linkedin"
                      type="text"
                      placeholder="https://linkedin.com/in/yourusername"
                      value={formData.socialLinks.linkedin}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  {/* Twitter */}
                  <div>
                    <label htmlFor="socialLinks.twitter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Twitter
                    </label>
                    <input
                      id="socialLinks.twitter"
                      name="socialLinks.twitter"
                      type="text"
                      placeholder="https://twitter.com/yourusername"
                      value={formData.socialLinks.twitter}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  {/* GitHub */}
                  <div>
                    <label htmlFor="socialLinks.github" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      GitHub
                    </label>
                    <input
                      id="socialLinks.github"
                      name="socialLinks.github"
                      type="text"
                      placeholder="https://github.com/yourusername"
                      value={formData.socialLinks.github}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  {/* Personal Website */}
                  <div>
                    <label htmlFor="socialLinks.website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Personal Website
                    </label>
                    <input
                      id="socialLinks.website"
                      name="socialLinks.website"
                      type="text"
                      placeholder="https://yourwebsite.com"
                      value={formData.socialLinks.website}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <div className="flex justify-end pt-4">
                <Link 
                  href="/userdashboard"
                  className="mr-4 py-2 px-4 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition-colors"
                >
                  Cancel
                </Link>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : "Update Profile"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
