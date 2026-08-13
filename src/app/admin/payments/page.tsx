'use client';

import React from 'react';
import { CreditCard } from 'lucide-react';
import { formatVND } from '@/lib/utils';

export default function AdminPaymentsPage() {
  const payments = [
    { id: '1', txCode: 'TX928410', user: 'Nguyễn Văn Tiến', amount: 1000000, method: 'VietQR Techcombank', status: 'success', time: '2026-08-12 14:30' },
    { id: '2', txCode: 'TX928409', user: 'Trần Thị Thu', amount: 500000, method: 'MoMo Auto', status: 'success', time: '2026-08-12 11:15' },
    { id: '3', txCode: 'TX928408', user: 'Đức Anh MMO', amount: 2000000, method: 'Chuyển khoản MB', status: 'success', time: '2026-08-11 18:00' },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/10">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-neon-red" />
          <span>LỊCH SỬ GIAO DỊCH NẠP TIỀN</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Nhật ký giao dịch chuyển khoản VietQR, MoMo và ngân hàng tự động.
        </p>
      </div>

      <div className="bg-[#0D0D14] border border-white/10 rounded-3xl overflow-hidden shadow-glass">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-white/5 text-gray-400 uppercase text-[10px] tracking-wider border-b border-white/10 font-mono">
              <tr>
                <th className="p-4">Mã GD</th>
                <th className="p-4">Khách hàng</th>
                <th className="p-4 text-right">Số tiền nạp</th>
                <th className="p-4">Phương thức</th>
                <th className="p-4">Thời gian</th>
                <th className="p-4 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-all">
                  <td className="p-4 font-bold text-neon-red font-mono">#{p.txCode}</td>
                  <td className="p-4 font-bold text-white">{p.user}</td>
                  <td className="p-4 text-right font-mono font-bold text-emerald-400">+{formatVND(p.amount)}</td>
                  <td className="p-4 text-gray-300">{p.method}</td>
                  <td className="p-4 text-gray-400 font-mono">{p.time}</td>
                  <td className="p-4 text-center">
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-[10px] rounded-full font-mono">
                      Thành công
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
