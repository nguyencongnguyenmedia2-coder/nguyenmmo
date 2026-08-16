'use client';

import React, { useState } from 'react';
import { X, Sparkles, Coffee, Copy, Check, Heart, ShieldCheck, Share2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface CoffeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CoffeeModal: React.FC<CoffeeModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [copiedAccount, setCopiedAccount] = useState(false);

  if (!isOpen) return null;

  const accountNumber = '7986868686';

  const handleCopyAccount = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(accountNumber);
      setCopiedAccount(true);
      showToast('Đã sao chép số tài khoản MBV: 7986 8686 86', 'success');
      setTimeout(() => setCopiedAccount(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Container Card (Soft Pink Pastel & White Cream Gradient Card) */}
      <div className="relative w-full max-w-sm sm:max-w-md my-auto rounded-[32px] overflow-hidden bg-gradient-to-b from-[#FFF5F8] via-[#FFEBF1] to-[#FFF0F4] dark:from-[#1E1217] dark:via-[#26151E] dark:to-[#180E13] border border-pink-200/50 dark:border-pink-500/20 shadow-[0_20px_60px_rgba(255,50,100,0.25)] text-gray-800 dark:text-gray-100 transition-all">
        
        {/* Decorative background sparkles & floating blurs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-pink-400/20 dark:bg-pink-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-amber-300/20 dark:bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        {/* Floating Sparkle Icons */}
        <Sparkles className="absolute top-6 left-6 w-4 h-4 text-pink-400 animate-pulse pointer-events-none" />
        <Sparkles className="absolute top-12 right-10 w-3 h-3 text-amber-400 animate-ping pointer-events-none" />
        <Coffee className="absolute bottom-6 right-6 w-5 h-5 text-pink-400/30 dark:text-pink-400/20 rotate-12 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/70 dark:bg-black/40 hover:bg-white dark:hover:bg-black/70 border border-pink-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-pink-600 transition-all shadow-sm"
          title="Đóng modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Card Body */}
        <div className="relative z-10 p-5 sm:p-7 space-y-5 text-center">
          
          {/* Header Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-500/10 dark:bg-pink-500/20 border border-pink-500/30 text-pink-600 dark:text-pink-400 font-bold text-[11px] uppercase tracking-wider shadow-sm">
            <Coffee className="w-3.5 h-3.5 text-pink-500 animate-bounce" />
            <span>Mời 1 Ly Cafe ☕ • NGUYENMMO</span>
          </div>

          {/* Main Titles */}
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
              <span>☕ NGUYENMMO</span>
            </h2>
            <div className="text-lg sm:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500">
              MỜI LY CAFE
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 max-w-xs mx-auto leading-relaxed pt-1 font-medium">
              “Một ly cafe – một chút động lực để NGUYENMMO tiếp tục chia sẻ những điều hữu ích ❤️”
            </p>
          </div>

          {/* Main White Center Card containing QR Code */}
          <div className="bg-white dark:bg-[#150D11] border border-pink-100 dark:border-pink-500/20 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
            
            {/* Avatar Header */}
            <div className="flex justify-center -mt-8 sm:-mt-9">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-rose-400 to-amber-400 shadow-md">
                <img
                  src="/images/coffee-qr-nguyenmmo.png"
                  alt="NGUYENMMO Avatar"
                  className="w-full h-full object-cover rounded-full bg-white"
                />
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
              Quét mã QR để mời NGUYENMMO một ly cafe ☕
            </div>

            {/* QR Code Image Container */}
            <div className="relative mx-auto w-full max-w-[250px] sm:max-w-[270px] aspect-[4/5] rounded-2xl overflow-hidden border border-gray-200 dark:border-pink-500/30 bg-white p-2 shadow-inner">
              <img
                src="/images/coffee-qr-nguyenmmo.png"
                alt="Mã QR Thanh Toán Mời Cafe NGUYENMMO"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>

            {/* Bank Info Details Box */}
            <div className="bg-pink-50/70 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900/50 rounded-2xl p-3 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Ngân hàng:</span>
                <span className="font-bold text-pink-600 dark:text-pink-400 font-mono">MBV (MB Bank)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Số tài khoản:</span>
                <div className="flex items-center gap-1.5 font-bold font-mono text-gray-900 dark:text-white text-sm">
                  <span>7986 8686 86</span>
                  <button
                    onClick={handleCopyAccount}
                    className="p-1 hover:bg-pink-200/50 dark:hover:bg-pink-800/40 rounded-lg text-pink-600 dark:text-pink-400 transition-colors"
                    title="Sao chép STK"
                  >
                    {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-pink-100 dark:border-pink-900/40">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Chủ tài khoản:</span>
                <span className="font-extrabold text-gray-900 dark:text-white font-mono uppercase">NGUYEN CONG NGUYEN</span>
              </div>
            </div>

          </div>

          {/* Bottom Thank You CTA Footer */}
          <div className="space-y-2 pt-1">
            <div className="inline-flex items-center gap-1 text-xs font-black text-rose-600 dark:text-rose-400">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
              <span>CẢM ƠN BẠN ĐÃ MỜI NGUYENMMO MỘT LY CAFE ❤️</span>
            </div>
            
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium italic">
              Một ly cafe nhỏ – một động lực thật lớn!
            </p>

            <div className="pt-2 text-[10px] font-mono text-gray-400 dark:text-gray-500 tracking-wider">
              NGUYENMMO • MMO • AI • DIGITAL • SHARING
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
