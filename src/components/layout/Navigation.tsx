"use client";

import { usePathname } from "next/navigation";
import { BackgroundGradient } from "@/components/ui/BackgroundGradient";
import Navbar from "./Navbar";

export function Navigation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Update the condition to check for both admin and user dashboard paths
  const isAdminPath = pathname.startsWith('/admin');
  const isUserDashboardPath = pathname.startsWith('/user') || pathname.startsWith('/userlogin') || pathname.startsWith('/dashboard');
  
  // Hide navbar on both admin and user dashboard pages
  const shouldShowNavbar = !isAdminPath && !isUserDashboardPath;
  
  return (
    <>
      <BackgroundGradient />
      <div className="relative flex min-h-screen flex-col pointer-events-auto">
        {shouldShowNavbar && <Navbar />}
        <main className="flex-1 pointer-events-auto relative z-10">{children}</main>
      </div>
    </>
  );
}
