'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  X, 
  Zap, 
  Gift, 
  ShieldCheck, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink,
  Megaphone,
  Clock,
  ArrowRight,
  Flame
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { defaultAnnouncementData, ServiceAnnouncementData } from '@/data/serviceAnnouncement';

interface ServiceNoticeModalProps {
  customData?: Partial<ServiceAnnouncementData>;
}

export const ServiceNoticeModal: React.FC<ServiceNoticeModalProps> = ({ customData }) => {
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);
  const [data, setData] = useState<ServiceAnnouncementData>(defaultAnnouncementData);

  useEffect(() => {
    if (customData) {
      setData((prev) => ({ ...prev, ...customData }));
    }
  }, [customData]);

  // Check whether to show the popup on mount
  useEffect(() => {
    if (!data.enabled) return;

    const storageKey = `nguyenmmo_notice_hide_${data.id}`;
    const hideUntil = localStorage.getItem(storageKey);

    if (hideUntil && parseInt(hideUntil, 10) > Date.now()) {
      return; // Still in hide period
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, data.autoShowDelayMs || 600);

    return () => clearTimeout(timer);
  }, [data.enabled, data.id, data.autoShowDelayMs]);

  // Global listener to allow manual triggering from anywhere (e.g. Header button)
  useEffect(() => {
    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener('open-service-notice', handleOpenEvent);
    return () => window.removeEventListener('open-service-notice', handleOpenEvent);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (dontShowAgain) {
      const storageKey = `nguyenmmo_notice_hide_${data.id}`;
      // Hide for 24 hours (24 * 60 * 60 * 1000 ms)
      const hideDuration = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem(storageKey, hideDuration.toString());
    }
  }, [dontShowAgain, data.id]);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    showToast(`Đã sao chép mã giảm giá: ${code}`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case 'zap':
        return <Zap className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'gift':
        return <Gift className="w-5 h-5 text-rose-400 shrink-0" />;
      case 'shield':
        return <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-sky-400 shrink-0" />;
      default:
        return <Megaphone className="w-5 h-5 text-neon-red shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto animate-in fade-in duration-300">
      {/* BACKDROP BLUR */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      {/* MODAL CONTAINER (MOBILE BOTTOM SHEET & DESKTOP CENTERED MODAL) */}
      <div className="relative w-full max-w-2xl bg-[#0B0B12]/98 border-t sm:border border-white/15 rounded-t-3xl sm:rounded-3xl shadow-[0_0_60px_rgba(255,30,66,0.25)] backdrop-blur-2xl overflow-hidden transition-all z-10 max-h-[90vh] sm:max-h-[92vh] flex flex-col">
        
        {/* MOBILE DRAG HANDLE */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto my-2 shrink-0 sm:hidden"></div>

        {/* TOP GLOWING LIGHT BAR */}
        <div className="h-1.5 w-full bg-gradient-to-r from-neon-red via-rose-500 to-amber-500 shrink-0" />

        {/* CLOSE BUTTON */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition-all active:scale-95"
          title="Đóng thông báo"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* MODAL BODY WITH CUSTOM SCROLLBAR */}
        <div className="p-4 sm:p-8 space-y-5 sm:space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* HEADER BADGE & TITLE */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-neon-red/15 text-neon-red border border-neon-red/30">
                <Flame className="w-3.5 h-3.5 fill-neon-red animate-pulse" />
                {data.badgeText}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Hệ thống 24/7
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight tracking-tight">
              {data.title}
            </h2>
            
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              {data.subtitle}
            </p>
          </div>

          {/* HIGHLIGHT FEATURES GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.highlights.map((item, idx) => (
              <div 
                key={idx} 
                className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.05] transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:scale-105 transition-transform">
                    {renderIcon(item.icon)}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-neon-red transition-colors">
                        {item.title}
                      </h4>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 leading-normal line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PROMO COUPON BOX (IF EXISTS) */}
          {data.coupon && (
            <div className="relative p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-neon-red/10 to-rose-500/10 border border-amber-500/30 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <Gift className="w-4 h-4" />
                    <span>MÃ ƯU ĐÃI ĐẶC BIỆT</span>
                    {data.coupon.expiryText && (
                      <span className="text-[10px] text-gray-400 font-normal">({data.coupon.expiryText})</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-300">
                    {data.coupon.discountText}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-amber-400/40 text-amber-300 font-mono text-sm font-bold tracking-wider">
                    {data.coupon.code}
                  </div>
                  <button
                    onClick={() => handleCopyCoupon(data.coupon!.code)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Đã copy!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Mã</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ACTION BUTTONS & DON'T SHOW AGAIN OPTION */}
          <div className="space-y-4 pt-2 border-t border-white/10">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href={data.ctaPrimary.link}
                onClick={handleClose}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-neon-red to-rose-600 hover:from-rose-600 hover:to-red-700 text-white font-bold text-sm shadow-xl shadow-neon-red/25 transition-all hover:scale-[1.02] active:scale-98"
              >
                <span>{data.ctaPrimary.text}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {data.ctaSecondary && (
                <a
                  href={data.ctaSecondary.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/15 hover:bg-white/10 hover:border-white/25 text-gray-200 hover:text-white font-semibold text-sm transition-all"
                >
                  <span>{data.ctaSecondary.text}</span>
                  <ExternalLink className="w-4 h-4 text-sky-400" />
                </a>
              )}

              <button
                onClick={handleClose}
                className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-semibold transition-colors"
              >
                Đã hiểu
              </button>
            </div>

            {/* CHECKBOX: DON'T SHOW AGAIN FOR 24H */}
            <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer hover:text-gray-200 select-none">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-neon-red focus:ring-neon-red focus:ring-offset-0 cursor-pointer accent-neon-red"
                />
                <span>Không hiển thị lại thông báo này trong 24h</span>
              </label>

              <div className="flex items-center gap-1 text-[11px] text-gray-500">
                <Clock className="w-3 h-3" />
                <span>Cập nhật mới nhất</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
