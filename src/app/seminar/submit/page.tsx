"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SubmitRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the registration page
    router.replace('/seminar/register');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting to registration...</p>
    </div>
  );
}
