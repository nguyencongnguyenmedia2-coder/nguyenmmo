'use client';

import React from 'react';
import Link from 'next/link';
import { Info, ArrowRight, Zap, Send } from 'lucide-react';

export default function WalletPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 space-y-6 text-center">
      <div className="p-8 bg-[#0D0D14] border border-sky-500/40 rounded-3xl space-y-4 shadow-glass">
        <div className="w-16 h-16 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 mx-auto">
          <Info className="w-8 h-8" />
        </div>

        <h1 className="text-xl font-black text-white">
          THÔNG BÁO VỀ NẠP TIỀN TÀI KHOẢN
        </h1>

        <p className="text-xs text-gray-300 leading-relaxed max-w-md mx-auto">
          Hệ thống <span className="text-neon-red font-bold">Nguyên MMO</span> đã chuyển sang mô hình tiếp nhận yêu cầu dịch vụ & tư vấn trực tiếp. Bạn <span className="text-white font-bold">không cần nạp tiền vào tài khoản</span>. Nhân viên kĩ thuật sẽ xác nhận đơn và báo giá qua Telegram/Zalo sau khi bạn đặt dịch vụ.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/services"
            className="w-full sm:w-auto px-6 py-3 bg-neon-red hover:bg-neon-red-hover text-white text-xs font-bold rounded-2xl shadow-neon-red hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>XEM DANH SÁCH DỊCH VỤ</span>
          </Link>

          <a
            href="https://t.me/nguyenmmo07"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-6 py-3 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-xs font-bold rounded-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>CHAT TELEGRAM HỖ TRỢ</span>
          </a>
        </div>
      </div>
    </div>
  );
}
