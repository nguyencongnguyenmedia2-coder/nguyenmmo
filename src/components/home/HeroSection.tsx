'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Flame, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Activity,
  Cpu,
  Server,
  Layers,
  Check
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const [activePlatform, setActivePlatform] = useState<string>('fb');

  const platformList = [
    { id: 'fb', icon: '🚀', label: 'Facebook', count: '120 Gói' },
    { id: 'tt', icon: '🎵', label: 'TikTok', count: '95 Gói' },
    { id: 'ig', icon: '📷', label: 'Instagram', count: '65 Gói' },
    { id: 'yt', icon: '▶', label: 'YouTube', count: '50 Gói' },
    { id: 'tg', icon: '✈', label: 'Telegram', count: '45 Gói' },
    { id: 'ai', icon: '🤖', label: 'AI Tools', count: '80 Gói' },
    { id: 'proxy', icon: '🌐', label: 'Proxy/VPS', count: '40 Gói' },
  ];

  return (
    <section className="relative pt-6 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* LEFT CONTENT (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* HIGH-TECH BADGE */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-beam-pill text-white text-xs font-black tracking-wider uppercase">
              <Flame className="w-4 h-4 text-neon-red fill-neon-red animate-bounce shrink-0" />
              <span className="text-neon-red tracking-wide font-black drop-shadow-[0_0_8px_rgba(255,30,66,0.8)]">
                NỀN TẢNG DỊCH VỤ DIGITAL & MMO AUTOMATION 24/7
              </span>
            </div>

            {/* MAIN HEADING */}
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
              BIẾN <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-red via-rose-500 to-amber-400">DIGITAL</span> THÀNH LỢI THẾ DẪN ĐẦU
            </h1>

            {/* DESCRIPTION */}
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed">
              Kho giải pháp dịch vụ mạng xã hội, công cụ AI, phần mềm và hạ tầng MMO thực chiến từ <strong className="text-white font-bold">Nguyên MMO</strong>. Hệ thống xử lý tự động hóa kích hoạt tức thì chỉ trong 5–30 giây.
            </p>

            {/* QUICK FEATURE BADGES */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold font-mono">
              <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Kích hoạt 5 - 30 Giây</span>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-sky-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>Bảo hành 1 đổi 1 / Refill</span>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gold-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-gold-400 fill-gold-400" />
                <span>Giá tối ưu tận gốc</span>
              </div>
            </div>

            {/* CTA BUTTONS */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/services"
                className="px-7 py-3.5 rounded-2xl border-beam-pill text-white font-black text-sm hover:scale-105 transition-transform flex items-center gap-2 group overflow-hidden"
              >
                <span>Khám phá kho dịch vụ & công cụ</span>
                <ArrowRight className="w-4 h-4 text-neon-red group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/resources"
                className="px-7 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm hover:scale-105 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span>Kho tài nguyên MMO miễn phí</span>
              </Link>
            </div>

            {/* STATS COUNTER GRID (4 Glass Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
              <div className="p-3.5 bg-[#0D0D14] border border-white/10 rounded-2xl space-y-0.5">
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">10,000+</div>
                <div className="text-xs text-gray-400 font-mono">Khách hàng tin dùng</div>
              </div>

              <div className="p-3.5 bg-[#0D0D14] border border-white/10 rounded-2xl space-y-0.5">
                <div className="text-2xl sm:text-3xl font-black text-neon-red tracking-tight">500+</div>
                <div className="text-xs text-gray-400 font-mono">Gói dịch vụ khả dụng</div>
              </div>

              <div className="p-3.5 bg-[#0D0D14] border border-white/10 rounded-2xl space-y-0.5">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">5 - 30s</div>
                <div className="text-xs text-gray-400 font-mono">Tốc độ kích hoạt</div>
              </div>

              <div className="p-3.5 bg-[#0D0D14] border border-white/10 rounded-2xl space-y-0.5">
                <div className="text-2xl sm:text-3xl font-black text-sky-400 tracking-tight">99.8%</div>
                <div className="text-xs text-gray-400 font-mono">Tỷ lệ thành công</div>
              </div>
            </div>
          </div>

          {/* RIGHT VISUAL TECH DASHBOARD (5 cols - VIỀN CHẠY & BỎ SHADOW ĐỎ) */}
          <div className="lg:col-span-5">
            <div className="border-beam-always p-6 space-y-5 backdrop-blur-xl">
              
              {/* Floating Header Status Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-neon-red">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">Nguyên MMO Engine 4.0</div>
                    <div className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      Real-time SMM & AI Network
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
                  ● SYSTEM ACTIVE
                </span>
              </div>

              {/* Interactive Platform Icons Tabs */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-gray-400 font-mono uppercase tracking-wider">
                  Nền tảng hạ tầng tự động:
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                  {platformList.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActivePlatform(item.id)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        activePlatform === item.id
                          ? 'bg-white/15 border-white/30 scale-105'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                      title={`${item.label} (${item.count})`}
                    >
                      <div className="text-base mb-0.5">{item.icon}</div>
                      <div className="text-[9px] font-mono text-gray-300 truncate">{item.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated Live Orders Terminal Feed */}
              <div className="space-y-3">
                <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-neon-red font-bold">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-neon-red fill-neon-red" /> Đơn hàng #DH102948
                    </span>
                    <span className="text-[10px] bg-neon-red/20 text-neon-red border border-neon-red/30 px-2 py-0.5 rounded-full font-mono font-bold">
                      Đang chạy tự động
                    </span>
                  </div>
                  <div className="text-gray-200 font-semibold">3.000 Follower Facebook Người Thật</div>
                  <div className="text-[10px] text-gray-400 font-mono flex items-center justify-between">
                    <span>Tốc độ: <strong className="text-emerald-400">500 follow/phút ⚡</strong></span>
                    <span>Đã chạy: <strong className="text-white">1,850 / 3,000</strong></span>
                  </div>
                </div>

                <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl text-xs space-y-1">
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Nạp tiền tự động thành công
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">Vừa xong</span>
                  </div>
                  <div className="text-gray-200 font-semibold">+1.000.000đ qua VietQR Techcombank</div>
                  <div className="text-[10px] text-gray-400 font-mono">Trạng thái: Đã cộng số dư ngay lập tức</div>
                </div>
              </div>

              {/* System Performance Status */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1 font-mono">
                  <span>Hệ thống máy chủ 24/7 (Latency: 12ms)</span>
                  <span className="text-emerald-400 font-bold">99.9% Uptime</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-neon-red via-rose-500 to-emerald-400 rounded-full w-[99%]"></div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
