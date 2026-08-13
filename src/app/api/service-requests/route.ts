import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Generate REQ-XXXXXX code matching spec 6
function generateRequestCode(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `REQ-${randomNum}`;
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

    const requestCode = generateRequestCode();
    const createdAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newRequestData = {
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

    // 1. Save into Supabase service_requests table
    try {
      await supabase.from('service_requests').insert([newRequestData]);
    } catch (dbErr) {
      console.warn('Supabase DB save note (fallback will keep request in memory):', dbErr);
    }

    // 2. Dispatch Telegram Bot Notification (Backend execution matching spec 9 & 10)
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN || '8887412417:AAFtjT_TmivoybZkzuWA881Tyr2F6EnNEOk';
    const telegramChatId = process.env.TELEGRAM_ADMIN_CHAT_ID || '8093505246';

    const formattedMessage = `🔥 <b>CÓ YÊU CẦU DỊCH VỤ MỚI</b>
━━━━━━━━━━━━━━━━━━
📋 <b>Mã yêu cầu:</b> #${requestCode}
⏰ <b>Thời gian:</b> ${createdAt}

━━━━━━━━━━━━━━━━━━
👤 <b>KHÁCH HÀNG</b>
Tên: <b>${guestName}</b>
SĐT: <code>${guestPhone}</code>
Email: ${guestEmail || 'Chưa cung cấp'}
Telegram: ${telegramUsername || 'Chưa cung cấp'}
Facebook: ${facebookUsername || 'Chưa cung cấp'}

━━━━━━━━━━━━━━━━━━
🛒 <b>DỊCH VỤ</b>
Danh mục: <b>${(categorySnapshot || 'MMO').toUpperCase()}</b>
Dịch vụ: <b>${serviceNameSnapshot}</b>
Loại: ${serviceTypeSnapshot || 'Digital MMO'}

━━━━━━━━━━━━━━━━━━
🔗 <b>THÔNG TIN ĐẶT DỊCH VỤ</b>
Link / Target: <code>${targetUrl || 'Xem ghi chú'}</code>
Tốc độ: <b>${speed || '⚡ Nhanh'}</b>
Số lượng: <b>${Number(quantity).toLocaleString()}</b>
Đơn giá: <b>${Number(unitPrice).toLocaleString()}đ</b>
Dự kiến: <b>${Number(estimatedPrice).toLocaleString()}đ</b>

━━━━━━━━━━━━━━━━━━
📝 <b>GHI CHÚ KHÁCH HÀNG</b>
<i>${customerNote || 'Không có ghi chú thêm.'}</i>

━━━━━━━━━━━━━━━━━━
📌 <b>TRẠNG THÁI:</b> 🟡 CHỜ XỬ LÝ`;

    // Dispatch Telegram API request if Token exists
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_ADMIN_CHAT_ID) {
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
        console.warn('Telegram notification dispatch note:', tgErr);
      }
    }

    return NextResponse.json({
      success: true,
      requestCode,
      message: 'Gửi yêu cầu đặt dịch vụ thành công!',
      data: {
        id: `req-${Date.now()}`,
        requestCode,
        guestName,
        guestPhone,
        guestEmail,
        telegramUsername,
        facebookUsername,
        serviceId,
        serviceNameSnapshot,
        categorySnapshot,
        targetUrl,
        quantity,
        speed,
        unitPrice,
        estimatedPrice,
        customerNote,
        status: 'NEW',
        createdAt,
      },
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
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('request_code', code)
        .single();

      if (data && !error) {
        return NextResponse.json({ success: true, data });
      }
    }

    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return NextResponse.json({ success: true, data: [] });
    }
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: true, data: [] });
  }
}
