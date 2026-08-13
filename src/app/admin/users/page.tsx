'use client';

import React, { useState } from 'react';
import { Users, Plus, Edit3, ShieldCheck } from 'lucide-react';
import { formatVND } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

export default function AdminUsersPage() {
  const [usersList, setUsersList] = useState([
    { id: 'usr-1', name: 'Nguyễn Văn Tiến', email: 'nguyen.mmo2026@gmail.com', phone: '0988 123 456', balance: 2500000, vipTier: 'pro', totalOrders: 124 },
    { id: 'usr-2', name: 'Trần Thị Thu', email: 'thu.ai@gmail.com', phone: '0977 888 999', balance: 1800000, vipTier: 'basic', totalOrders: 45 },
    { id: 'usr-3', name: 'Đức Anh MMO', email: 'ducanh@gmail.com', phone: '0912 345 678', balance: 5400000, vipTier: 'business', totalOrders: 310 },
  ]);

  const { showToast } = useToast();

  const handleAdjustBalance = (userId: string) => {
    const amountStr = prompt('Nhập số tiền muốn cộng/trừ vào ví user (VD: 500000 hoặc -100000):');
    if (!amountStr) return;
    const amount = Number(amountStr);
    setUsersList(usersList.map((u) => (u.id === userId ? { ...u, balance: u.balance + amount } : u)));
    showToast('Đã cập nhật số dư tài khoản thành công!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/10">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-neon-red" />
          <span>QUẢN LÝ KHÁCH HÀNG & CỘNG SỐ DƯ VÍ</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Quản lý tài khoản người dùng, cấp bậc VIP và điều chỉnh ví tiền thủ công.
        </p>
      </div>

      <div className="bg-[#0D0D14] border border-white/10 rounded-3xl overflow-hidden shadow-glass">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#0E0E16] text-gray-400 uppercase text-[10px] tracking-wider border-b border-white/10 font-bold">
              <tr>
                <th className="p-4 text-center min-w-[130px]">Thao tác</th>
                <th className="p-4 min-w-[180px]">Khách hàng</th>
                <th className="p-4 min-w-[200px]">Liên hệ</th>
                <th className="p-4 text-center min-w-[110px]">Cấp VIP</th>
                <th className="p-4 text-right min-w-[120px]">Số dư Ví</th>
                <th className="p-4 pr-6 text-center min-w-[100px]">Tổng đơn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition-all group">
                  
                  {/* THAO TÁC CỘT ĐẦU TIÊN (NO SCROLL NEEDED) */}
                  <td className="p-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => handleAdjustBalance(u.id)}
                      className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30 text-blue-300 hover:text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition-all hover:scale-105"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>± Ví tiền</span>
                    </button>
                  </td>

                  <td className="p-4 font-bold text-white cursor-pointer" onClick={() => handleAdjustBalance(u.id)}>
                    {u.name}
                  </td>

                  <td className="p-4 text-gray-400">
                    <div className="text-white font-medium">{u.email}</div>
                    <div className="text-[11px] font-mono text-emerald-400">{u.phone}</div>
                  </td>

                  <td className="p-4 text-center whitespace-nowrap">
                    <span className="px-2.5 py-1 bg-gold-500/20 text-gold-400 font-bold text-[10px] rounded-full uppercase font-mono border border-gold-500/30">
                      VIP {u.vipTier}
                    </span>
                  </td>

                  <td className="p-4 text-right font-mono font-bold text-emerald-400 text-sm whitespace-nowrap">
                    {formatVND(u.balance)}
                  </td>

                  <td className="p-4 pr-6 text-center font-mono font-bold whitespace-nowrap">
                    {u.totalOrders}
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
