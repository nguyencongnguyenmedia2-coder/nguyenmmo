'use client';

import React from 'react';
import { Zap, ShieldCheck, DollarSign, Cpu, Sparkles } from 'lucide-react';

export const WhyChooseUsSection: React.FC = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-neon-red" />,
      title: '⚡ KÍCH HOẠT NHANH',
      desc: 'Xử lý đơn hàng tự động, tiết kiệm thời gian tối đa cho công việc của bạn.',
      badge: 'Real-time 5-30s',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-sky-400" />,
      title: '🛡️ BẢO HÀNH UY TÍN',
      desc: 'Chính sách bảo hành 1 đổi 1 và hỗ trợ rõ ràng cho mọi dịch vụ.',
      badge: 'Cam kết 100%',
    },
    {
      icon: <DollarSign className="w-6 h-6 text-emerald-400" />,
      title: '💰 GIÁ TỐI ƯU',
      desc: 'Mức giá cạnh tranh tận gốc cho cá nhân và doanh nghiệp MMO.',
      badge: 'Tiết kiệm 40%',
    },
    {
      icon: <Cpu className="w-6 h-6 text-pink-400" />,
      title: '🤖 TỰ ĐỘNG HÓA 24/7',
      desc: 'Hệ thống hoạt động liên tục 24/7, hạn chế thao tác thủ công.',
      badge: 'Vận hành 24/7',
    },
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neon-red/10 border border-neon-red/30 text-neon-red font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ƯU THẾ VƯỢT TRỘI</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            TẠI SAO BẠN NÊN CHỌN <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-red via-rose-500 to-amber-400">NGUYÊN MMO</span>?
          </h2>

          <p className="text-gray-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-medium">
            Nền tảng dịch vụ Digital được xây dựng để giúp bạn tiết kiệm thời gian, tối ưu chi phí và tăng tốc phát triển.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="group border-beam-card p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-white/30"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform flex items-center justify-center shadow-inner">
                    {item.icon}
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 font-mono">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-neon-red transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
