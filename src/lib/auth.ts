// Simple cookie-based authentication for admin dashboard
// Credentials: username: admin, password: admin1234

export const ADMIN_USERNAME = 'admin';
export const ADMIN_PASSWORD = 'admin1234';
export const AUTH_COOKIE_NAME = 'admin_session';
export const SESSION_TOKEN = 'arcyrhiel-admin-session-2026-secure-token';

/**
 * Verify admin credentials
 */
export function verifyCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

/**
 * Create a session token
 */
export function createSessionToken(): string {
  return SESSION_TOKEN;
}

/**
 * Verify a session token
 */
export function verifySessionToken(token: string | undefined): boolean {
  return token === SESSION_TOKEN;
}

/**
 * Check if request is authenticated (for middleware)
 */
export function isAuthenticated(request: Request): boolean {
  const cookie = request.headers.get('cookie');
  if (!cookie) return false;
  
  const match = cookie.match(new RegExp(`${AUTH_COOKIE_NAME}=([^;]+)`));
  if (!match) return false;
  
  return verifySessionToken(match[1]);
}

/**
 * Check auth for API routes - returns 401 response if not authenticated
 */
export function requireAuth(request: Request): { authenticated: boolean; error?: Response } {
  const cookie = request.headers.get('cookie');
  if (!cookie) {
    return {
      authenticated: false,
      error: new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    };
  }
  
  const match = cookie.match(new RegExp(`${AUTH_COOKIE_NAME}=([^;]+)`));
  if (!match || !verifySessionToken(match[1])) {
    return {
      authenticated: false,
      error: new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    };
  }
  
  return { authenticated: true };
}
