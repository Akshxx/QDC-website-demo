"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Admin {
  _id: string;
  username: string;
  name?: string;
  email?: string;
  role: string;
  lastLogin?: string;
}

export default function AdminListCard() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await fetch("/api/admin/list");
        
        if (!res.ok) {
          throw new Error("Failed to fetch admins");
        }
        
        const data = await res.json();
        setAdmins(data.admins);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdmins();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="text-3xl">👥</div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Admin Users</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View all administrator accounts
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {isExpanded ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        
        {loading ? (
          <div className="py-8 flex justify-center">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md">
            {error}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-3 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="w-1/3">Username</span>
              <span className="w-1/3">Name</span>
              <span className="w-1/3">Role</span>
            </div>
            
            {/* Always show at least 3 admins, show all if expanded */}
            <div className="space-y-2">
              {admins.slice(0, isExpanded ? undefined : 3).map((admin) => (
                <motion.div
                  key={admin._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.03)" }}
                  className="flex justify-between items-center py-2 px-1 rounded-md text-sm"
                >
                  <span className="w-1/3 font-medium text-gray-800 dark:text-gray-200">{admin.username}</span>
                  <span className="w-1/3 text-gray-600 dark:text-gray-400">{admin.name || "-"}</span>
                  <span className="w-1/3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      admin.role === "superadmin" 
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300" 
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                    }`}>
                      {admin.role}
                    </span>
                  </span>
                </motion.div>
              ))}
            </div>
            
            {admins.length > 3 && !isExpanded && (
              <div className="mt-3 text-center">
                <button 
                  onClick={() => setIsExpanded(true)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Show all {admins.length} admins
                </button>
              </div>
            )}
            
            {isExpanded && (
              <div className="mt-3 text-center">
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Show less
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
