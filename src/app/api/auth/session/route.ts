import { NextResponse } from 'next/server';
import { getAuthUser, determineUserRole, getServerUsers } from '@/lib/server-auth';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'server_users.json');

function ensureUsersFile(): any[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([]), 'utf-8');
      return [];
    }
    const content = fs.readFileSync(USERS_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveUsers(users: any[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (e) {}
}

// GET: Returns current server session
export async function GET(request: Request) {
  const auth = await getAuthUser(request);
  if (!auth) {
    return NextResponse.json({ success: false, authenticated: false, user: null }, { status: 401 });
  }
  return NextResponse.json({
    success: true,
    authenticated: true,
    user: auth.user,
    isAdmin: auth.isAdmin,
  });
}

// POST: Establish server session cookie on Login / Register
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, phone, id } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email là bắt buộc' }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const users = ensureUsersFile();
    const existingIndex = users.findIndex(
      (u) => (id && u.id === id) || (u.email && u.email.toLowerCase() === cleanEmail)
    );

    const realRole = determineUserRole(cleanEmail);
    const userId = existingIndex >= 0 ? users[existingIndex].id : id || `usr-${Date.now()}`;

    const nowStr = new Date().toISOString().substring(0, 19).replace('T', ' ');
    const userRecord: any = {
      id: userId,
      username: cleanEmail.split('@')[0],
      name: name || (existingIndex >= 0 ? users[existingIndex].name : cleanEmail.split('@')[0]),
      email: cleanEmail,
      phone: phone || (existingIndex >= 0 ? users[existingIndex].phone : ''),
      balance: existingIndex >= 0 ? users[existingIndex].balance || 0 : 0,
      vipTier: existingIndex >= 0 ? users[existingIndex].vipTier || 'free' : 'free',
      role: realRole,
      isAdmin: realRole === 'admin',
      createdAt: existingIndex >= 0 ? users[existingIndex].createdAt || nowStr : nowStr,
      updatedAt: nowStr,
    };

    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...userRecord };
    } else {
      users.unshift(userRecord);
    }
    saveUsers(users);

    const sessionPayload = {
      id: userRecord.id,
      email: userRecord.email,
      name: userRecord.name,
      phone: userRecord.phone,
      role: userRecord.role,
      isAdmin: userRecord.isAdmin,
    };

    const response = NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: userRecord,
    });

    // Set cookie mmo_session
    response.cookies.set({
      name: 'mmo_session',
      value: JSON.stringify(sessionPayload),
      httpOnly: false, // allow JS reading if needed
      path: '/',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server Error' }, { status: 500 });
  }
}

// DELETE: Logout & clear session cookie
export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Đã đăng xuất' });
  response.cookies.set({
    name: 'mmo_session',
    value: '',
    path: '/',
    maxAge: 0,
  });
  return response;
}
