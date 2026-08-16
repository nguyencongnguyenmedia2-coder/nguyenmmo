import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isEmailAdmin(email: string): boolean {
  if (!email) return false;
  const lower = email.toLowerCase().trim();
  return lower === 'admin@nguyenmmo.com' || lower.startsWith('admin@') || lower.includes('admin');
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes and /api/admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const sessionCookie = request.cookies.get('mmo_session')?.value;
    const authHeaderUserId = request.headers.get('x-user-id');
    const authHeaderEmail = request.headers.get('x-user-email');

    let isAdmin = false;
    let isLoggedIn = false;

    if (sessionCookie) {
      try {
        let rawStr = sessionCookie;
        try {
          rawStr = decodeURIComponent(sessionCookie);
        } catch (e) {}
        const sessionUser = JSON.parse(rawStr);
        if (sessionUser && (sessionUser.email || sessionUser.id)) {
          isLoggedIn = true;
          const sessionEmail = String(sessionUser.email || '');
          if (
            isEmailAdmin(sessionEmail) ||
            sessionUser.role === 'admin' ||
            sessionUser.isAdmin === true
          ) {
            isAdmin = true;
          }
        }
      } catch (e) {}
    } else if (authHeaderEmail) {
      isLoggedIn = true;
      if (isEmailAdmin(authHeaderEmail)) {
        isAdmin = true;
      }
    }

    if (!isAdmin) {
      // If API route under /api/admin/*
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json(
          { success: false, error: '403 Forbidden: Admin access required' },
          { status: 403 }
        );
      }

      // If page route under /admin/*
      // If logged in as member, redirect to /account. Otherwise to /login
      const targetRedirect = isLoggedIn ? '/account' : `/login?redirect=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(new URL(targetRedirect, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
