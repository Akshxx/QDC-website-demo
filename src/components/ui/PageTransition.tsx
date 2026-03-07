"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";

interface SparkleProps {
  size: number;
  color: string;
  style: React.CSSProperties;
}

const Sparkle: React.FC<SparkleProps> = ({ size, color, style }) => {
  return (
    <motion.div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: color,
        ...style,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
      }}
      transition={{
        duration: 0.6,
        ease: "easeInOut",
      }}
    />
  );
};

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [sparkles, setSparkles] = useState<React.ReactNode[]>([]);

  // Generate a key from pathname + search params for AnimatePresence
  const routeKey = pathname + searchParams.toString();

  // Create sparkle animation when route changes
  useEffect(() => {
    if (isLoading) {
      const colors = ['#4285F4', '#DB4437', '#F4B400', '#0F9D58'];
      const newSparkles = Array.from({ length: 30 }).map((_, i) => {
        const size = Math.random() * 8 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        return (
          <Sparkle
            key={i}
            size={size}
            color={color}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0,
            }}
          />
        );
      });
      
      setSparkles(newSparkles);
    }
  }, [isLoading]);

  // Track route changes to trigger transition
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsLoading(true);
    };

    const handleRouteChangeComplete = () => {
      setTimeout(() => setIsLoading(false), 600);
    };

    // Add event listeners for navigation
    window.addEventListener("beforeunload", handleRouteChangeStart);
    window.addEventListener("load", handleRouteChangeComplete);

    return () => {
      window.removeEventListener("beforeunload", handleRouteChangeStart);
      window.removeEventListener("load", handleRouteChangeComplete);
    };
  }, []);

  // Manual route tracking to ensure transitions work
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <>
      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative w-24 h-24"
            >
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-full h-full"
              >
                <div className="w-full h-full relative">
                  {sparkles}
                  
                  {/* Google colors loader */}
                  <motion.div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 relative">
                      <motion.div
                        className="absolute w-3 h-3 rounded-full bg-qwik-blue"
                        animate={{
                          x: [0, 8, 0, -8, 0],
                          y: [-8, 0, 8, 0, -8],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <motion.div
                        className="absolute w-3 h-3 rounded-full bg-qwik-red"
                        animate={{
                          x: [8, 0, -8, 0, 8],
                          y: [0, 8, 0, -8, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <motion.div
                        className="absolute w-3 h-3 rounded-full bg-qwik-yellow"
                        animate={{
                          x: [0, -8, 0, 8, 0],
                          y: [8, 0, -8, 0, 8],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <motion.div
                        className="absolute w-3 h-3 rounded-full bg-qwik-green"
                        animate={{
                          x: [-8, 0, 8, 0, -8],
                          y: [0, -8, 0, 8, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={routeKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
};
