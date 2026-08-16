'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X, Send, PhoneCall, Facebook, Mail, Sparkles, Coffee } from 'lucide-react';
import { CoffeeModal } from '@/components/ui/CoffeeModal';

export const ChatWidget: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [isCoffeeModalOpen, setIsCoffeeModalOpen] = useState(false);

  // Hide widget in admin dashboard to prevent cluttering admin controls
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // Adjust bottom distance on pages with sticky bottom purchase bars (e.g., service detail page)
  const isServiceDetailPage = pathname?.startsWith('/service/');
  const isCheckoutPage = pathname?.startsWith('/checkout');
  const hasStickyBar = isServiceDetailPage || isCheckoutPage;

  const mobileBottomClass = hasStickyBar ? 'bottom-[125px]' : 'bottom-[72px]';

  return (
    <>
      <div className={`fixed ${mobileBottomClass} md:bottom-6 right-3 sm:right-6 z-40 flex flex-col items-end gap-2.5 transition-all duration-300`}>
        
        {/* Floating Welcome Bubble */}
        {showTooltip && !isOpen && (
          <div className="mb-1 px-3.5 py-2 bg-[#0F0F18]/95 backdrop-blur-md border border-neon-red/40 rounded-2xl shadow-2xl text-[11px] sm:text-xs text-white flex items-center gap-2 animate-bounce max-w-[240px] sm:max-w-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">Xin chào! Bạn cần hỗ trợ gì?</span>
            <button
              onClick={() => setShowTooltip(false)}
              className="ml-auto text-gray-400 hover:text-white p-0.5"
              title="Đóng thông báo"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Floating Support Modal Window (Pure Support Channels) */}
        {isOpen && (
          <div className="mb-2 w-[290px] sm:w-80 bg-[#0D0D14]/95 backdrop-blur-xl border border-white/15 rounded-3xl shadow-2xl p-4 sm:p-5 text-white animate-in fade-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-neon-red flex items-center justify-center font-bold text-white shadow-neon-red">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm">Hỗ Trợ Khách Hàng</div>
                  <div className="text-[10px] sm:text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Trực tuyến 24/7 (Phản hồi &lt; 2 phút)
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 space-y-2 text-xs">
              <a
                href="https://t.me/nguyenmmo07"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 font-bold transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs">Telegram: @nguyenmmo07</span>
                </div>
                <span className="text-[9px] sm:text-[10px] bg-sky-500/20 px-2 py-0.5 rounded-full font-mono">⚡ Nhanh nhất</span>
              </a>

              <a
                href="https://zalo.me/0934811307"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 font-bold transition-all group"
              >
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs">Zalo: 0934811307</span>
                </div>
                <span className="text-[9px] sm:text-[10px] bg-blue-500/20 px-2 py-0.5 rounded-full">24/7</span>
              </a>

              <a
                href="https://www.facebook.com/nguyenads7"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Facebook className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs">FB: nguyenads7</span>
                </div>
                <span className="text-[9px] sm:text-[10px] bg-indigo-500/20 px-2 py-0.5 rounded-full">Admin</span>
              </a>

              <a
                href="mailto:support@digitalmmo.com"
                className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium transition-all"
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-neon-red" />
                  <span className="text-xs">Gửi Email Hỗ Trợ</span>
                </div>
              </a>
            </div>

            <div className="pt-1 text-center text-[10px] text-gray-400">
              Hỗ trợ tư vấn giải pháp MMO & bảo hành đơn hàng 24/7
            </div>
          </div>
        )}

        {/* ☕ SEPARATE STANDALONE FLOATING BUY ME A COFFEE BUTTON (OUTSIDE OF SUPPORT POPUP) */}
        <button
          onClick={() => setIsCoffeeModalOpen(true)}
          className="group relative p-3 sm:px-4 sm:py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-[0_8px_25px_rgba(255,50,120,0.4)] flex items-center gap-2 hover:scale-105 active:scale-95 transition-all border border-white/30"
          aria-label="Mời NGUYENMMO Ly Cafe"
        >
          <Coffee className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white animate-bounce shrink-0" />
          <span className="hidden sm:inline font-black tracking-wide drop-shadow-sm">☕ Mời Ly Cafe</span>
          <span className="sm:hidden text-xs font-black pr-0.5">☕ Mời Cafe</span>
        </button>

        {/* 💬 MAIN FLOATING SUPPORT TRIGGER BUTTON */}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setShowTooltip(false);
          }}
          className="group relative p-3 sm:px-4 sm:py-3 rounded-full bg-neon-red hover:bg-neon-red-hover text-white font-bold text-xs sm:text-sm shadow-neon-red flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
          aria-label="Hỗ trợ khách hàng"
        >
          <MessageCircle className="w-5 h-5 fill-white animate-pulse" />
          <span className="hidden sm:inline">💬 Hỗ trợ</span>
          <span className="sm:hidden text-xs font-black pr-1">Hỗ trợ</span>
        </button>
      </div>

      {/* Coffee Modal Poster Component */}
      <CoffeeModal
        isOpen={isCoffeeModalOpen}
        onClose={() => setIsCoffeeModalOpen(false)}
      />
    </>
  );
};
