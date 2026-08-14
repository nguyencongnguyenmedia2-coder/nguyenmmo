import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'server_users.json');

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
  } catch (e) {}
}

export async function GET() {
  const fileUsers = ensureUsersFileExists();
  let dbUsersList: any[] = [];

  // Try fetching live from Supabase Cloud DB
  try {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (!error && Array.isArray(data)) {
      dbUsersList = data.map((u: any) => ({
        id: u.id,
        username: u.username,
        name: u.full_name || u.name,
        email: u.email,
        phone: u.phone || '',
        balance: Number(u.balance) || 0,
        vipTier: u.vip_tier || 'free',
        totalOrders: Number(u.total_orders) || 0,
        createdAt: u.created_at,
        updatedAt: u.updated_at,
      }));
    }
  } catch (e) {}

  // Deduplicate and merge Supabase DB users + File users
  const emailSet = new Set<string>();
  const combined: any[] = [];

  for (const user of [...dbUsersList, ...fileUsers]) {
    if (user.email && !emailSet.has(user.email.toLowerCase())) {
      emailSet.add(user.email.toLowerCase());
      combined.push(user);
    }
  }

  return NextResponse.json({ success: true, data: combined });
}

export async function POST(request: Request) {
  try {
    const userPayload = await request.json();
    if (!userPayload.email) {
      return NextResponse.json({ success: false, error: 'Email là bắt buộc' }, { status: 400 });
    }

    const updatedUser = {
      id: userPayload.id || `usr-${Date.now()}`,
      username: userPayload.username || userPayload.email.split('@')[0],
      name: userPayload.name || userPayload.fullName || 'Khách hàng',
      email: userPayload.email,
      phone: userPayload.phone || '',
      balance: Number(userPayload.balance) || 0,
      vipTier: userPayload.vipTier || 'free',
      totalOrders: Number(userPayload.totalOrders) || 0,
      role: userPayload.role || 'client',
      isAdmin: userPayload.isAdmin || false,
      createdAt: userPayload.createdAt || new Date().toISOString().substring(0, 19).replace('T', ' '),
      updatedAt: new Date().toISOString().substring(0, 19).replace('T', ' '),
    };

    // 1. Save locally to File Store
    const fileUsers = ensureUsersFileExists();
    const existingIndex = fileUsers.findIndex((u) => u.id === updatedUser.id || u.email.toLowerCase() === updatedUser.email.toLowerCase());
    if (existingIndex >= 0) {
      fileUsers[existingIndex] = { ...fileUsers[existingIndex], ...updatedUser };
    } else {
      fileUsers.unshift(updatedUser);
    }
    saveUsersToFile(fileUsers);

    // 2. Save to Supabase Cloud DB
    try {
      const dbRow = {
        id: updatedUser.id,
        username: updatedUser.username,
        full_name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        vip_tier: updatedUser.vipTier,
        balance: updatedUser.balance,
        total_orders: updatedUser.totalOrders,
      };
      await supabase.from('profiles').upsert([dbRow]);
    } catch (e) {}

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

    const fileUsers = ensureUsersFileExists();
    const target = fileUsers.find((u) => u.id === userId);
    if (target) {
      if (balance !== undefined) target.balance = Number(balance);
      if (vipTier !== undefined) target.vipTier = vipTier;
      if (totalOrders !== undefined) target.totalOrders = Number(totalOrders);
      target.updatedAt = new Date().toISOString().substring(0, 19).replace('T', ' ');
      saveUsersToFile(fileUsers);
    }

    // Update Supabase Cloud DB
    try {
      const dbUpdate: any = {};
      if (balance !== undefined) dbUpdate.balance = Number(balance);
      if (vipTier !== undefined) dbUpdate.vip_tier = vipTier;
      if (totalOrders !== undefined) dbUpdate.total_orders = Number(totalOrders);
      await supabase.from('profiles').update(dbUpdate).eq('id', userId);
    } catch (e) {}

    return NextResponse.json({ success: true, data: target || { id: userId, balance, vipTier } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server Error' }, { status: 500 });
  }
}
