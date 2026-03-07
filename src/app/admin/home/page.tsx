"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FeatureCardProps, QuickStatCardProps } from "@/types/admin";

// Define stats interface
interface AdminStats {
  totalAdmins: number;
  superAdmins: number;
  regularAdmins: number;
  newAdminsThisMonth: number;
  totalMembers?: number;
  teamMembers?: number;
  events?: {
    total: number;
    thisMonth: number;
    upcoming: number;
    past: number;
    change: number;
  };
}

export default function AdminHome() {
  const { data: session, status } = useSession();
  const [greeting, setGreeting] = useState("Welcome");
  const [stats, setStats] = useState<AdminStats>({
    totalAdmins: 0,
    superAdmins: 0,
    regularAdmins: 0,
    newAdminsThisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  
  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);
  
  // Fetch admin statistics
  useEffect(() => {
    const fetchStats = async () => {
      if (status !== "authenticated") return;
      
      try {
        // Fetch admin stats
        const adminRes = await fetch("/api/admin/stats");
        if (adminRes.ok) {
          const adminData = await adminRes.json();
          
          // Fetch team stats
          const teamRes = await fetch("/api/team?stats=true");
          let teamData = {};
          if (teamRes.ok) {
            teamData = await teamRes.json();
          }
          
          // Combine stats
          setStats({
            ...adminData,
            ...teamData
          });
        }
      } catch (error) {
        console.error("Failed to fetch statistics", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [status]);
  
  // Auth redirect
  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/admin";
    }
  }, [status]);

  // Sign out handler
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    window.location.href = "/admin";
  };

  // Loading animation for status=loading
  if (status === "loading") {
    // ... existing loading UI ...
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="w-12 h-12 border-4 border-qwik-blue border-t-transparent rounded-full animate-spin absolute top-2 left-2"></div>
          <div className="w-8 h-8 border-4 border-qwik-green border-t-transparent rounded-full animate-spin absolute top-4 left-4"></div>
        </div>
      </div>
    );
  }

  // Admin dashboard
  if (status === "authenticated" && session) {
    const displayName = session.user?.name || session.user?.username || "Admin";
    const userRole = session.user?.role as string | undefined;
    const isSuperAdmin = userRole === "superadmin";
    const isAdmin = userRole && ['admin', 'superadmin'].includes(userRole);
    
    // Role-based alert message
    const roleMessage = isSuperAdmin 
      ? "You have super administrator access with full permissions" 
      : "You have standard administrator access";
      
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden relative">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
          {/* ... existing decorative elements ... */}
          <div className="absolute -top-[30%] -right-[10%] w-[40%] h-[60%] rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/5 blur-3xl"></div>
          <div className="absolute -bottom-[30%] -left-[10%] w-[40%] h-[60%] rounded-full bg-gradient-to-tr from-green-500/10 to-blue-500/5 blur-3xl"></div>
        </div>
        
        {/* Admin Header - Sticky top navigation */}
        <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md"
        >
          {/* ... existing header content ... */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <motion.div 
                className="flex items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Image
                  src="/images/qdc.png"
                  alt="QDC Logo"
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                />
                <div className="ml-4">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-qwik-blue bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isSuperAdmin ? 'Super Administrator' : 'Administrator'}
                  </p>
                </div>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
                  <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {displayName}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignOut}
                  className="py-2 px-4 bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm rounded-md shadow-sm hover:shadow-md transition-all"
                >
                  Sign Out
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Page Title */}
          <motion.div 
            className="mb-8 text-center sm:text-left"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.h2 
              className="text-3xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
              whileHover={{ scale: 1.01 }}
            >
              {greeting}, {displayName.split(' ')[0]}!
            </motion.h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
              Welcome to your admin dashboard. {roleMessage}.
            </p>
          </motion.div>

          {/* User role-based alert */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`mb-8 p-4 rounded-lg ${
              isSuperAdmin 
                ? "bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800" 
                : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
            }`}
          >
            <p className={`text-sm ${
              isSuperAdmin 
                ? "text-purple-800 dark:text-purple-300" 
                : "text-blue-800 dark:text-blue-300"
            }`}>
              {isSuperAdmin 
                ? "As a Super Administrator, you can create both admin and super admin accounts, plus manage all aspects of the system." 
                : "As an Administrator, you can create regular admin accounts and manage website content. Only Super Administrators can create super admin accounts."}
            </p>
          </motion.div>

          {/* Quick stats - Updated to have 3 columns instead of 4 */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <QuickStatCard
              title="Admins"
              value={loading ? "..." : stats.totalAdmins?.toString()}
              icon="👥"
              color="bg-blue-500"
              change={loading ? "Loading..." : `+${stats.newAdminsThisMonth} this month`}
              positive={stats.newAdminsThisMonth > 0}
            />
            <QuickStatCard
              title="Team Members"
              value={loading ? "..." : (stats.totalMembers?.toString() || "0")}
              icon="🌟"
              color="bg-amber-500"
              change="Team & Faculty"
              positive={null}
            />
            <QuickStatCard
              title="Events"
              value={loading ? "..." : stats.events?.total?.toString() || "0"}
              icon="📅"
              color="bg-green-500"
              change={loading ? "Loading..." : 
                stats.events?.thisMonth && stats.events.thisMonth > 0
                  ? `+${stats.events.thisMonth} this month` 
                  : "No new events this month"
              }
              positive={!!stats.events?.thisMonth && stats.events.thisMonth > 0}
            />
            {/* Visitors card removed */}
          </motion.div>

          {/* Admin Management Section - Now visible to all admins */}
          {isAdmin && (
            <>
              {/* Section title */}
              <motion.div
                className="flex items-center gap-2 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Admin Management
                </h3>
                <div className="h-px bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700 flex-grow"></div>
              </motion.div>
            
              {/* Admin Management Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <FeatureCard 
                  title="Add Admin"
                  description={isSuperAdmin ? "Create new admin or super admin accounts" : "Create new admin accounts"}
                  icon="👤"
                  color="from-blue-500 to-blue-600"
                  href="/admin/add-admin"
                  delay={0.7}
                />
                
                <FeatureCard 
                  title="Manage Admins"
                  description="View and manage administrator accounts"
                  icon="👥"
                  color="from-indigo-500 to-violet-500"
                  href="/admin/admins"
                  delay={0.8}
                />
              </div>
            </>
          )}

          {/* Website Management Section */}
          <motion.div
            className="flex items-center gap-2 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: isSuperAdmin ? 0.9 : 0.6 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Website Management
            </h3>
            <div className="h-px bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700 flex-grow"></div>
          </motion.div>

          {/* Feature Cards Grid - REORDERED */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">    
            {/* Team Management Card */}
            <FeatureCard 
              title="Team Management"
              description="Manage administration and team members displayed on the website"
              icon="👥"
              color="from-amber-500 to-yellow-500"
              href="/admin/team"
              delay={isSuperAdmin ? 1.0 : 0.7}
            />
            
            {/* User Management Card */}
            <FeatureCard 
              title="Team Registrations"
              description="Approve or reject team member registration requests"
              icon="🔑"
              color="from-emerald-500 to-teal-500"
              href="/admin/usermanagement"
              delay={isSuperAdmin ? 1.1 : 0.8}
            />
            
            {/* Events Card */}
            <FeatureCard 
              title="Manage Events"
              description="Add, edit, or delete events on the website"
              icon="📅"
              color="from-green-500 to-emerald-500"
              href="/admin/events"
              disabled={false}
              delay={isSuperAdmin ? 1.1 : 0.8}
            />
            
            {/* Contact Inquiries */}
            <FeatureCard 
              title="Contact Inquiries"
              description="View and manage contact form submissions"
              icon="📨"
              color="from-rose-500 to-red-500"
              href="/admin/contact"
              disabled={false}
              delay={isSuperAdmin ? 1.2 : 0.9}
            />
            
            {/* Remove Team Members card since it's redundant (we have Team Management) */}
            
            {/* Site Settings - Keep this disabled card */}
            <FeatureCard 
              title="Site Settings"
              description="Configure website settings and appearance"
              icon="⚙️"
              color="from-purple-500 to-indigo-500"
              disabled={true}
              delay={isSuperAdmin ? 1.4 : 1.1}
            />
            
            {/* Analytics - Keep this disabled card */}
            <FeatureCard 
              title="Analytics"
              description="View website traffic and user statistics"
              icon="📊"
              color="from-blue-500 to-sky-500"
              disabled={true}
              delay={isSuperAdmin ? 1.5 : 1.2}
            />
          </div>
        </main>
        
        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700"
        >
          {/* ... existing footer ... */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col items-center sm:flex-row sm:justify-between gap-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                QDC Admin Panel &copy; {new Date().getFullYear()} • Qwiklabs Developer Club
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-blue-500 transition-colors">Help</a>
              </div>
            </div>
          </div>
        </motion.footer>
      </div>
    );
  }

  // Fallback
  return null;
}

// Quick Stats Card Component with TypeScript types
function QuickStatCard({ title, value, icon, color, change, positive }: QuickStatCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
          </div>
          <div className={`${color} w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl`}>
            {icon}
          </div>
        </div>
        <div className={`mt-3 text-xs flex items-center ${
          positive === true ? 'text-green-600 dark:text-green-400' : 
          positive === false ? 'text-red-600 dark:text-red-400' : 
          'text-gray-500 dark:text-gray-400'
        }`}>
          {positive === true && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
          )}
          {positive === false && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
            </svg>
          )}
          {change}
        </div>
      </div>
    </motion.div>
  );
}

