'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Flame, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-12 pb-20 overflow-hidden">
      {/* Glow Red & Radial Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-red/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT CONTENT (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* BADGE */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-red/10 border border-neon-red/30 text-neon-red text-xs font-extrabold tracking-wider uppercase shadow-neon-red">
              <Flame className="w-4 h-4 fill-neon-red animate-bounce" />
              <span>🔥 KHO DỊCH VỤ DIGITAL THỰC CHIẾN</span>
            </div>

            {/* MAIN HEADING */}
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
              BIẾN <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-red via-red-500 to-rose-400 drop-shadow-[0_0_25px_rgba(255,30,66,0.8)]">DIGITAL</span>
              <br />
              THÀNH LỢI THẾ
            </h1>

            {/* DESCRIPTION */}
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed">
              Kho dịch vụ mạng xã hội, công cụ AI, phần mềm và giải pháp Digital từ <strong className="text-white font-bold">Nguyên MMO</strong> dành cho cá nhân, creator, doanh nghiệp và người làm MMO thực chiến.
            </p>

            {/* CTA BUTTONS */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/services"
                className="px-8 py-4 rounded-2xl bg-neon-red hover:bg-neon-red-hover text-white font-bold text-sm sm:text-base btn-beam-touch hover:scale-105 transition-all flex items-center gap-2 group overflow-hidden"
              >
                <span>Khám phá dịch vụ & công cụ</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/resources"
                className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm sm:text-base hover:scale-105 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-neon-red" />
                <span>Kho tài nguyên miễn phí</span>
              </Link>
            </div>

            {/* STATS COUNTER GRID (4 Stats) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/10">
              <div className="p-3 bg-white/5 border border-white/5 rounded-2xl">
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-1">
                  <span>10K+</span>
                </div>
                <div className="text-xs text-gray-400 font-medium">Khách hàng</div>
              </div>

              <div className="p-3 bg-white/5 border border-white/5 rounded-2xl">
                <div className="text-2xl sm:text-3xl font-black text-neon-red tracking-tight flex items-center gap-1">
                  <span>500+</span>
                </div>
                <div className="text-xs text-gray-400 font-medium">Dịch vụ</div>
              </div>

              <div className="p-3 bg-white/5 border border-white/5 rounded-2xl">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight flex items-center gap-1">
                  <span>24/7</span>
                </div>
                <div className="text-xs text-gray-400 font-medium">Tự động xử lý</div>
              </div>

              <div className="p-3 bg-white/5 border border-white/5 rounded-2xl">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight flex items-center gap-1">
                  <span>99%</span>
                </div>
                <div className="text-xs text-gray-400 font-medium">Đơn hoàn thành</div>
              </div>
            </div>
          </div>

          {/* RIGHT VISUAL TECH DASHBOARD (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto w-full max-w-md border-beam-card p-6 shadow-2xl space-y-5 animate-float backdrop-blur-xl">
              
              {/* Floating Header Card */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-neon-red/20 border border-neon-red/40 flex items-center justify-center text-neon-red">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Nguyên MMO Engine</div>
                    <div className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      Real-time SMM System
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-neon-red/20 text-neon-red font-mono text-[10px] font-bold">
                  AUTO 24/7
                </span>
              </div>

              {/* Social Media Icons Floating Bar */}
              <div className="flex items-center justify-between gap-2 p-3 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-base">🚀</span>
                  <span className="w-8 h-8 rounded-xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-base">🎵</span>
                  <span className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-base">▶</span>
                  <span className="w-8 h-8 rounded-xl bg-sky-600/20 border border-sky-500/30 flex items-center justify-center text-base">✈</span>
                  <span className="w-8 h-8 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-base">🤖</span>
                </div>
                <span className="text-xs text-gray-400 font-mono">+12 Khác</span>
              </div>

              {/* Simulated Live Orders Stream Notifications */}
              <div className="space-y-3">
                <div className="p-3 bg-neon-red/10 border border-neon-red/30 rounded-2xl text-xs space-y-1">
                  <div className="flex items-center justify-between text-neon-red font-bold">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Đơn hàng #DH102948
                    </span>
                    <span className="text-[10px] bg-neon-red text-white px-2 py-0.5 rounded-full font-mono">Đang chạy</span>
                  </div>
                  <div className="text-gray-300 font-medium">3.000 Facebook Follow Việt Nam</div>
                  <div className="text-[10px] text-gray-400 font-mono">Tốc độ: 500 follow/phút ⚡</div>
                </div>

                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs space-y-1">
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Nạp tiền thành công
                    </span>
                    <span className="text-[10px] text-gray-400">Vừa xong</span>
                  </div>
                  <div className="text-gray-300 font-medium">+1.000.000đ qua VietQR Techcombank</div>
                </div>
              </div>

              {/* System Performance Graph simulation */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>Hệ thống xử lý tự động</span>
                  <span className="text-neon-red font-bold">99.8% Uptime</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-neon-red via-rose-500 to-emerald-400 rounded-full w-[95%]"></div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
