"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  
  // Log session for debugging
  useEffect(() => {
    console.log("Login page - Session status:", status);
    console.log("Login page - Session data:", session);
    
    // If already logged in, redirect to admin home
    if (status === "authenticated") {
      console.log("Already authenticated, redirecting to home");
      window.location.href = "/admin/home";
    }
  }, [status, session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      console.log("Attempting login with credentials:", { username });
      
      // Add more detailed debugging for the sign-in process
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
        callbackUrl: "/admin/home"
      });
      
      console.log("Login result:", result);
      
      // Better error handling
      if (result?.error) {
        console.error("Login error:", result.error);
        setError(`Authentication failed: ${result.error}`);
        setIsLoading(false);
        return;
      }
      
      // Success handling
      if (result?.ok) {
        console.log("Login successful, waiting for session...");
        
        // Give the session a moment to establish, then redirect
        setTimeout(() => {
          console.log("Redirecting after login");
          window.location.href = "/admin/home";
        }, 1000);
      } else {
        setError("Failed to authenticate. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login exception:", error);
      setError(`An unexpected error occurred: ${error}`);
      setIsLoading(false);
    }
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  // Login form
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Debug info at the top */}
      <div className="fixed top-2 right-2 bg-black/80 text-white p-2 rounded text-xs z-50 max-w-xs">
        <div>Status: {status}</div>
        <div>Session: {session ? "Yes" : "No"}</div>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Image
                src="/images/qdc.png"
                alt="QDC Logo"
                width={150}
                height={70}
                className="h-16 w-auto"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Login</h1>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Debug session status */}
          <div className="mt-4 text-center text-xs text-gray-500">
            Session Status: {status}
          </div>
        </div>
      </div>
    </div>
  );
}
