import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const REQUESTS_FILE = path.join(DATA_DIR, 'server_requests.json');

// Global server in-memory store for real-time customer requests
let IN_MEMORY_SERVICE_REQUESTS: any[] = [];

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
  } catch (e) {
    console.error('Error saving requests to server_requests.json:', e);
  }
}

// Initialize from file
IN_MEMORY_SERVICE_REQUESTS = ensureRequestsFileExists();

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

    if (!guestName || !guestPhone) {
      return NextResponse.json({ success: false, error: 'Họ tên và Số điện thoại là bắt buộc' }, { status: 400 });
    }

    const requestCode = body.requestCode || generateRequestCode();
    const createdAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newRequestRecord = {
      id: `req-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      requestCode,
      user_id: userId || null,
      guestName,
      guestPhone,
      guestEmail: guestEmail || '',
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

    // Save into server file and memory
    const fileRequests = ensureRequestsFileExists();
    const existingIndex = fileRequests.findIndex(r => r.requestCode === requestCode);
    if (existingIndex >= 0) {
      fileRequests[existingIndex] = newRequestRecord;
    } else {
      fileRequests.unshift(newRequestRecord);
    }
    saveRequestsToFile(fileRequests);
    IN_MEMORY_SERVICE_REQUESTS = fileRequests;

    // Dispatch Telegram Bot Notification
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN || '8887412417:AAFtjT_TmivoybZkzuWA881Tyr2F6EnNEOk';
    const telegramChatId = process.env.TELEGRAM_ADMIN_CHAT_ID || '8093505246';

    const safeGuestName = escapeHtml(guestName);
    const safeGuestPhone = escapeHtml(guestPhone);
    const safeGuestEmail = escapeHtml(guestEmail || 'Chưa cung cấp');
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
                  { text: '💬 LIÊN HỆ KHÁCH', url: `https://zalo.me/${guestPhone.replace(/\s+/g, '')}` },
                ],
                [
                  { text: '🟡 ĐANG XỬ LÝ', callback_data: `status_processing_${requestCode}` },
                  { text: '✅ HOÀN THÀNH', callback_data: `status_completed_${requestCode}` },
                ],
              ],
            },
          }),
        });
      } catch (tgErr) {
        console.error('Telegram notification error:', tgErr);
      }
    }

    return NextResponse.json({
      success: true,
      requestCode,
      message: 'Gửi yêu cầu đặt dịch vụ thành công!',
      data: newRequestRecord,
    });
  } catch (error: any) {
    console.error('Error handling service request API:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    const fileRequests = ensureRequestsFileExists();

    if (code) {
      const match = fileRequests.find(r => r.requestCode === code);
      if (match) {
        return NextResponse.json({ success: true, data: match });
      }
    }

    return NextResponse.json({ success: true, data: fileRequests });
  } catch (err) {
    const fileRequests = ensureRequestsFileExists();
    return NextResponse.json({ success: true, data: fileRequests });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { requestCode, status, adminNote, assignedAdmin } = body;

    if (!requestCode) {
      return NextResponse.json({ success: false, error: 'Missing requestCode' }, { status: 400 });
    }

    const fileRequests = ensureRequestsFileExists();
    const target = fileRequests.find(r => r.requestCode === requestCode);
    if (target) {
      if (status) target.status = status;
      if (adminNote !== undefined) target.adminNote = adminNote;
      if (assignedAdmin) target.assignedAdmin = assignedAdmin;
      target.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
      saveRequestsToFile(fileRequests);
    }

    return NextResponse.json({ success: true, message: 'Cập nhật trạng thái yêu cầu thành công!' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server Error' }, { status: 500 });
  }
}
