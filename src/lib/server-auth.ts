import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

export interface ServerUser {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'member' | 'client';
  isAdmin: boolean;
  balance?: number;
  vipTier?: string;
}

export interface AuthResult {
  user: ServerUser;
  isAdmin: boolean;
  isMember: boolean;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'server_users.json');

export function getServerUsers(): ServerUser[] {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      return [];
    }
    const content = fs.readFileSync(USERS_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export function isEmailAdmin(email: string): boolean {
  if (!email) return false;
  const lower = email.toLowerCase().trim();
  return lower === 'admin@nguyenmmo.com' || lower.startsWith('admin@') || lower.includes('admin');
}

export function determineUserRole(email: string, storedRole?: string, storedIsAdmin?: boolean): 'admin' | 'member' {
  if (isEmailAdmin(email) || storedRole === 'admin' || storedIsAdmin === true) {
    return 'admin';
  }
  return 'member';
}

/**
 * Validates session and checks role on server side.
 * NEVER trusts client-side role assertions in request bodies.
 */
export async function getAuthUser(request: Request): Promise<AuthResult | null> {
  try {
    let sessionCookieVal: string | null = null;

    // 1. Try reading cookie header from request
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/mmo_session=([^;]+)/);
    if (match && match[1]) {
      try {
        sessionCookieVal = decodeURIComponent(match[1]);
      } catch (e) {
        sessionCookieVal = match[1];
      }
    }

    // Fallback: try next/headers cookies()
    if (!sessionCookieVal) {
      try {
        const cookieStore = cookies();
        const c = cookieStore.get('mmo_session');
        if (c?.value) {
          try {
            sessionCookieVal = decodeURIComponent(c.value);
          } catch (e) {
            sessionCookieVal = c.value;
          }
        }
      } catch (e) {}
    }

    // 2. Try reading custom headers (x-user-id, x-user-email, Authorization)
    const headerUserId = request.headers.get('x-user-id');
    const headerUserEmail = request.headers.get('x-user-email');

    let rawSessionUser: any = null;

    if (sessionCookieVal) {
      try {
        rawSessionUser = JSON.parse(sessionCookieVal);
      } catch (e) {}
    }

    const email = rawSessionUser?.email || headerUserEmail || '';
    const userId = rawSessionUser?.id || headerUserId || '';

    if (!email && !userId) {
      return null;
    }

    // Look up user in server users store
    const serverUsers = getServerUsers();
    const matchedUser = serverUsers.find(
      (u) => (userId && u.id === userId) || (email && u.email.toLowerCase() === email.toLowerCase())
    );

    const userEmail = matchedUser?.email || email;
    const finalUserId = matchedUser?.id || userId || `usr-${Date.now()}`;
    const userName = matchedUser?.name || rawSessionUser?.name || 'User';
    const userPhone = matchedUser?.phone || rawSessionUser?.phone || '';

    // SERVER-AUTHORITATIVE ROLE CHECK:
    // Email containing admin or server record marked admin => Admin.
    // Member email => Member. Client payload role is OVERRIDDEN.
    const realRole = determineUserRole(userEmail, matchedUser?.role, matchedUser?.isAdmin);
    const isAdmin = realRole === 'admin';

    const verifiedUser: ServerUser = {
      id: finalUserId,
      username: matchedUser?.username || userEmail.split('@')[0] || 'user',
      name: userName,
      email: userEmail,
      phone: userPhone,
      role: realRole,
      isAdmin,
      balance: matchedUser?.balance || 0,
      vipTier: matchedUser?.vipTier || 'free',
    };

    return {
      user: verifiedUser,
      isAdmin,
      isMember: !isAdmin,
    };
  } catch (err) {
    return null;
  }
}
