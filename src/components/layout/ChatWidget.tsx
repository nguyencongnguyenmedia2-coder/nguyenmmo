'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Send, PhoneCall, Facebook, Mail, Sparkles } from 'lucide-react';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Welcome Bubble */}
      {showTooltip && !isOpen && (
        <div className="mb-3 px-4 py-2.5 bg-[#0F0F18] border border-neon-red/40 rounded-2xl shadow-2xl text-xs text-white flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span>Xin chào! Bạn cần hỗ trợ gì?</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="ml-2 text-gray-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Support Modal Window */}
      {isOpen && (
        <div className="mb-4 w-72 sm:w-80 bg-[#0D0D14] border border-white/15 rounded-3xl shadow-2xl p-5 text-white animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-neon-red flex items-center justify-center font-bold text-white shadow-neon-red">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-sm">Hỗ Trợ Khách Hàng</div>
                <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Trực tuyến 24/7 (Phản hồi &lt; 2 phút)
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-4 space-y-2.5 text-xs">
            <a
              href="https://t.me/nguyenmmo07"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 font-bold transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Send className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                <span>Telegram: @nguyenmmo07</span>
              </div>
              <span className="text-[10px] bg-sky-500/20 px-2 py-0.5 rounded-full">⚡ Nhanh nhất</span>
            </a>

            <a
              href="https://zalo.me/0934811307"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 font-bold transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                <span>Zalo: 0934811307</span>
              </div>
              <span className="text-[10px] bg-blue-500/20 px-2 py-0.5 rounded-full">24/7</span>
            </a>

            <a
              href="https://www.facebook.com/nguyenads7"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Facebook className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span>FB: nguyenads7</span>
              </div>
              <span className="text-[10px] bg-indigo-500/20 px-2 py-0.5 rounded-full">Admin</span>
            </a>

            <a
              href="mailto:support@digitalmmo.com"
              className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-neon-red" />
                <span>Gửi Email Hỗ Trợ</span>
              </div>
            </a>
          </div>

          <div className="pt-2 text-center text-[10px] text-gray-400">
            Hỗ trợ tư vấn giải pháp MMO & bảo hành đơn hàng 24/7
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
        className="px-4 py-3 rounded-full bg-neon-red hover:bg-neon-red-hover text-white font-bold text-sm shadow-neon-red flex items-center gap-2 hover:scale-105 transition-all"
      >
        <MessageCircle className="w-5 h-5 fill-white" />
        <span>💬 Hỗ trợ</span>
      </button>
    </div>
  );
};
