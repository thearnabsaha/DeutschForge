import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'deutschforge-secret-key-change-in-production');
const COOKIE_NAME = 'df-session';

const PROTECTED_PATHS = ['/', '/practice', '/exam', '/grammar', '/chat', '/vocabulary', '/progress', '/settings'];
const AUTH_PATHS = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes and static files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/sw.js') ||
    pathname.startsWith('/manifest.json') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch {}
  }

  // If on auth page and already logged in, redirect to dashboard
  if (AUTH_PATHS.some((p) => pathname === p) && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If on protected page and not logged in, redirect to login
  const isProtected =
    PROTECTED_PATHS.some((p) => pathname === p) ||
    pathname.startsWith('/exam/') ||
    pathname.startsWith('/grammar/') ||
    pathname.startsWith('/chat/');
  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon-.*\\.png).*)'],
};
