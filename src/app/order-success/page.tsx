'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Clock, Send, MessageCircle, Info } from 'lucide-react';
import { formatVND } from '@/lib/utils';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const requestCode = searchParams.get('code') || searchParams.get('req') || 'REQ-82941';
  const serviceName = searchParams.get('service') || 'Tăng Quan Tâm / Follow Zalo Official Account';
  const quantity = searchParams.get('qty') || '5000';
  const estimatedPrice = searchParams.get('price') || '1200000';
  const customerName = searchParams.get('name') || 'Khách hàng';
  const customerPhone = searchParams.get('phone') || '';

  // Prepared Messenger Text matching spec 13
  const messengerText = encodeURIComponent(
    `Xin chào, tôi muốn đặt dịch vụ.\nMã yêu cầu: #${requestCode}\nDịch vụ: ${serviceName}\nSố lượng: ${Number(quantity).toLocaleString()}\nDự kiến: ${formatVND(Number(estimatedPrice))}\nTên: ${customerName}${customerPhone ? `\nSĐT: ${customerPhone}` : ''}`
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-8">
      
      {/* Animated Success Badge */}
      <div className="relative inline-flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.5)] animate-pulse">
          <CheckCircle2 className="w-12 h-12 text-emerald-400" />
        </div>
      </div>

      {/* Success Title matching spec 15 */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          🎉 ĐÃ GỬI YÊU CẦU THÀNH CÔNG!
        </h1>
        <p className="text-gray-300 text-sm max-w-md mx-auto leading-relaxed">
          Chúng tôi đã nhận được yêu cầu dịch vụ từ bạn. Nhân viên tư vấn của <span className="text-neon-red font-bold">Nguyên MMO</span> sẽ liên hệ để xác nhận thông tin và báo giá chi tiết trong giây lát!
        </p>
      </div>

      {/* Request Details Receipt Card matching spec 15 */}
      <div className="p-6 bg-[#0D0D14] border border-neon-red/40 rounded-3xl text-left space-y-4 shadow-neon-red max-w-lg mx-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="text-xs text-gray-400 font-bold">Mã yêu cầu (Request ID):</div>
          <div className="text-lg font-black text-neon-red font-mono bg-neon-red/10 px-3 py-1 rounded-xl border border-neon-red/30">
            #{requestCode}
          </div>
        </div>

        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="text-xs text-gray-400 font-bold">Trạng thái yêu cầu:</div>
          <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            🟡 CHỜ NHÂN VIÊN LIÊN HỆ
          </div>
        </div>

        <div className="space-y-2 text-xs text-gray-300 pt-1">
          <div className="flex justify-between">
            <span className="text-gray-400">Dịch vụ yêu cầu:</span>
            <span className="font-bold text-white text-right max-w-xs">{serviceName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Số lượng đặt:</span>
            <span className="font-bold text-white font-mono">{Number(quantity).toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t border-white/5 pt-2">
            <span className="text-gray-400">Giá dự kiến:</span>
            <span className="font-extrabold text-neon-red text-base font-mono">{formatVND(Number(estimatedPrice))}</span>
          </div>
        </div>

        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-[11px] text-gray-300 space-y-1">
          <div className="font-bold text-white flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-neon-red" />
            <span>Lưu ý quan trọng:</span>
          </div>
          <p className="text-gray-400 leading-snug">
            Website hoạt động theo mô hình tiếp nhận yêu cầu & tư vấn trực tiếp. Bạn không phải thực hiện bất kỳ giao dịch thanh toán trực tuyến nào trên website.
          </p>
        </div>
      </div>

      {/* ACTION CTA BUTTONS matching spec 13 & 15 */}
      <div className="max-w-lg mx-auto space-y-3 pt-2">
        <a
          href="https://t.me/nguyenmmo07"
          target="_blank"
          rel="noreferrer"
          className="w-full py-3.5 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4 fill-white" />
          <span>✈️ CHAT TELEGRAM SUPPORT (@nguyenmmo07)</span>
        </a>

        <a
          href="https://zalo.me/0934811307"
          target="_blank"
          rel="noreferrer"
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>💬 CHAT ZALO HOTLINE (0934811307)</span>
        </a>

        <a
          href="https://www.facebook.com/nguyenads7"
          target="_blank"
          rel="noreferrer"
          className="w-full py-3 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold text-xs rounded-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
        >
          <span>📘 CHAT FACEBOOK ADMIN (nguyenads7)</span>
        </a>

        <Link
          href="/services"
          className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-1.5"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>← TIẾP TỤC XEM CÁC DỊCH VỤ KHÁC</span>
        </Link>
      </div>

    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-white">Đang tải...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
