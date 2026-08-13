'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, Clock, CheckCircle2, ArrowRight, Zap, Send } from 'lucide-react';

export default function UserDashboardPage() {
  const { user } = useAuth();
  const userName = user?.name.split(' ')[0] || 'Nguyễn';

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-neon-red/20 via-purple-900/20 to-[#0D0D14] border border-neon-red/30 shadow-glass flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Xin chào, {userName}! 👋
          </h1>
          <p className="text-xs text-gray-300 mt-1">
            Chào mừng bạn quay trở lại với trung tâm hỗ trợ & tiếp nhận dịch vụ <span className="text-neon-red font-bold">Nguyên MMO</span>.
          </p>
        </div>
        <Link
          href="/services"
          className="px-5 py-2.5 bg-neon-red hover:bg-neon-red-hover text-white text-xs font-bold rounded-2xl shadow-neon-red hover:scale-105 transition-all flex items-center gap-2 shrink-0"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>Khám phá dịch vụ ngay</span>
        </Link>
      </div>

      {/* 3 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Stat 1: Total Orders */}
        <div className="p-5 bg-[#0D0D14] border border-white/10 rounded-2xl shadow-glass space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Tổng yêu cầu dịch vụ:</span>
            <ShoppingBag className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {user?.totalOrders || 12} Yêu cầu
          </div>
          <div className="text-[10px] text-gray-500">Đã gửi tới hệ thống</div>
        </div>

        {/* Stat 2: Processing Orders */}
        <div className="p-5 bg-[#0D0D14] border border-white/10 rounded-2xl shadow-glass space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Đang liên hệ & xử lý:</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {user?.processingOrders || 2} Đơn
          </div>
          <div className="text-[10px] text-gray-500">Nhân viên đang làm việc</div>
        </div>

        {/* Stat 3: Completed Orders */}
        <div className="p-5 bg-[#0D0D14] border border-white/10 rounded-2xl shadow-glass space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Đã hoàn thành:</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {user?.completedOrders || 10} Đơn
          </div>
          <div className="text-[10px] text-gray-500">Hoàn tất thành công</div>
        </div>
      </div>

      {/* Support Info Box */}
      <div className="p-6 bg-[#0D0D14] border border-sky-500/30 rounded-3xl space-y-4 shadow-glass">
        <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
          <Send className="w-4 h-4" />
          <span>HỖ TRỢ TRỰC TIẾP TỪ KĨ THUẬT VIÊN</span>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">
          Website hoạt động theo mô hình tư vấn & báo giá trực tiếp. Khi bạn đặt dịch vụ, nhân viên hỗ trợ sẽ liên hệ với bạn qua Telegram/Zalo trong giây lát để xác nhận yêu cầu và khởi chạy hệ thống.
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href="https://t.me/nguyenmmo07"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Telegram (@nguyenmmo07)</span>
          </a>

          <a
            href="https://zalo.me/0934811307"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5"
          >
            <span>💬 Zalo (0934811307)</span>
          </a>

          <a
            href="https://www.facebook.com/nguyenads7"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5"
          >
            <span>📘 Facebook (nguyenads7)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
