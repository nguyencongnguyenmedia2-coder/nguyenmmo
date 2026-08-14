import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'server_users.json');

// Helper to ensure data directory and file exist
function ensureUsersFileExists(): any[] {
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

function saveUsersToFile(users: any[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving users to server_users.json:', e);
  }
}

export async function GET() {
  const users = ensureUsersFileExists();
  return NextResponse.json({ success: true, data: users });
}

export async function POST(request: Request) {
  try {
    const userPayload = await request.json();
    if (!userPayload.email) {
      return NextResponse.json({ success: false, error: 'Email là bắt buộc' }, { status: 400 });
    }

    const users = ensureUsersFileExists();
    const existingIndex = users.findIndex((u) => u.id === userPayload.id || u.email.toLowerCase() === userPayload.email.toLowerCase());

    const updatedUser = {
      id: userPayload.id || `usr-${Date.now()}`,
      username: userPayload.username || userPayload.email.split('@')[0],
      name: userPayload.name || userPayload.fullName || 'Khách hàng',
      email: userPayload.email,
      phone: userPayload.phone || '',
      balance: Number(userPayload.balance) || 0,
      vipTier: userPayload.vipTier || 'free',
      totalOrders: Number(userPayload.totalOrders) || 0,
      processingOrders: Number(userPayload.processingOrders) || 0,
      completedOrders: Number(userPayload.completedOrders) || 0,
      role: userPayload.role || 'client',
      isAdmin: userPayload.isAdmin || false,
      createdAt: userPayload.createdAt || new Date().toISOString().substring(0, 19).replace('T', ' '),
      updatedAt: new Date().toISOString().substring(0, 19).replace('T', ' '),
    };

    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...updatedUser };
    } else {
      users.unshift(updatedUser);
    }

    saveUsersToFile(users);

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, balance, vipTier, totalOrders } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Missing userId' }, { status: 400 });
    }

    const users = ensureUsersFileExists();
    const target = users.find((u) => u.id === userId);
    if (!target) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    if (balance !== undefined) target.balance = Number(balance);
    if (vipTier !== undefined) target.vipTier = vipTier;
    if (totalOrders !== undefined) target.totalOrders = Number(totalOrders);
    target.updatedAt = new Date().toISOString().substring(0, 19).replace('T', ' ');

    saveUsersToFile(users);

    return NextResponse.json({ success: true, data: target });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server Error' }, { status: 500 });
  }
}
