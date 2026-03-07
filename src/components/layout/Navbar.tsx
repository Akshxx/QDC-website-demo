"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/lib/utils";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Events", path: "/events" },
  { name: "Team", path: "/team" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState("/");
  const [isHovering, setIsHovering] = useState(false);
  const [hoverItem, setHoverItem] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [visibleNavItems, setVisibleNavItems] = useState(navItems);
  const [mobileNavItems, setMobileNavItems] = useState<typeof navItems>([]);
  const [screenSize, setScreenSize] = useState<string>("large");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Set active item based on current path
    setActiveItem(window.location.pathname);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Update navigation items based on screen size - adjusted breakpoints
  useEffect(() => {
    const updateNavItems = () => {
      const width = window.innerWidth;
      
      if (width >= 1560) {
        // XXL screens - show all items in navbar
        setVisibleNavItems(navItems);
        setMobileNavItems([]);
        setScreenSize("xlarge");
      } else if (width >= 1430) {
        // XL screens - show all items but more compressed
        setVisibleNavItems(navItems);
        setMobileNavItems([]);
        setScreenSize("large");
      } else if (width >= 1150) {
        // LG screens - show first 3 items in navbar
        setVisibleNavItems(navItems.slice(0, 3));
        setMobileNavItems(navItems.slice(3));
        setScreenSize("medium");
      } else if (width >= 975) {
        // Medium-small screens - show first 2 items in navbar
        setVisibleNavItems(navItems.slice(0, 2));
        setMobileNavItems(navItems.slice(2));
        setScreenSize("small");
      } else if (width >= 768) {
        // MD screens - show only Home in navbar
        setVisibleNavItems(navItems.slice(0, 1));
        setMobileNavItems(navItems.slice(1));
        setScreenSize("smaller");
      } else {
        // SM screens - all items in mobile menu
        setVisibleNavItems([]);
        setMobileNavItems(navItems);
        setScreenSize("mobile");
      }
    };

    // Initial check
    updateNavItems();
    
    // Add event listener for window resize
    window.addEventListener('resize', updateNavItems);
    
    return () => {
      window.removeEventListener('resize', updateNavItems);
    };
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    const handleRouteChange = () => {
      setActiveItem(window.location.pathname);
      setIsMobileMenuOpen(false);
    };

    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Helper function to determine if a path is active
  const isActive = (path: string) => {
    if (path === '/') {
      return activeItem === '/';
    }
    return activeItem.startsWith(path);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-2 md:pt-3">
      {/* Background blur effect */}
      <motion.div
        className="absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-qwik-blue-light to-qwik-green-light opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </motion.div>
      
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={cn(
          "rounded-3xl transition-all duration-500 py-2 px-3 sm:px-4 backdrop-blur-xl relative w-[95%] sm:w-[90%]",
          isScrolled
            ? "bg-gradient-to-r from-white/95 via-white/75 to-white/95 dark:from-gray-900/95 dark:via-gray-800/75 dark:to-gray-900/95 border-[1px] border-gray-200/30 dark:border-gray-700/30"
            : "bg-gradient-to-r from-white/85 via-white/65 to-white/85 dark:from-gray-900/85 dark:via-gray-800/65 dark:to-gray-900/85 border border-white/40 dark:border-gray-700/40"
        )}
        style={{
          boxShadow: isHovering || isScrolled || isMobileMenuOpen
            ? '0 8px 20px -5px rgba(0, 0, 0, 0.1), 0 6px 10px -6px rgba(0, 0, 0, 0.05), inset 0 0 20px rgba(255, 255, 255, 0.1)' 
            : '0 6px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.025), inset 0 0 10px rgba(255, 255, 255, 0.05)',
        }}
      >
        {/* Animated gradient border effect */}
        <span className="absolute inset-0 rounded-3xl bg-gradient-to-r from-qwik-blue/10 via-qwik-green/10 to-qwik-red/10 border border-white/50 dark:border-gray-800/50 -z-10"></span>
        
        <div className="flex items-center justify-between">
          {/* Left side logos section with optimized spacing */}
          <div className={cn(
            "flex items-center flex-shrink-0",
            screenSize === "mobile" ? "w-[65%] max-w-[200px]" : 
            screenSize === "smaller" ? "w-[50%] max-w-[250px]" :
            screenSize === "small" ? "w-[35%] max-w-[300px]" :
            screenSize === "medium" ? "w-[32%] max-w-[320px]" : 
            screenSize === "large" ? "w-[25%] max-w-[300px]" :
            "w-[25%] max-w-[320px]"
          )}>
            {/* QDC Logo with responsive width */}
            <Link href="/" className="flex-shrink-0 group relative">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0"
              >
                <Image
                  src="/images/qdc.png"
                  alt="QDC Logo"
                  width={160}
                  height={80}
                  className={cn(
                    "object-contain h-full w-auto",
                    screenSize === "mobile" || screenSize === "smaller" ? "max-h-10" : 
                    "max-h-12 sm:max-h-14 lg:max-h-16"
                  )}
                />
              </motion.div>
            </Link>
            
            {/* Always visible divider with adjusted spacing */}
            <div className="h-8 w-[1px] bg-gray-300 dark:bg-gray-700 mx-1 md:mx-2"></div>
            
            {/* Organization logos with tighter, better calibrated spacing */}
            <div className={cn(
              "items-center gap-0 h-16 -my-1",
              screenSize === "mobile" || screenSize === "smaller" ? "hidden" : 
              screenSize === "small" ? "hidden sm:flex" : "hidden md:flex"
            )}>
              {/* Divider */}
              <div className="h-8 w-[1px] bg-gray-300 dark:bg-gray-700 mx-1"></div>
              
              {/* SRM Logo with more aggressive negative margin */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className={cn(
                  "flex-shrink-0", 
                  screenSize === "large" || screenSize === "medium" ? "-ml-10" : 
                  screenSize === "small" ? "-ml-12" : "-ml-8"
                )}
              >
                <Image
                  src="/images/srmlogo.png"
                  alt="SRM Logo"
                  width={screenSize === "large" ? 200 : 220}
                  height={90}
                  className="object-contain h-full max-h-14 lg:max-h-16"
                />
              </motion.div>
              
              {/* SOC Logo with more aggressive negative margin */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className={cn(
                  "flex-shrink-0", 
                  screenSize === "large" || screenSize === "medium" ? "-ml-8" : 
                  screenSize === "small" ? "-ml-10" : "-ml-6"
                )}
              >
                <Image
                  src="/images/soc.png"
                  alt="SOC Logo"
                  width={screenSize === "large" ? 70 : 80}
                  height={70}
                  className="object-contain h-full max-h-12 lg:max-h-14"
                />
              </motion.div>
              
              {/* NWC Logo with increased negative margin */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className={cn(
                  "flex-shrink-0", 
                  screenSize === "large" ? "-ml-4" : 
                  screenSize === "medium" ? "-ml-5" : 
                  screenSize === "small" ? "-ml-6" : "mx-0.5"
                )}
              >
                <Image
                  src="/images/nwc.png"
                  alt="NWC Logo"
                  width={screenSize === "large" ? 80 : 100}
                  height={80}
                  className="object-contain h-full max-h-14 lg:max-h-16"
                />
              </motion.div>
            </div>
          </div>

          {/* Center space to prevent overlap */}
          <div className={cn(
            "flex-grow",
            screenSize === "mobile" ? "hidden" :
            screenSize === "smaller" ? "w-10" : 
            screenSize === "small" ? "w-8" :
            screenSize === "medium" ? "w-10" :
            screenSize === "large" ? "w-14" : "w-16"
          )}></div>

          {/* Dynamic Navigation - adjusted responsive visibility */}
          {visibleNavItems.length > 0 && (
            <div className={cn(
              "items-center bg-white/20 dark:bg-gray-800/20 rounded-full backdrop-blur-sm px-2 py-0.5",
              screenSize === "mobile" ? "hidden" : 
              screenSize === "smaller" ? "flex mr-2" : "flex mr-4"
            )}>
              <div className="relative flex">
                {visibleNavItems.map((item, index) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setActiveItem(item.path)}
                    onMouseEnter={() => setHoverItem(item.path)}
                    onMouseLeave={() => setHoverItem(null)}
                    className="relative px-3 sm:px-4 py-2 rounded-full transition-all duration-300 flex items-center justify-center z-10"
                    style={{ 
                      width: screenSize === "smaller" ? "100px" :
                             screenSize === "small" ? "110px" : 
                             screenSize === "medium" ? "120px" :
                             screenSize === "large" ? "130px" : "140px"
                    }} 
                  >
                    {/* Active tab overlay */}
                    {isActive(item.path) && (
                      <motion.div
                        layoutId="navbar-active-bg"
                        className="absolute inset-0 rounded-full -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      >
                        <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 rounded-full" />
                        <div className="absolute inset-0 rounded-full p-[2px]">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-qwik-green via-qwik-blue to-qwik-red opacity-80" />
                          <div className="absolute inset-[2px] rounded-full bg-white/80 dark:bg-gray-800/80" />
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Hover indicator */}
                    <AnimatePresence>
                      {hoverItem === item.path && !isActive(item.path) && (
                        <motion.span
                          className="absolute inset-0 rounded-full bg-white/30 dark:bg-gray-800/30 -z-10"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.15 }}
                        />
                      )}
                    </AnimatePresence>
                    
                    <span
                      className={cn(
                        screenSize === "smaller" || screenSize === "small" 
                          ? "text-xs font-medium transition-colors relative"
                          : "text-sm font-medium transition-colors relative",
                        isActive(item.path)
                          ? "text-qwik-blue dark:text-qwik-blue-light font-semibold"
                          : "text-gray-700 dark:text-gray-300"
                      )}
                    >
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Desktop Join Us button with increased height */}
          <div className={cn(
            "hidden",
            (screenSize === "large" || screenSize === "xlarge") ? "lg:flex" : "hidden",
            screenSize === "large" ? "w-[160px]" : "w-[180px]",
            "justify-end"
          )}>
            <Link href="https://www.instagram.com/qdc_srmist/" className={cn(
              "block",
              screenSize === "large" ? "w-[130px]" : "w-[140px]"
            )}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group w-full px-4 py-3 text-xs font-medium bg-gradient-to-r from-qwik-blue via-qwik-blue to-qwik-blue-dark text-white rounded-full hover:shadow-md transition-all relative overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-qwik-green to-qwik-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center justify-center gap-1.5">
                  Follow Us
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </motion.button>
            </Link>
          </div>

          {/* Mobile menu button - adjusted position */}
          {mobileNavItems.length > 0 && (
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors",
                screenSize === "mobile" ? "ml-auto" : ""
              )}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
              {screenSize !== "mobile" && (
                <span className="absolute -top-1 -right-1 bg-qwik-red text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {mobileNavItems.length}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && mobileNavItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-700/50"
            >
              <nav className="flex flex-col space-y-2">
                {mobileNavItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "px-4 py-2 rounded-md transition-colors",
                      isActive(item.path)
                        ? "bg-qwik-blue/10 text-qwik-blue dark:text-qwik-blue-light font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                    )}
                    onClick={() => {
                      setActiveItem(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Join Us button in mobile menu with increased height */}
                {screenSize !== "large" && (
                  <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700/50">
                    <Link href="/contact" className="block">
                      <button className="w-full py-3 px-4 bg-qwik-blue text-white rounded-md font-medium flex items-center justify-center gap-2 hover:bg-qwik-blue-dark transition-colors">
                        Join Us
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </Link>
                  </div>
                )}
                
                {/* Show organization logos in mobile menu only on small screens */}
                {screenSize === "mobile" && (
                  <div className="pt-4 mt-2 border-t border-gray-200 dark:border-gray-700/50 flex items-center justify-between">
                    <p className="text-xs text-gray-500 dark:text-gray-400">In collaboration with:</p>
                    <div className="flex items-center gap-3">
                      <Image
                        src="/images/srmlogo.png"
                        alt="SRM Logo"
                        width={60}
                        height={25}
                        className="object-contain h-6"
                      />
                      <Image
                        src="/images/soc.png"
                        alt="SOC Logo"
                        width={25}
                        height={25}
                        className="object-contain h-5"
                      />
                      <Image
                        src="/images/nwc.png"
                        alt="NWC Logo"
                        width={25}
                        height={25}
                        className="object-contain h-5"
                      />
                    </div>
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </div>
  );
};

export default Navbar;
