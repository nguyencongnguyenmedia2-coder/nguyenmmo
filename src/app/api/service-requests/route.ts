import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Global server in-memory store for real-time customer requests
const IN_MEMORY_SERVICE_REQUESTS: any[] = [];

// Generate REQ-XXXXXX code matching spec 6
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

    // Save into server memory
    const existingIndex = IN_MEMORY_SERVICE_REQUESTS.findIndex(r => r.requestCode === requestCode);
    if (existingIndex >= 0) {
      IN_MEMORY_SERVICE_REQUESTS[existingIndex] = newRequestRecord;
    } else {
      IN_MEMORY_SERVICE_REQUESTS.unshift(newRequestRecord);
    }

    // 1. Save into Supabase service_requests table
    const dbPayload = {
      request_code: requestCode,
      user_id: userId || null,
      guest_name: guestName,
      guest_phone: guestPhone,
      guest_email: guestEmail || '',
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

    try {
      await supabase.from('service_requests').insert([dbPayload]);
    } catch (dbErr) {
      console.warn('Supabase DB save note (fallback in-memory store active):', dbErr);
    }

    // 2. Dispatch Telegram Bot Notification (Backend execution matching spec 9 & 10)
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

    // Dispatch Telegram API request if Token and ChatId exist
    if (telegramToken && telegramChatId) {
      try {
        const tgRes = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
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
        const tgData = await tgRes.json();
        if (!tgRes.ok) {
          console.error('Telegram Bot send error response:', tgData);
        } else {
          console.log('Telegram Bot message sent successfully:', tgData.result?.message_id);
        }
      } catch (tgErr) {
        console.error('Telegram notification dispatch error:', tgErr);
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

    if (code) {
      const inMem = IN_MEMORY_SERVICE_REQUESTS.find(r => r.requestCode === code);
      if (inMem) {
        return NextResponse.json({ success: true, data: inMem });
      }

      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('request_code', code)
        .single();

      if (data && !error) {
        return NextResponse.json({ success: true, data });
      }
    }

    // Fetch live from Supabase
    let dbDataList: any[] = [];
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        dbDataList = data;
      }
    } catch (e) {}

    const dbMapped = dbDataList.map((r: any) => ({
      id: r.id || `req-${Date.now()}`,
      requestCode: r.request_code,
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

    // Merge in-memory and DB data deduplicated by requestCode
    const codes = new Set<string>();
    const combined: any[] = [];

    for (const item of [...IN_MEMORY_SERVICE_REQUESTS, ...dbMapped]) {
      if (item.requestCode && !codes.has(item.requestCode)) {
        codes.add(item.requestCode);
        combined.push(item);
      }
    }

    return NextResponse.json({ success: true, data: combined });
  } catch (err) {
    return NextResponse.json({ success: true, data: IN_MEMORY_SERVICE_REQUESTS });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { requestCode, status, adminNote, assignedAdmin } = body;

    if (!requestCode) {
      return NextResponse.json({ success: false, error: 'Missing requestCode' }, { status: 400 });
    }

    // Update in-memory record
    const target = IN_MEMORY_SERVICE_REQUESTS.find(r => r.requestCode === requestCode);
    if (target) {
      if (status) target.status = status;
      if (adminNote !== undefined) target.adminNote = adminNote;
      if (assignedAdmin) target.assignedAdmin = assignedAdmin;
      target.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
    }

    // Update Supabase DB
    try {
      const updateData: any = { updated_at: new Date().toISOString() };
      if (status) updateData.status = status;
      if (adminNote !== undefined) updateData.admin_note = adminNote;
      if (assignedAdmin) updateData.assigned_admin = assignedAdmin;

      await supabase
        .from('service_requests')
        .update(updateData)
        .eq('request_code', requestCode);
    } catch (e) {}

    return NextResponse.json({ success: true, message: 'Cập nhật trạng thái yêu cầu thành công!' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server Error' }, { status: 500 });
  }
}

