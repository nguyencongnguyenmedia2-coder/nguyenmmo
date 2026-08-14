export function escapeHtml(text: string): string {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export interface TelegramOrderPayload {
  requestCode: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  telegramUsername?: string;
  facebookUsername?: string;
  categorySnapshot?: string;
  serviceNameSnapshot: string;
  serviceTypeSnapshot?: string;
  targetUrl?: string;
  speed?: string;
  quantity?: number;
  unitPrice?: number;
  estimatedPrice?: number;
  customerNote?: string;
}

export async function sendDirectTelegramNotification(data: TelegramOrderPayload) {
  const token = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || '8887412417:AAFtjT_TmivoybZkzuWA881Tyr2F6EnNEOk';
  const chatId = process.env.NEXT_PUBLIC_TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_ADMIN_CHAT_ID || '8093505246';

  const safeGuestName = escapeHtml(data.guestName);
  const safeGuestPhone = escapeHtml(data.guestPhone);
  const safeGuestEmail = escapeHtml(data.guestEmail || 'Chưa cung cấp');
  const safeTelegram = escapeHtml(data.telegramUsername || 'Chưa cung cấp');
  const safeFacebook = escapeHtml(data.facebookUsername || 'Chưa cung cấp');
  const safeCategory = escapeHtml((data.categorySnapshot || 'MMO').toUpperCase());
  const safeServiceName = escapeHtml(data.serviceNameSnapshot || 'Dịch vụ MMO');
  const safeServiceType = escapeHtml(data.serviceTypeSnapshot || 'Digital MMO');
  const safeTargetUrl = escapeHtml(data.targetUrl || 'Xem ghi chú');
  const safeSpeed = escapeHtml(data.speed || '⚡ Nhanh');
  const safeNote = escapeHtml(data.customerNote || 'Không có ghi chú thêm.');
  const createdAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const formattedMessage = `🔥 <b>CÓ YÊU CẦU DỊCH VỤ MỚI</b>
━━━━━━━━━━━━━━━━━━
📋 <b>Mã yêu cầu:</b> #${data.requestCode}
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
Số lượng: <b>${Number(data.quantity || 1).toLocaleString()}</b>
Đơn giá: <b>${Number(data.unitPrice || 0).toLocaleString()}đ</b>
Dự kiến: <b>${Number(data.estimatedPrice || 0).toLocaleString()}đ</b>

━━━━━━━━━━━━━━━━━━
📝 <b>GHI CHÚ KHÁCH HÀNG</b>
<i>${safeNote}</i>

━━━━━━━━━━━━━━━━━━
📌 <b>TRẠNG THÁI:</b> 🟡 CHỜ XỬ LÝ`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: formattedMessage,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '✅ NHẬN XỬ LÝ', callback_data: `process_${data.requestCode}` },
              { text: '💬 LIÊN HỆ KHÁCH', url: `https://zalo.me/${safeGuestPhone.replace(/\s+/g, '')}` },
            ],
            [
              { text: '🟡 ĐANG XỬ LÝ', callback_data: `status_processing_${data.requestCode}` },
              { text: '✅ HOÀN THÀNH', callback_data: `status_completed_${data.requestCode}` },
            ],
          ],
        },
      }),
    });
    const result = await res.json();
    if (!res.ok) {
      console.error('Direct Telegram error:', result);
    }
    return result;
  } catch (err) {
    console.error('Direct Telegram notification fetch error:', err);
  }
}
