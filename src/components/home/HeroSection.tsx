'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Flame, 
  ArrowRight, 
  MessageSquare, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Users, 
  CheckCheck, 
  ShieldCheck,
  Sparkles,
  Server
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'server'>('orders');

  return (
    <section className="relative pt-6 pb-12 overflow-hidden">
      
      {/* Glow Effects Background */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-neon-red/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2"></div>
      <div className="absolute top-40 right-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 1. HERO 2-COLUMNS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* LEFT COLUMN (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* BADGE */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-red/10 border border-neon-red/30 text-neon-red font-bold text-xs shadow-neon-red tracking-wide">
              <span className="w-2 h-2 rounded-full bg-neon-red animate-ping"></span>
              <span>● NỀN TẢNG DIGITAL MMO #1</span>
            </div>

            {/* MAIN HEADING */}
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.08]">
              BIẾN{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-red via-rose-500 to-amber-400">
                DIGITAL
              </span>{' '}
              THÀNH LỢI THẾ DẪN ĐẦU
            </h1>

            {/* DESCRIPTION */}
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed font-normal">
              Dịch vụ Digital • MMO • Social Media • AI Tools • Proxy • VPS
              <br className="hidden sm:inline" />
              Tự động hóa – tối ưu chi phí – kích hoạt nhanh.
            </p>

            {/* CTA BUTTONS */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/services"
                className="px-7 py-3.5 rounded-2xl bg-neon-red hover:bg-neon-red-hover text-white font-black text-sm btn-beam-touch hover:scale-105 transition-all shadow-neon-red flex items-center gap-2 group overflow-hidden"
              >
                <span>KHÁM PHÁ DỊCH VỤ</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="https://t.me/nguyenmmo07"
                target="_blank"
                rel="noreferrer"
                className="px-7 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm hover:scale-105 transition-all flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-sky-400" />
                <span>💬 TƯ VẤN NGAY</span>
              </a>
            </div>

            {/* QUICK HIGHLIGHT TAGS */}
            <div className="flex flex-wrap items-center gap-4 pt-3 text-xs font-mono text-gray-400">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCheck className="w-4 h-4" />
                <span>Kích hoạt tự động 24/7</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5 text-sky-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Bảo hành 1 đổi 1</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: SAAS FLOATING DASHBOARD (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative border-beam-always rounded-3xl p-6 bg-[#0D0D14]/90 backdrop-blur-xl space-y-5 shadow-2xl">
              
              {/* Dashboard Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-neon-red/20 border border-neon-red/40 flex items-center justify-center text-neon-red shrink-0">
                    <Activity className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-white flex items-center gap-2">
                      <span>NGUYÊN MMO ENGINE</span>
                      <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-mono rounded font-bold">v4.2</span>
                    </div>
                    <div className="text-[11px] text-gray-400 font-mono">Digital Service Platform</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-[10px] font-mono">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      activeTab === 'orders' ? 'bg-neon-red text-white font-bold' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Đơn hàng
                  </button>
                  <button
                    onClick={() => setActiveTab('server')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      activeTab === 'server' ? 'bg-neon-red text-white font-bold' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Máy chủ
                  </button>
                </div>
              </div>

              {/* Live Order Feeds / Server Status */}
              {activeTab === 'orders' ? (
                <div className="space-y-3">
                  {/* Item 1: In Progress */}
                  <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5 text-amber-400">
                        <Zap className="w-3.5 h-3.5 fill-amber-400 animate-pulse" />
                        <span>Đơn #DH10942 • TikTok Follow</span>
                      </span>
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-[10px] font-mono">
                        Đang xử lý
                      </span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-400 to-neon-red h-full w-[65%] rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                      <span>Đã chạy: 650 / 1.000</span>
                      <span>Thời gian: ~12 giây</span>
                    </div>
                  </div>

                  {/* Item 2: Completed */}
                  <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Đơn #DH10941 • Facebook VIA Pro</span>
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-mono">
                        Hoàn tất
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                      <span>Số lượng: 10 VIA</span>
                      <span className="text-emerald-400 font-bold">Đã kích hoạt ⚡</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs font-mono">
                  <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-sky-400" />
                      <span className="text-gray-200">SMM Core API Server</span>
                    </div>
                    <span className="text-emerald-400 font-bold">Online (12ms)</span>
                  </div>
                  <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-400" />
                      <span className="text-gray-200">AI Automation Engine</span>
                    </div>
                    <span className="text-emerald-400 font-bold">Active 24/7</span>
                  </div>
                </div>
              )}

              {/* System Performance Meter */}
              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                  <span>Trạng thái hệ thống (Uptime)</span>
                  <span className="text-emerald-400 font-bold">99.8% Active</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-neon-red via-rose-500 to-emerald-400 rounded-full w-[99.8%]"></div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 2. TRUST / STATS SECTION (4 CARDS) */}
        <div className="pt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="p-5 sm:p-6 bg-[#0A0A0F] border border-white/10 rounded-3xl space-y-1 hover:border-neon-red/40 hover:shadow-neon-red/10 transition-all group">
            <div className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-red to-rose-400 font-mono tracking-tight group-hover:scale-105 transition-transform origin-left">
              10,000+
            </div>
            <div className="text-xs sm:text-sm font-bold text-gray-300">Đơn hàng đã xử lý</div>
            <div className="text-[10px] text-gray-500 font-mono">Hệ thống tự động 24/7</div>
          </div>

          <div className="p-5 sm:p-6 bg-[#0A0A0F] border border-white/10 rounded-3xl space-y-1 hover:border-pink-500/40 hover:shadow-pink-500/10 transition-all group">
            <div className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-300 font-mono tracking-tight group-hover:scale-105 transition-transform origin-left">
              500+
            </div>
            <div className="text-xs sm:text-sm font-bold text-gray-300">Khách hàng tin dùng</div>
            <div className="text-[10px] text-gray-500 font-mono">Cá nhân & Doanh nghiệp</div>
          </div>

          <div className="p-5 sm:p-6 bg-[#0A0A0F] border border-white/10 rounded-3xl space-y-1 hover:border-amber-500/40 hover:shadow-amber-500/10 transition-all group">
            <div className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-rose-400 font-mono tracking-tight group-hover:scale-105 transition-transform origin-left">
              5–30s
            </div>
            <div className="text-xs sm:text-sm font-bold text-gray-300">Thời gian kích hoạt</div>
            <div className="text-[10px] text-gray-500 font-mono">Xử lý ngay tức thì</div>
          </div>

          <div className="p-5 sm:p-6 bg-[#0A0A0F] border border-white/10 rounded-3xl space-y-1 hover:border-emerald-500/40 hover:shadow-emerald-500/10 transition-all group">
            <div className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-mono tracking-tight group-hover:scale-105 transition-transform origin-left">
              99.8%
            </div>
            <div className="text-xs sm:text-sm font-bold text-gray-300">Tỷ lệ hoàn thành</div>
            <div className="text-[10px] text-gray-500 font-mono">Cam kết bảo hành 100%</div>
          </div>

        </div>

      </div>
    </section>
  );
};
