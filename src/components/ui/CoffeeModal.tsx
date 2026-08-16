'use client';

import React, { useState } from 'react';
import { X, Sparkles, Coffee, Copy, Check, Heart, QrCode } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Container Card */}
      <div className="relative w-full max-w-[340px] xs:max-w-sm sm:max-w-md my-auto max-h-[92vh] overflow-y-auto custom-scrollbar rounded-[32px] sm:rounded-[36px] bg-gradient-to-b from-[#FFF5F8] via-[#FFEBF1] to-[#FFF0F4] dark:from-[#1E1217] dark:via-[#26151E] dark:to-[#180E13] border border-pink-200/60 dark:border-pink-500/30 shadow-[0_25px_70px_rgba(255,50,100,0.3)] text-gray-800 dark:text-gray-100 transition-all">
        
        {/* Decorative background sparkles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-pink-400/20 dark:bg-pink-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-amber-300/20 dark:bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <Sparkles className="absolute top-5 left-5 w-4 h-4 text-pink-400 animate-pulse pointer-events-none" />
        <Sparkles className="absolute top-10 right-12 w-3 h-3 text-amber-400 animate-ping pointer-events-none" />
        <Coffee className="absolute bottom-5 right-5 w-5 h-5 text-pink-400/25 dark:text-pink-400/15 rotate-12 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/80 border border-pink-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-pink-600 transition-all shadow-md active:scale-95"
          title="Đóng modal"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Card Body */}
        <div className="relative z-10 p-4 sm:p-6 space-y-3.5 text-center">
          
          {/* Header Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 dark:bg-pink-500/20 border border-pink-500/30 text-pink-600 dark:text-pink-400 font-bold text-[10px] sm:text-[11px] uppercase tracking-wider shadow-sm">
            <Coffee className="w-3.5 h-3.5 text-pink-500 animate-bounce" />
            <span>Mời 1 Ly Cafe ☕ • NGUYENMMO</span>
          </div>

          {/* Main Titles */}
          <div className="space-y-0.5">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center justify-center gap-1.5">
              <span>☕ NGUYENMMO</span>
            </h2>
            <div className="text-base sm:text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500">
              MỜI LY CAFE
            </div>
            <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-300 max-w-[260px] sm:max-w-xs mx-auto leading-relaxed font-medium">
              “Một ly cafe – một chút động lực để NGUYENMMO tiếp tục chia sẻ những điều hữu ích ❤️”
            </p>
          </div>

          {/* Main White Card containing QR Code */}
          <div className="bg-white dark:bg-[#150D11] border border-pink-100 dark:border-pink-500/20 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xl space-y-3">
            
            <div className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-300 font-bold flex items-center justify-center gap-1.5 pt-1">
              <QrCode className="w-3.5 h-3.5 text-pink-500" />
              <span>Quét mã QR để mời NGUYENMMO một ly cafe ☕</span>
            </div>

            {/* Clean QR Code Display - Responsive sizing */}
            <div className="relative mx-auto w-full max-w-[200px] sm:max-w-[240px] rounded-2xl overflow-hidden border border-pink-200/80 dark:border-pink-500/30 bg-white p-2 shadow-md">
              <img
                src="/images/qr-clean-code.png"
                alt="Mã QR Thanh Toán VietQR MBV NGUYEN CONG NGUYEN"
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>

            {/* Bank Info Details Box */}
            <div className="bg-pink-50/80 dark:bg-pink-950/40 border border-pink-100 dark:border-pink-900/50 rounded-xl p-2.5 sm:p-3 text-left space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400 font-medium text-[11px] sm:text-xs">Ngân hàng:</span>
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 bg-red-500 text-white font-black rounded text-[9px] uppercase font-mono">MBV</span>
                  <span className="font-bold text-pink-600 dark:text-pink-400 font-mono text-[11px] sm:text-xs">MB Bank</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400 font-medium text-[11px] sm:text-xs">Số tài khoản:</span>
                <div className="flex items-center gap-1.5 font-bold font-mono text-gray-900 dark:text-white text-xs sm:text-sm">
                  <span className="text-rose-600 dark:text-rose-400 font-extrabold tracking-wider">7986 8686 86</span>
                  <button
                    onClick={handleCopyAccount}
                    className="p-1 hover:bg-pink-200/50 dark:hover:bg-pink-800/40 rounded-lg text-pink-600 dark:text-pink-400 transition-colors active:scale-90"
                    title="Sao chép STK"
                  >
                    {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-pink-100 dark:border-pink-900/40">
                <span className="text-gray-500 dark:text-gray-400 font-medium text-[11px] sm:text-xs">Chủ tài khoản:</span>
                <span className="font-extrabold text-gray-900 dark:text-white font-mono uppercase text-[11px] sm:text-xs">NGUYEN CONG NGUYEN</span>
              </div>
            </div>

          </div>

          {/* Bottom Thank You CTA Footer */}
          <div className="space-y-1 pt-0.5">
            <div className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-black text-rose-600 dark:text-rose-400">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
              <span>CẢM ƠN BẠN ĐÃ MỜI NGUYENMMO MỘT LY CAFE ❤️</span>
            </div>
            
            <p className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 font-medium italic">
              Một ly cafe nhỏ – một động lực thật lớn!
            </p>

            <div className="pt-1 text-[9px] sm:text-[10px] font-mono text-gray-400 dark:text-gray-500 tracking-wider">
              NGUYENMMO • MMO • AI • DIGITAL • SHARING
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
