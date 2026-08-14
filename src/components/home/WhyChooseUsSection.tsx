'use client';

import React from 'react';
import { Zap, ShieldCheck, DollarSign, Headset, Sparkles, CheckCircle2 } from 'lucide-react';

export const WhyChooseUsSection: React.FC = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-neon-red" />,
      title: 'Tự Động 24/7 Real-Time',
      desc: 'Hệ thống tự động kích hoạt và xử lý yêu cầu chỉ trong 5–30 giây sau khi đặt đơn.',
      badge: '⚡ Tốc độ cao',
      glowColor: 'group-hover:border-neon-red/50 group-hover:shadow-neon-red/20',
    },
    {
      icon: <DollarSign className="w-6 h-6 text-emerald-400" />,
      title: 'Mức Giá Tối Ưu Tận Gốc',
      desc: 'Được kết nối trực tiếp với nhà cung cấp lớn, giúp tiết kiệm đến 40% chi phí so với thị trường.',
      badge: '💰 Tiết kiệm nhất',
      glowColor: 'group-hover:border-emerald-500/50 group-hover:shadow-emerald-500/20',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-sky-400" />,
      title: 'Cam Kết Bảo Hành 1 Đổi 1',
      desc: 'Mọi dịch vụ đều có chính sách bảo hành rõ ràng, hỗ trợ hoàn tiền hoặc chạy lại nếu có sự cố.',
      badge: '🛡️ An toàn 100%',
      glowColor: 'group-hover:border-sky-500/50 group-hover:shadow-sky-500/20',
    },
    {
      icon: <Headset className="w-6 h-6 text-gold-400" />,
      title: 'Tư Vấn Kĩ Thuật 24/7',
      desc: 'Đội ngũ hỗ trợ thực chiến sẵn sàng giải đáp và tư vấn giải pháp hiệu quả 1-1 qua Telegram & Zalo.',
      badge: '💬 Hỗ trợ 1-1',
      glowColor: 'group-hover:border-gold-500/50 group-hover:shadow-gold-500/20',
    },
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neon-red/10 border border-neon-red/30 text-neon-red font-extrabold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-neon-red" />
            <span>ƯU THẾ VƯỢT TRỘI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            TẠI SAO BẠN NÊN CHỌN <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-red via-rose-500 to-amber-400">NGUYÊN MMO</span>?
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Nền tảng dịch vụ Digital & MMO được thiết kế hiện đại, minh bạch và vận hành hoàn toàn tự động cho mọi cá nhân & doanh nghiệp.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className={`group relative border-beam-card p-6 flex flex-col justify-between transition-all duration-300 ${item.glowColor}`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform flex items-center justify-center shadow-inner">
                    {item.icon}
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-300 font-mono">
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

              <div className="pt-4 mt-4 border-t border-white/5 flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Đã kiểm định chất lượng</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
