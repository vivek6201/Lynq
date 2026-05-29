import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('session_token')?.value;
  const { pathname, searchParams } = request.nextUrl;

  // Protect all dashboard routes
  if (pathname.startsWith('/dashboard') && !sessionToken) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Prevent logged-in users from visiting auth screen (unless completing Google callback/onboarding)
  if (pathname.startsWith('/auth') && sessionToken) {
    // Let callbacks run to properly initialize client-side auth state
    if (!searchParams.has('session_token') && !searchParams.has('registered')) {
      return NextResponse.redirect(new URL('/dashboard/profile', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
