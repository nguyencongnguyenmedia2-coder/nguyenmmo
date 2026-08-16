import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Bạn là Trợ Lý AI Chuyên Gia của NGUYÊN MMO (Website: nguyenmmo.com) - Nền tảng dịch vụ Digital, MMO & Mạng Xã Hội tự động hóa 24/7 uy tín hàng đầu Việt Nam.

Nhiệm vụ của bạn:
1. Tư vấn, giải đáp thắc mắc của khách hàng thân thiện, chuyên nghiệp, súc tích và cực kỳ am hiểu về các dịch vụ tại Nguyên MMO.
2. Thông tin về các dịch vụ nổi bật của NGUYÊN MMO:
   - Facebook: Nuôi VIA/BM Ads, Buff Follower cá nhân/Fanpage, Tăng Like, Seeding bình luận tự nhiên.
   - TikTok: Tăng Follower mở shop/livestream, Tăng View/Tim video, Gian hàng TikTok Shop.
   - AI Tools: Tài khoản ChatGPT Plus (GPT-4o), Claude 3.5 Sonnet Pro, Midjourney v6 render 8K, Canva Pro vĩnh viễn.
   - Proxy & VPS: Proxy dân cư IPv4/IPv6 tĩnh/xoay, VPS MMO cấu hình cao chạy tool.
   - YouTube/Instagram/Telegram: Tăng Subscribe, Tăng Giờ xem, Member Group Telegram.
3. Chính sách quan trọng:
   - Tốc độ xử lý: Kích hoạt tự động 24/7 chỉ trong 5 đến 30 giây.
   - Bảo hành: Cam kết bảo hành 1 đổi 1 hoặc tự động refill nếu tụt trong thời hạn cam kết.
   - Thanh toán: Nạp tiền tự động qua VietQR Ngân hàng (Techcombank, MBBank) số dư cộng tức thì 24/7.
   - Kỹ thuật viên: Hỗ trợ tư vấn 1-1 qua Telegram (@nguyenmmo07) và Zalo (0934811307).

Hãy trả lời ngắn gọn, lịch sự, sử dụng emoji nhẹ nhàng (⚡, 🚀, 🛡️, 💳, ❤️) và định dạng dòng dễ đọc.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, userMessage } = body;

    const promptText = userMessage || (messages && messages[messages.length - 1]?.content) || '';

    if (!promptText.trim()) {
      return NextResponse.json({ success: false, error: 'Tin nhắn không được để trống!' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;

    if (apiKey) {
      const modelsToTry = [
        'gemini-flash-latest',
        'gemini-3.5-flash',
        'gemini-3-flash-preview',
        'gemini-2.5-flash-lite',
        'gemini-pro-latest'
      ];

      for (const model of modelsToTry) {
        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [
                  {
                    role: 'user',
                    parts: [{ text: `${SYSTEM_PROMPT}\n\nKhách hàng hỏi: "${promptText}"` }],
                  },
                ],
              }),
            }
          );

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            const aiText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (aiText) {
              return NextResponse.json({
                success: true,
                reply: aiText,
                source: `google_gemini_ai_${model}`,
              });
            }
          }
        } catch (e: any) {
          console.warn(`Gemini model ${model} attempt warning:`, e?.message || e);
        }
      }
    }

    // Fallback Intelligent Knowledge Base Engine if API key is not yet set or during network offline
    const reply = getFallbackKnowledgeReply(promptText);

    return NextResponse.json({
      success: true,
      reply,
      source: 'nguyenmmo_ai_knowledge_base',
    });
  } catch (error: any) {
    console.error('Lỗi API Chatbot AI:', error);
    return NextResponse.json(
      {
        success: true,
        reply: 'Xin lỗi, hệ thống AI đang quá tải. Bạn có thể bấm nút "💬 Chat Telegram/Zalo" để được kĩ thuật viên tư vấn trực tiếp ngay nhé! ⚡',
        source: 'error_fallback',
      },
      { status: 200 }
    );
  }
}

function getFallbackKnowledgeReply(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('via') || q.includes('facebook') || q.includes('bm') || q.includes('ads')) {
    return '⚡ **Dịch vụ Facebook & VIA Ads tại Nguyên MMO**:\n• Hệ thống cung cấp dàn VIA Việt/Ngoại kháng cổ, BM50/BM350 sẵn sàng lên Camp Facebook Ads.\n• Buff Follower trang cá nhân/Fanpage chuẩn nick thật bảo hành 1 đổi 1.\n• Hệ thống xử lý tự động trong 5-30 giây sau khi đặt đơn!';
  }

  if (q.includes('tiktok') || q.includes('follow') || q.includes('shop') || q.includes('view')) {
    return '🎵 **Dịch vụ TikTok tại Nguyên MMO**:\n• Tăng Follower nick thật đạt 1.000 follow đủ điều kiện mở TikTok Shop & Bật Livestream.\n• Tăng View/Tim video đẩy xu hướng tự nhiên.\n• Thời gian khởi chạy: 5 - 30 giây tự động 24/7!';
  }

  if (q.includes('ai') || q.includes('chatgpt') || q.includes('claude') || q.includes('midjourney') || q.includes('canva')) {
    return '🤖 **Tài khoản AI Tools Pro tại Nguyên MMO**:\n• ChatGPT Plus (GPT-4o), Claude 3.5 Sonnet Pro, Midjourney v6 render 8K, Canva Pro.\n• Hỗ trợ bàn giao tài khoản kho sẵn hoặc nâng cấp trực tiếp lên Email chính chủ của bạn.\n• Bảo hành full thời gian sử dụng!';
  }

  if (q.includes('proxy') || q.includes('vps') || q.includes('mmo')) {
    return '🌐 **Proxy & VPS MMO tại Nguyên MMO**:\n• Proxy dân cư IPv4/IPv6 tĩnh/xoay tốc độ cao không giới hạn băng thông.\n• VPS MMO cấu hình khủng sẵn sàng nuôi VIA & treo tool 24/7.\n• Bàn giao thông tin kết nối ngay lập tức!';
  }

  if (q.includes('nạp') || q.includes('thanh toán') || q.includes('vietqr') || q.includes('momo') || q.includes('tiền')) {
    return '💳 **Hướng dẫn Nạp tiền VietQR tự động**:\n1. Chọn mục Nạp tiền trên Menu.\n2. Quét mã VietQR chuyển khoản ngân hàng (MBBank/Techcombank).\n3. Hệ thống kiểm tra cú pháp và tự động cộng số dư vào tài khoản của bạn chỉ sau 3 - 5 giây!';
  }

  if (q.includes('bảo hành') || q.includes('lỗi') || q.includes('tụt')) {
    return '🛡️ **Chính sách Bảo hành tại Nguyên MMO**:\n• Tất cả dịch vụ đều đính kèm cam kết Bảo hành 1 đổi 1 hoặc tự động Refill chạy bù nếu có tụt sụt.\n• Nếu cần hỗ trợ kiểm tra gấp, bạn có thể chat với Kĩ thuật viên qua Telegram (@nguyenmmo07) hoặc Zalo (0934811307) nhé!';
  }

  return `🤖 **Nguyên MMO AI Assistant** xin chào!\nTôi có thể giúp bạn giải đáp các dịch vụ Facebook Ads, TikTok Shop, Tài khoản AI (ChatGPT/Claude), Proxy, VPS và Hướng dẫn nạp tiền tự động.\n\nBạn cần hỗ trợ cụ thể về dịch vụ nào ạ? ⚡`;
}
