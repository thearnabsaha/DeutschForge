import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_PATHS = ['/', '/login', '/signup'];
const PUBLIC_API_PREFIXES = ['/api/auth/'];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true;
  // Static assets and Next.js internals
  if (pathname.startsWith('/_next/') || pathname.startsWith('/favicon') || pathname === '/manifest.json' || pathname === '/sw.js') return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths through
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('df-session')?.value;

  if (!token) {
    // For API routes, return 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    // For page routes, redirect to login
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    // Invalid/expired token
    const response = pathname.startsWith('/api/')
      ? NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
      : NextResponse.redirect(new URL('/login', request.url));

    // Clear the invalid cookie
    response.cookies.delete('df-session');
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, favicon.svg
     * - public files (sw.js, manifest.json)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|favicon\\.svg|sw\\.js|manifest\\.json).*)',
  ],
};
