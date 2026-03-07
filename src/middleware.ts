import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple middleware for admin routes
export function middleware(request: NextRequest) {
  // For now, just allow all requests to proceed
  return NextResponse.next();
}

export const config = {
  matcher: []
};
