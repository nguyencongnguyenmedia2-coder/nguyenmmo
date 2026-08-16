'use client';

import React from 'react';
import Link from 'next/link';
import { Rocket, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';

export const CtaSection: React.FC = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* SaaS Large Glass Card Block */}
        <div className="relative border-beam-always p-8 sm:p-14 overflow-hidden rounded-[36px] bg-gradient-to-r from-[#0F0F1A] via-[#140C1A] to-[#0F0F1A] text-center space-y-6 shadow-2xl">
          
          {/* Subtle Glow Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-red/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-red/10 border border-neon-red/30 text-neon-red font-bold text-xs uppercase tracking-wider shadow-neon-red">
              <Sparkles className="w-4 h-4" />
              <span>NÂNG TẦM KINH DOANH SỐ</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              SẴN SÀNG BỨT PHÁ <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-red via-rose-500 to-amber-400">
                KÊNH DIGITAL CỦA BẠN?
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed font-medium">
              Tự động hóa công việc. Tối ưu chi phí. Tăng tốc tăng trưởng cùng NGUYÊN MMO.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/services"
                className="px-8 py-4 bg-neon-red hover:bg-neon-red-hover text-white text-sm font-black rounded-2xl btn-beam-touch hover:scale-105 transition-all shadow-neon-red flex items-center justify-center gap-2 overflow-hidden"
              >
                <Rocket className="w-4 h-4 fill-white" />
                <span>🚀 BẮT ĐẦU NGAY</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="https://t.me/nguyenmmo07"
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/15 text-white text-sm font-bold rounded-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-sky-400" />
                <span>💬 CHAT TƯ VẤN</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
