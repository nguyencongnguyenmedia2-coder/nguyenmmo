'use client';

import React, { useState } from 'react';
import { Users, Plus, Edit3, ShieldCheck } from 'lucide-react';
import { formatVND } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

export default function AdminUsersPage() {
  const [usersList, setUsersList] = useState<any[]>([]);

  const fetchUsers = async () => {
    let combined: any[] = [];

    // 1. Fetch from Server API /api/users
    try {
      const res = await fetch('/api/users?t=' + Date.now());
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        combined.push(...json.data);
      }
    } catch (e) {}

    // 2. Merge with LocalStorage backup
    try {
      const rawList = localStorage.getItem('digital_mmo_users_list');
      if (rawList) {
        const parsed = JSON.parse(rawList);
        if (Array.isArray(parsed)) {
          const emails = new Set(combined.map((u) => u.email.toLowerCase()));
          parsed.forEach((p) => {
            if (!emails.has(p.email.toLowerCase())) {
              combined.push(p);
            }
          });
        }
      }
    } catch (e) {}

    setUsersList(combined);
  };

  React.useEffect(() => {
    fetchUsers();
    const interval = setInterval(() => {
      fetchUsers();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const { showToast } = useToast();

  const handleAdjustBalance = async (userId: string) => {
    const amountStr = prompt('Nhập số tiền muốn cộng/trừ vào ví user (VD: 500000 hoặc -100000):');
    if (!amountStr) return;
    const amount = Number(amountStr);
    const target = usersList.find((u) => u.id === userId);
    const newBal = (target?.balance || 0) + amount;

    const updated = usersList.map((u) => (u.id === userId ? { ...u, balance: newBal } : u));
    setUsersList(updated);

    try {
      localStorage.setItem('digital_mmo_users_list', JSON.stringify(updated));
    } catch (e) {}

    try {
      await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, balance: newBal }),
      });
    } catch (e) {}

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
              {usersList.length > 0 ? (
                usersList.map((u) => (
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
                      {u.name || u.username}
                    </td>

                    <td className="p-4 text-gray-400">
                      <div className="text-white font-medium">{u.email}</div>
                      <div className="text-[11px] font-mono text-emerald-400">{u.phone || 'Chưa cập nhật'}</div>
                    </td>

                    <td className="p-4 text-center whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-gold-500/20 text-gold-400 font-bold text-[10px] rounded-full uppercase font-mono border border-gold-500/30">
                        VIP {u.vipTier || 'free'}
                      </span>
                    </td>

                    <td className="p-4 text-right font-mono font-bold text-emerald-400 text-sm whitespace-nowrap">
                      {formatVND(u.balance || 0)}
                    </td>

                    <td className="p-4 pr-6 text-center font-mono font-bold whitespace-nowrap">
                      {u.totalOrders || 0}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400 font-bold">
                    Chưa có tài khoản khách hàng nào đăng ký trên hệ thống.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
