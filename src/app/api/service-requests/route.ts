import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAuthUser } from '@/lib/server-auth';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const REQUESTS_FILE = path.join(DATA_DIR, 'server_requests.json');

function ensureRequestsFileExists(): any[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(REQUESTS_FILE)) {
      fs.writeFileSync(REQUESTS_FILE, JSON.stringify([]), 'utf-8');
      return [];
    }
    const content = fs.readFileSync(REQUESTS_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveRequestsToFile(reqs: any[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(REQUESTS_FILE, JSON.stringify(reqs, null, 2), 'utf-8');
  } catch (e) {}
}

function generateRequestCode(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `REQ-${randomNum}`;
}

function escapeHtml(text: string): string {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthUser(request);
    const body = await request.json();
    const {
      userId,
      guestName,
      guestPhone,
      guestEmail,
      telegramUsername,
      facebookUsername,
      serviceId,
      serviceNameSnapshot,
      categorySnapshot,
      serviceTypeSnapshot,
      platform,
      targetUrl,
      quantity,
      speed,
      unitPrice,
      estimatedPrice,
      customerNote,
      serviceInputs,
    } = body;

    const finalUserId = auth?.user?.id || userId || null;
    const finalGuestEmail = guestEmail || auth?.user?.email || '';
    const finalGuestPhone = guestPhone || auth?.user?.phone || '';
    const finalGuestName = guestName || auth?.user?.name || 'Khách hàng';

    if (!finalGuestName || !finalGuestPhone) {
      return NextResponse.json({ success: false, error: 'Họ tên và Số điện thoại là bắt buộc' }, { status: 400 });
    }

    const requestCode = body.requestCode || generateRequestCode();
    const createdAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newRequestRecord = {
      id: `req-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      requestCode,
      user_id: finalUserId,
      guestName: finalGuestName,
      guestPhone: finalGuestPhone,
      guestEmail: finalGuestEmail,
      telegramUsername: telegramUsername || '',
      facebookUsername: facebookUsername || '',
      serviceId: serviceId || 'custom-service',
      serviceNameSnapshot: serviceNameSnapshot || 'Dịch vụ MMO',
      categorySnapshot: (categorySnapshot || 'MMO').toUpperCase(),
      serviceTypeSnapshot: serviceTypeSnapshot || 'Social Media',
      platform: platform || 'Web',
      targetUrl: targetUrl || '',
      quantity: Number(quantity) || 1,
      speed: speed || '⚡ Nhanh',
      unitPrice: Number(unitPrice) || 0,
      estimatedPrice: Number(estimatedPrice) || 0,
      customerNote: customerNote || '',
      serviceInputs: serviceInputs || {},
      status: 'NEW',
      createdAt,
      updatedAt: createdAt,
    };

    // 1. Save locally to File Store
    const fileRequests = ensureRequestsFileExists();
    const existingIndex = fileRequests.findIndex(r => r.requestCode === requestCode);
    if (existingIndex >= 0) {
      fileRequests[existingIndex] = newRequestRecord;
    } else {
      fileRequests.unshift(newRequestRecord);
    }
    saveRequestsToFile(fileRequests);

    // 2. Save to Supabase Cloud DB
    try {
      const dbPayload = {
        id: newRequestRecord.id,
        request_code: requestCode,
        user_id: finalUserId,
        guest_name: finalGuestName,
        guest_phone: finalGuestPhone,
        guest_email: finalGuestEmail,
        telegram_username: telegramUsername || '',
        facebook_username: facebookUsername || '',
        service_id: serviceId || 'custom-service',
        service_name_snapshot: serviceNameSnapshot || 'Dịch vụ MMO',
        category_snapshot: categorySnapshot || 'MMO',
        service_type_snapshot: serviceTypeSnapshot || 'Social Media',
        platform: platform || 'Web',
        target_url: targetUrl || '',
        quantity: Number(quantity) || 1,
        speed: speed || '⚡ Nhanh',
        unit_price: Number(unitPrice) || 0,
        estimated_price: Number(estimatedPrice) || 0,
        customer_note: customerNote || '',
        service_inputs: serviceInputs || {},
        status: 'NEW',
      };
      await supabase.from('service_requests').insert([dbPayload]);
    } catch (e) {}

    // Dispatch Telegram Bot Notification
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN || '8887412417:AAFtjT_TmivoybZkzuWA881Tyr2F6EnNEOk';
    const telegramChatId = process.env.TELEGRAM_ADMIN_CHAT_ID || '8093505246';

    const safeGuestName = escapeHtml(finalGuestName);
    const safeGuestPhone = escapeHtml(finalGuestPhone);
    const safeGuestEmail = escapeHtml(finalGuestEmail || 'Chưa cung cấp');
    const safeTelegram = escapeHtml(telegramUsername || 'Chưa cung cấp');
    const safeFacebook = escapeHtml(facebookUsername || 'Chưa cung cấp');
    const safeCategory = escapeHtml((categorySnapshot || 'MMO').toUpperCase());
    const safeServiceName = escapeHtml(serviceNameSnapshot || 'Dịch vụ MMO');
    const safeServiceType = escapeHtml(serviceTypeSnapshot || 'Digital MMO');
    const safeTargetUrl = escapeHtml(targetUrl || 'Xem ghi chú');
    const safeSpeed = escapeHtml(speed || '⚡ Nhanh');
    const safeNote = escapeHtml(customerNote || 'Không có ghi chú thêm.');

    const formattedMessage = `🔥 <b>CÓ YÊU CẦU DỊCH VỤ MỚI</b>
━━━━━━━━━━━━━━━━━━
📋 <b>Mã yêu cầu:</b> #${requestCode}
⏰ <b>Thời gian:</b> ${createdAt}

━━━━━━━━━━━━━━━━━━
👤 <b>KHÁCH HÀNG</b>
Tên: <b>${safeGuestName}</b>
SĐT: <code>${safeGuestPhone}</code>
Email: ${safeGuestEmail}
Telegram: ${safeTelegram}
Facebook: ${safeFacebook}

━━━━━━━━━━━━━━━━━━
🛒 <b>DỊCH VỤ</b>
Danh mục: <b>${safeCategory}</b>
Dịch vụ: <b>${safeServiceName}</b>
Loại: ${safeServiceType}

━━━━━━━━━━━━━━━━━━
🔗 <b>THÔNG TIN ĐẶT DỊCH VỤ</b>
Link / Target: <code>${safeTargetUrl}</code>
Tốc độ: <b>${safeSpeed}</b>
Số lượng: <b>${Number(quantity).toLocaleString()}</b>
Đơn giá: <b>${Number(unitPrice).toLocaleString()}đ</b>
Dự kiến: <b>${Number(estimatedPrice).toLocaleString()}đ</b>

━━━━━━━━━━━━━━━━━━
📝 <b>GHI CHÚ KHÁCH HÀNG</b>
<i>${safeNote}</i>

━━━━━━━━━━━━━━━━━━
📌 <b>TRẠNG THÁI:</b> 🟡 CHỜ XỬ LÝ`;

    if (telegramToken && telegramChatId) {
      try {
        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: formattedMessage,
            parse_mode: 'HTML',
            reply_markup: {
              inline_keyboard: [
                [
                  { text: '✅ NHẬN XỬ LÝ', callback_data: `process_${requestCode}` },
                  { text: '💬 LIÊN HỆ KHÁCH', url: `https://zalo.me/${finalGuestPhone.replace(/\s+/g, '')}` },
                ],
                [
                  { text: '🟡 ĐANG XỬ LÝ', callback_data: `status_processing_${requestCode}` },
                  { text: '✅ HOÀN THÀNH', callback_data: `status_completed_${requestCode}` },
                ],
              ],
            },
          }),
        });
      } catch (tgErr) {}
    }

    return NextResponse.json({
      success: true,
      requestCode,
      message: 'Gửi yêu cầu đặt dịch vụ thành công!',
      data: newRequestRecord,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const auth = await getAuthUser(request);
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const id = searchParams.get('id');

    const fileRequests = ensureRequestsFileExists();
    let dbRequests: any[] = [];

    // Fetch live from Supabase Cloud DB
    try {
      const { data, error } = await supabase.from('service_requests').select('*').order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        dbRequests = data.map((r: any) => ({
          id: r.id || `req-${Date.now()}`,
          requestCode: r.request_code,
          user_id: r.user_id,
          guestName: r.guest_name,
          guestPhone: r.guest_phone,
          guestEmail: r.guest_email,
          telegramUsername: r.telegram_username,
          facebookUsername: r.facebook_username,
          serviceId: r.service_id,
          serviceNameSnapshot: r.service_name_snapshot,
          categorySnapshot: r.category_snapshot,
          serviceTypeSnapshot: r.service_type_snapshot,
          platform: r.platform,
          targetUrl: r.target_url,
          quantity: r.quantity,
          speed: r.speed,
          unitPrice: r.unit_price,
          estimatedPrice: r.estimated_price,
          customerNote: r.customer_note,
          serviceInputs: r.service_inputs,
          status: r.status,
          assignedAdmin: r.assigned_admin,
          adminNote: r.admin_note,
          createdAt: r.created_at,
          updatedAt: r.updated_at,
        }));
      }
    } catch (e) {}

    // Deduplicate and merge Supabase DB + File Requests
    const codeSet = new Set<string>();
    const combined: any[] = [];

    for (const item of [...dbRequests, ...fileRequests]) {
      if (item.requestCode && !codeSet.has(item.requestCode)) {
        codeSet.add(item.requestCode);
        combined.push(item);
      }
    }

    // 1. SINGLE ORDER DETAIL LOOKUP
    if (code || id) {
      const match = combined.find(
        (r) => (code && r.requestCode === code) || (id && (r.id === id || r.requestCode === id))
      );

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
            { success: false, error: '403 Forbidden: Bạn không có quyền xem đơn hàng này' },
            { status: 403 }
          );
        }
        return NextResponse.json({ success: true, data: match });
      }

      // Unauthenticated guest lookup: allow ONLY if request user_id is null and code is exact
      if (!match.user_id) {
        return NextResponse.json({ success: true, data: match });
      }

      return NextResponse.json(
        { success: false, error: '403 Forbidden: Vui lòng đăng nhập để xem đơn hàng' },
        { status: 403 }
      );
    }

    // 2. LIST ORDERS QUERY
    if (auth?.isAdmin) {
      // ADMIN -> view ALL orders
      return NextResponse.json({ success: true, data: combined });
    }

    if (auth?.isMember) {
      // MEMBER -> ONLY view orders belonging to current user
      const userOrders = combined.filter((r) => {
        return (
          (r.user_id && r.user_id === auth.user.id) ||
          (r.guestEmail && r.guestEmail.toLowerCase() === auth.user.email.toLowerCase()) ||
          (r.guestPhone && auth.user.phone && r.guestPhone === auth.user.phone)
        );
      });
      return NextResponse.json({ success: true, data: userOrders });
    }

    // Unauthenticated request for list of orders
    return NextResponse.json({ success: true, data: [] });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await getAuthUser(request);
    if (!auth || !auth.isAdmin) {
      return NextResponse.json(
        { success: false, error: '403 Forbidden: Chỉ Admin mới có quyền cập nhật trạng thái đơn hàng' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { requestCode, status, adminNote, assignedAdmin } = body;

    if (!requestCode) {
      return NextResponse.json({ success: false, error: 'Missing requestCode' }, { status: 400 });
    }

    // 1. Update File Store
    const fileRequests = ensureRequestsFileExists();
    const target = fileRequests.find(r => r.requestCode === requestCode);
    if (target) {
      if (status) target.status = status;
      if (adminNote !== undefined) target.adminNote = adminNote;
      if (assignedAdmin) target.assignedAdmin = assignedAdmin;
      target.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
      saveRequestsToFile(fileRequests);
    }

    // 2. Update Supabase Cloud DB
    try {
      const updateData: any = { updated_at: new Date().toISOString() };
      if (status) updateData.status = status;
      if (adminNote !== undefined) updateData.admin_note = adminNote;
      if (assignedAdmin) updateData.assigned_admin = assignedAdmin;
      await supabase.from('service_requests').update(updateData).eq('request_code', requestCode);
    } catch (e) {}

    return NextResponse.json({ success: true, message: 'Cập nhật trạng thái yêu cầu thành công!' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await getAuthUser(request);
    if (!auth || !auth.isAdmin) {
      return NextResponse.json(
        { success: false, error: '403 Forbidden: Chỉ Admin mới có quyền xóa đơn hàng' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const code = searchParams.get('code');

    if (!id && !code) {
      return NextResponse.json({ success: false, error: 'Missing order id or code' }, { status: 400 });
    }

    // 1. Delete from File Store
    const fileRequests = ensureRequestsFileExists();
    const filteredFile = fileRequests.filter(r => r.id !== id && r.requestCode !== code && r.requestCode !== id);
    saveRequestsToFile(filteredFile);

    // 2. Delete from Supabase
    try {
      if (code) {
        await supabase.from('service_requests').delete().eq('request_code', code);
      }
      if (id) {
        await supabase.from('service_requests').delete().eq('id', id);
      }
    } catch (e) {}

    return NextResponse.json({ success: true, message: 'Đã xóa đơn hàng thành công' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server Error' }, { status: 500 });
  }
}
