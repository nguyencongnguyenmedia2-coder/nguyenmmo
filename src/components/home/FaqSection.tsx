'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: '1. Dịch vụ được kích hoạt trong bao lâu?',
      a: 'Hệ thống tự động khởi chạy và kích hoạt dịch vụ chỉ trong 5 đến 30 giây ngay sau khi nạp tiền/đặt đơn hoàn tất.',
    },
    {
      q: '2. NGUYÊN MMO có hỗ trợ sau khi mua không?',
      a: 'Có. Đội ngũ kĩ thuật viên luôn túc trực 24/7 qua Telegram và Zalo để hỗ trợ giải đáp thắc mắc và hướng dẫn chi tiết 1-1 cho khách hàng.',
    },
    {
      q: '3. Dịch vụ có được bảo hành không?',
      a: 'Tất cả các dịch vụ đều được đính kèm chính sách bảo hành 1 đổi 1 hoặc tự động refill nếu có hiện tượng sụt giảm trong thời hạn cam kết.',
    },
    {
      q: '4. Thanh toán bằng hình thức nào?',
      a: 'Nạp tiền hoàn toàn tự động 24/7 qua VietQR Ngân hàng (Techcombank, MBBank), Ví ZaloPay, MoMo với tốc độ cộng số dư ngay lập tức.',
    },
    {
      q: '5. Nếu đơn hàng gặp lỗi thì xử lý thế nào?',
      a: 'Nếu gặp gián đoạn hoặc cần hỗ trợ kiểm tra, bạn chỉ cần liên hệ Telegram/Zalo hỗ trợ, kĩ thuật viên sẽ xử lý hoặc hoàn tiền trong vòng 15-30 phút.',
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neon-red/10 border border-neon-red/30 text-neon-red font-bold text-xs uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>HỖ TRỢ KHÁCH HÀNG</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            CÂU HỎI THƯỜNG GẶP
          </h2>

          <p className="text-gray-400 text-xs sm:text-sm">
            Giải đáp những thắc mắc phổ biến nhất khi trải nghiệm hệ thống NGUYÊN MMO.
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
