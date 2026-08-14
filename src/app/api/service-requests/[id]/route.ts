import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/server-auth';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const REQUESTS_FILE = path.join(DATA_DIR, 'server_requests.json');

function ensureRequestsFileExists(): any[] {
  try {
    if (!fs.existsSync(REQUESTS_FILE)) return [];
    const content = fs.readFileSync(REQUESTS_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getAuthUser(request);
    const targetId = params.id;

    const fileRequests = ensureRequestsFileExists();
    const match = fileRequests.find((r) => r.id === targetId || r.requestCode === targetId);

    if (!match) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy đơn hàng' }, { status: 404 });
    }

    if (auth?.isAdmin) {
      return NextResponse.json({ success: true, data: match });
    }

    if (auth?.isMember) {
      const isOwner =
        (match.user_id && match.user_id === auth.user.id) ||
        (match.guestEmail && match.guestEmail.toLowerCase() === auth.user.email.toLowerCase()) ||
        (match.guestPhone && auth.user.phone && match.guestPhone === auth.user.phone);

      if (!isOwner) {
        return NextResponse.json(
          { success: false, error: '403 Forbidden: Bạn không có quyền truy cập đơn hàng này' },
          { status: 403 }
        );
      }
      return NextResponse.json({ success: true, data: match });
    }

    return NextResponse.json(
      { success: false, error: '403 Forbidden: Vui lòng đăng nhập' },
      { status: 403 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await getAuthUser(request);
  if (!auth || !auth.isAdmin) {
    return NextResponse.json(
      { success: false, error: '403 Forbidden: Chỉ Admin mới có quyền cập nhật đơn hàng' },
      { status: 403 }
    );
  }
  return NextResponse.json({ success: true, message: 'Updated' });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await getAuthUser(request);
  if (!auth || !auth.isAdmin) {
    return NextResponse.json(
      { success: false, error: '403 Forbidden: Chỉ Admin mới có quyền cập nhật đơn hàng' },
      { status: 403 }
    );
  }
  return NextResponse.json({ success: true, message: 'Updated' });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await getAuthUser(request);
  if (!auth || !auth.isAdmin) {
    return NextResponse.json(
      { success: false, error: '403 Forbidden: Chỉ Admin mới có quyền xóa đơn hàng' },
      { status: 403 }
    );
  }
  return NextResponse.json({ success: true, message: 'Deleted' });
}
