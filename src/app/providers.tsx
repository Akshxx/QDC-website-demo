"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { Navigation } from "@/components/layout/Navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <Navigation>{children}</Navigation>
    </SessionProvider>
  );
}
