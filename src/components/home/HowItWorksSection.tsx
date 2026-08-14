'use client';

import React from 'react';
import { Search, Edit3, Rocket, ArrowRight } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      icon: <Search className="w-6 h-6 text-neon-red" />,
      title: 'Chọn Dịch Vụ & Công Cụ',
      desc: 'Tìm kiếm dịch vụ Facebook, TikTok, Instagram, AI Tools hoặc Proxy trong kho tài nguyên thực chiến.',
    },
    {
      step: '02',
      icon: <Edit3 className="w-6 h-6 text-sky-400" />,
      title: 'Điền Thông Số & Link',
      desc: 'Nhập số lượng, link bài viết, email nhận dịch vụ hoặc ghi chú riêng cho kĩ thuật viên.',
    },
    {
      step: '03',
      icon: <Rocket className="w-6 h-6 text-emerald-400" />,
      title: 'Hệ Thống Tự Động Kích Hoạt',
      desc: 'Đơn hàng được gửi trực tiếp tới máy chủ xử lý tự động và báo kết quả real-time qua Telegram/Zalo.',
    },
  ];

  return (
    <section className="py-16 bg-[#07070C] relative border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neon-red/10 border border-neon-red/30 text-neon-red font-extrabold text-xs uppercase tracking-wider">
            <span>⚡ QUY TRÌNH 3 BƯỚC ĐƠN GIẢN</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            CÁCH ĐẶT DỊCH VỤ <span className="text-neon-red">NHANH CHÓNG</span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm">
            Chỉ mất chưa đầy 30 giây để hoàn tất đơn hàng mà không cần thủ tục rườm rà.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, index) => (
            <div key={index} className="relative group">
              <div className="p-6 border-beam-card h-full space-y-4 hover:scale-[1.02] transition-transform">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-neon-red/40 transition-colors shadow-inner">
                    {item.icon}
                  </div>
                  <span className="text-3xl font-black text-white/10 font-mono group-hover:text-neon-red/30 transition-colors">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-neon-red transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 z-20 text-gray-600">
                  <ArrowRight className="w-6 h-6" />
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