// Feature Card Component with TypeScript types and Link support
function FeatureCard({ title, description, icon, disabled = false, color = "from-blue-500 to-blue-600", delay = 0, href }: FeatureCardProps) {
  // Card content wrapped in a Link if href is provided
  const cardContent = (
    <div className="p-6 h-full">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white text-2xl mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{description}</p>
      
      <div className="mt-auto">
        <motion.button
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
          className={`text-sm px-4 py-2 bg-gradient-to-r ${color} text-white rounded-md`}
          disabled={disabled}
        >
          {disabled ? "Coming Soon" : href ? "Go to Page" : "Manage"}
        </motion.button>
      </div>
      
      {disabled && (
        <div className="absolute inset-0 backdrop-blur-[1px] bg-gray-900/10 dark:bg-gray-900/20 flex items-center justify-center">
          <span className="px-3 py-1 bg-gray-900/70 text-white text-xs rounded-full">
            Coming Soon
          </span>
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={!disabled ? { scale: 1.02, y: -5 } : {}}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden relative flex flex-col ${
        disabled ? 'opacity-70' : ''
      }`}
    >
      {href && !disabled ? (
        <Link href={href} className="h-full">
          {cardContent}
        </Link>
      ) : (
        cardContent
      )}
    </motion.div>
  );
}
