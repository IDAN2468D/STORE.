import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const getSecret = () => new TextEncoder().encode(process.env.SESSION_SECRET || "default_secret_for_dev_only_change_in_production");

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    const session = request.cookies.get('session')?.value;

    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const { payload } = await jwtVerify(session, getSecret());
      
      if (payload.role !== 'admin') {
        // Not an admin, redirect to home or a forbidden page
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      // Invalid token
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect profile and checkout (must be logged in)
  if (pathname.startsWith('/profile') || pathname.startsWith('/checkout')) {
     const session = request.cookies.get('session')?.value;
     if (!session) {
        return NextResponse.redirect(new URL('/login', request.url));
     }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*', '/checkout/:path*'],
};
