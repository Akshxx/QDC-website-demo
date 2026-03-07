"use client";
import { useEffect } from 'react';

export default function RegisterRedirect() {
  useEffect(() => {
    // Redirect directly to the Google Form
    window.location.href = "https://forms.gle/Pa1zCcewbGRGUjdVA";
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-bold mb-4">Redirecting to registration form...</h1>
        <p>If you are not redirected automatically, please click 
          <a 
            href="https://forms.gle/Pa1zCcewbGRGUjdVA" 
            className="text-amber-600 hover:text-amber-800 ml-1"
          >
            here
          </a>
        </p>
      </div>
    </div>
  );
}
