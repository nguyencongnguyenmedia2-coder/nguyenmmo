'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: '1. Dịch vụ tại Nguyên MMO có an toàn cho tài khoản cá nhân / Fanpage không?',
      a: 'Hoàn toàn an toàn 100%. Các dịch vụ tương tác (Follow, Like, View, Sub) được chạy từ tài khoản người dùng thực Việt Nam với tốc độ tự nhiên, tuân thủ chính sách các nền tảng mạng xã hội Facebook, TikTok, YouTube, Instagram.',
    },
    {
      q: '2. Thời gian khởi chạy và hoàn thành đơn hàng là bao lâu?',
      a: 'Sau khi chọn dịch vụ và bấm gửi yêu cầu, hệ thống tự động khởi chạy sau 5–30 phút tùy theo lượng tải server. Bạn có thể theo dõi tiến độ công việc trực tiếp trong trang quản lý đơn hàng.',
    },
    {
      q: '3. Nếu đơn hàng bị lỗi hoặc tụt tương tác thì xử lý thế nào?',
      a: 'Hệ thống áp dụng chính sách Bảo hành 1 đổi 1 hoặc Chạy bù tự động trong thời hạn bảo hành. Bạn chỉ cần liên hệ Telegram/Zalo hỗ trợ, đội ngũ kĩ thuật viên sẽ giải quyết trong vòng 15-30 phút.',
    },
    {
      q: '4. Tôi có thể liên hệ tư vấn giải pháp MMO / chạy Ads riêng không?',
      a: 'Có. Ngoài cung cấp kho dịch vụ, Nguyên MMO nhận tư vấn giải pháp chiến dịch Marketing, build kênh TikTok/Facebook và cung cấp nguyên liệu MMO thực chiến 1-1 cho khách hàng.',
    },
    {
      q: '5. Phương thức thanh toán nào được hỗ trợ?',
      a: 'Hệ thống hỗ trợ thanh toán qua VietQR Ngân hàng tự động (Techcombank, MBBank), Ví điện tử MoMo, ZaloPay và thanh toán trực tiếp.',
    },
  ];

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neon-red/10 border border-neon-red/30 text-neon-red font-extrabold text-xs uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>GIẢI ĐÁP THẮC MẮC</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            CÂU HỎI THƯỜNG GẶP (FAQ)
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm">
            Những thắc mắc phổ biến nhất của khách hàng khi lần đầu trải nghiệm hệ thống.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border-beam-card overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-neon-red transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neon-red transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-gray-300 leading-relaxed border-t border-white/5 pt-3 animate-in fade-in">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
