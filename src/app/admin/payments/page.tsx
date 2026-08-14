'use client';

import React from 'react';
import { CreditCard } from 'lucide-react';
import { formatVND } from '@/lib/utils';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = React.useState<any[]>([]);

  React.useEffect(() => {
    try {
      const rawTx = localStorage.getItem('digital_mmo_transactions');
      if (rawTx) {
        const parsed = JSON.parse(rawTx);
        if (Array.isArray(parsed)) {
          setPayments(parsed);
        }
      }
    } catch (e) {}
  }, []);

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
                <th className="p-4">Mô tả / Phương thức</th>
                <th className="p-4">Thời gian</th>
                <th className="p-4 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payments.length > 0 ? (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-all">
                    <td className="p-4 font-bold text-neon-red font-mono">#{p.transactionCode || p.txCode}</td>
                    <td className="p-4 font-bold text-white">{p.user || p.userName || 'Khách hàng'}</td>
                    <td className="p-4 text-right font-mono font-bold text-emerald-400">+{formatVND(p.amount)}</td>
                    <td className="p-4 text-gray-300">{p.description || p.method || 'Nạp tiền ví'}</td>
                    <td className="p-4 text-gray-400 font-mono">{p.createdAt || p.time}</td>
                    <td className="p-4 text-center">
                      <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-[10px] rounded-full font-mono">
                        Thành công
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400 font-bold">
                    Chưa có giao dịch nạp tiền nào trên hệ thống.
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
