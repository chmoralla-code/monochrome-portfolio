import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken, AUTH_COOKIE_NAME } from './lib/auth';

export function middleware(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === '/admin/login';
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');

  // Only protect admin routes
  if (!isAdminPath) {
    return NextResponse.next();
  }

  // Check auth cookie
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isAuthed = token ? verifySessionToken(token) : false;

  // If trying to access admin (not login) and not authenticated, redirect to login
  if (!isLoginPage && !isAuthed) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // If logged in and on login page, redirect to dashboard
  if (isLoginPage && isAuthed) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
