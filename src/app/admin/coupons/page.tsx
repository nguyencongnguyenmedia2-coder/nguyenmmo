'use client';

import React, { useState } from 'react';
import { Tag, Plus } from 'lucide-react';
import { formatVND } from '@/lib/utils';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([
    { id: '1', code: 'DIGITALMMO50', discount: 50000, type: 'fixed', minOrder: 100000, usages: 142, maxUsages: 500, active: true },
    { id: '2', code: 'VIPPRO10', discount: 10, type: 'percent', minOrder: 200000, usages: 88, maxUsages: 200, active: true },
    { id: '3', code: 'HOT50K', discount: 50000, type: 'fixed', minOrder: 150000, usages: 50, maxUsages: 100, active: true },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Tag className="w-6 h-6 text-neon-red" />
            <span>QUẢN LÝ MÃ GIẢM GIÁ / COUPON</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Tạo mã coupon khuyến mãi tặng khách hàng khi đặt đơn.
          </p>
        </div>

        <button
          onClick={() => {
            const code = prompt('Nhập mã Coupon mới (VD: SALE100K):');
            if (code) {
              setCoupons([...coupons, { id: Date.now().toString(), code: code.toUpperCase(), discount: 50000, type: 'fixed', minOrder: 100000, usages: 0, maxUsages: 100, active: true }]);
            }
          }}
          className="px-4 py-2 bg-neon-red text-white text-xs font-bold rounded-xl btn-beam-touch flex items-center gap-1.5 overflow-hidden"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Mã Coupon Mới</span>
        </button>
      </div>

      <div className="bg-[#0D0D14] border border-white/10 rounded-3xl overflow-hidden shadow-glass">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-white/5 text-gray-400 uppercase text-[10px] tracking-wider border-b border-white/10 font-mono">
              <tr>
                <th className="p-4">Mã Coupon</th>
                <th className="p-4 text-right">Mức giảm</th>
                <th className="p-4 text-right">Đơn tối thiểu</th>
                <th className="p-4 text-center">Lượt sử dụng</th>
                <th className="p-4 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-white/5 transition-all">
                  <td className="p-4 font-extrabold text-amber-300 font-mono">{c.code}</td>
                  <td className="p-4 text-right font-mono font-bold text-white">
                    {c.type === 'fixed' ? formatVND(c.discount) : `Giảm ${c.discount}%`}
                  </td>
                  <td className="p-4 text-right font-mono text-gray-300">{formatVND(c.minOrder)}</td>
                  <td className="p-4 text-center font-mono text-gray-300">{c.usages} / {c.maxUsages}</td>
                  <td className="p-4 text-center">
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-[10px] rounded-full font-mono">
                      Hoạt động
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
