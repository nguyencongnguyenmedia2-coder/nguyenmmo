'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Send, MessageCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const CtaSection: React.FC = () => {
  return (
    <section className="py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative border-beam-always p-8 sm:p-12 overflow-hidden bg-gradient-to-r from-[#0D0D16] via-[#120B16] to-[#0D0D16]">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Content (8 cols) */}
            <div className="lg:col-span-8 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/15 text-neon-red font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>BẮT ĐẦU TRẢI NGHIỆM TỰ ĐỘNG HÓA NGAY HÔM NAY</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                SẴN SÀNG BỨT PHÁ KÊNH <span className="text-neon-red">DIGITAL MMO</span> CỦA BẠN?
              </h2>

              <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
                Khám phá kho dịch vụ mạng xã hội, công cụ AI và phần mềm chất lượng cao. Đội ngũ kĩ thuật viên luôn sẵn sàng tư vấn giải pháp 1-1 miễn phí 24/7.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-emerald-400 font-mono">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Bảo hành uy tín 100%
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-neon-red fill-neon-red" /> Khởi chạy tự động 24/7
                </span>
              </div>
            </div>

            {/* Right Action Buttons (4 cols) */}
            <div className="lg:col-span-4 space-y-3">
              <Link
                href="/services"
                className="w-full py-4 bg-neon-red hover:bg-neon-red-hover text-white text-sm font-black rounded-2xl btn-beam-touch hover:scale-105 transition-transform flex items-center justify-center gap-2 overflow-hidden"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>KHÁM PHÁ DỊCH VỤ NGAY</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://t.me/nguyenmmo07"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Telegram</span>
                </a>

                <a
                  href="https://zalo.me/0934811307"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Zalo Chat</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
