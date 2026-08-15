'use client';

import React, { useState } from 'react';
import { Megaphone, Flame, Sparkles, X, ChevronRight } from 'lucide-react';
import { defaultAnnouncementData } from '@/data/serviceAnnouncement';

export const ServiceNoticeBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  if (!isVisible) return null;

  const triggerModal = () => {
    window.dispatchEvent(new Event('open-service-notice'));
  };

  return (
    <div className="relative z-50 w-full bg-gradient-to-r from-neon-red/90 via-rose-600 to-amber-600 text-white py-1.5 px-3 sm:px-6 shadow-md transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm font-medium">
        
        {/* LEFT ICON & LABEL */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1 bg-black/30 backdrop-blur-md text-amber-300 px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wider">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            HOT
          </span>
        </div>

        {/* MIDDLE TEXT / TICKER */}
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-2 truncate cursor-pointer hover:underline" onClick={triggerModal}>
            <span className="font-bold truncate">
              {defaultAnnouncementData.title}
            </span>
            <span className="hidden md:inline text-white/80 text-xs">
              - {defaultAnnouncementData.coupon?.discountText}
            </span>
          </div>
        </div>

        {/* RIGHT BUTTON & CLOSE */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={triggerModal}
            className="flex items-center gap-1 bg-black/40 hover:bg-black/60 text-white font-bold text-xs px-2.5 py-1 rounded-full border border-white/20 transition-all hover:scale-105 active:scale-95"
          >
            <span>Xem Chi Tiết</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsVisible(false)}
            className="p-1 text-white/70 hover:text-white rounded-full hover:bg-black/20 transition-colors"
            title="Tắt thanh thông báo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
