'use client';

import React, { useState } from 'react';
import { Flame, ChevronRight, X } from 'lucide-react';
import { defaultAnnouncementData } from '@/data/serviceAnnouncement';

export const ServiceNoticeBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  if (!isVisible) return null;

  const triggerModal = () => {
    window.dispatchEvent(new Event('open-service-notice'));
  };

  return (
    <div className="relative z-50 w-full bg-gradient-to-r from-neon-red/95 via-rose-600 to-amber-600 text-white py-1.5 px-2.5 sm:px-6 shadow-md transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3 text-xs sm:text-sm font-medium">
        
        {/* LEFT ICON & LABEL */}
        <div className="flex items-center gap-1.5 shrink-0 cursor-pointer" onClick={triggerModal}>
          <span className="flex items-center gap-1 bg-black/30 backdrop-blur-md text-amber-300 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black tracking-wider">
            <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            <span>HOT</span>
          </span>
        </div>

        {/* MIDDLE TEXT / TICKER */}
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-1.5 truncate cursor-pointer hover:underline" onClick={triggerModal}>
            <span className="font-bold truncate text-[11px] sm:text-xs">
              {defaultAnnouncementData.title}
            </span>
            <span className="hidden md:inline text-white/80 text-xs font-mono">
              - {defaultAnnouncementData.coupon?.discountText}
            </span>
          </div>
        </div>

        {/* RIGHT BUTTON & CLOSE */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={triggerModal}
            className="flex items-center gap-1 bg-black/40 hover:bg-black/60 text-white font-bold text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-white/20 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <span>Chi Tiết</span>
            <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>

          <button
            onClick={() => setIsVisible(false)}
            className="p-1 text-white/80 hover:text-white rounded-full hover:bg-black/20 transition-colors"
            title="Tắt thanh thông báo"
            aria-label="Tắt thông báo"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
