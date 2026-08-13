'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@/context/WalletContext';
import { formatVND } from '@/lib/utils';
import { ShoppingBag, Search, Filter, ExternalLink, Clock, CheckCircle2 } from 'lucide-react';
import { Order } from '@/types';

export default function UserOrdersPage() {
  const { orders: contextOrders } = useWallet();
  const [allOrders, setAllOrders] = useState<Order[]>(contextOrders);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchCode, setSearchCode] = useState<string>('');

  useEffect(() => {
    const fetchRequests = async () => {
      let combined: Order[] = [...contextOrders];

      // Load dynamically saved requests from localStorage
      try {
        const cachedReqs = localStorage.getItem('nguyenmmo_requests');
        if (cachedReqs) {
          const reqs = JSON.parse(cachedReqs);
          const mapped: Order[] = reqs.map((r: any) => ({
            id: r.id || `req-${Math.random()}`,
            orderCode: r.requestCode || r.orderCode || 'DH1000',
            userId: r.userId || 'usr-guest',
            customerName: r.guestName || 'Khách hàng',
            email: r.guestEmail || '',
            phone: r.guestPhone || '',
            serviceId: r.serviceId || 'srv-custom',
            serviceName: r.serviceNameSnapshot || r.serviceName || 'Dịch vụ MMO',
            category: r.categorySnapshot || 'mmo',
            targetLink: r.targetUrl || r.targetLink || '#',
            quantity: r.quantity || 1,
            totalAmount: r.estimatedPrice || r.totalAmount || 0,
            discountAmount: 0,
            finalAmount: r.estimatedPrice || r.finalAmount || 0,
            paymentMethod: 'contact_admin',
            paymentStatus: 'paid',
            orderStatus: r.status === 'COMPLETED' ? 'completed' : 'processing',
            createdAt: r.createdAt || new Date().toISOString().substring(0, 19).replace('T', ' '),
          }));

          // Avoid duplicates by orderCode
          const existingCodes = new Set(combined.map((o) => o.orderCode));
          mapped.forEach((m) => {
            if (!existingCodes.has(m.orderCode)) {
              combined.unshift(m);
            }
          });
        }
      } catch (e) {}

      setAllOrders(combined);
    };

    fetchRequests();
  }, [contextOrders]);

  const filtered = allOrders.filter((ord) => {
    const matchStatus = filterStatus === 'all' || ord.orderStatus === filterStatus;
    const matchCode =
      searchCode === '' ||
      ord.orderCode.toLowerCase().includes(searchCode.toLowerCase()) ||
      ord.serviceName.toLowerCase().includes(searchCode.toLowerCase());
    return matchStatus && matchCode;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-neon-red" />
            <span>QUẢN LÝ ĐƠN HÀNG</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Theo dõi tiến độ chạy tự động và lịch sử đơn dịch vụ của bạn.
          </p>
        </div>

        {/* Filter & Search controls */}
        <div className="flex items-center gap-2">
          <div className="relative w-44">
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Mã đơn / Dịch vụ..."
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-neon-red font-mono"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white outline-none"
          >
            <option value="all" className="bg-[#0D0D14]">Tất cả trạng thái</option>
            <option value="processing" className="bg-[#0D0D14]">🟢 Đang xử lý</option>
            <option value="completed" className="bg-[#0D0D14]">✅ Hoàn thành</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#0D0D14] border border-white/10 rounded-3xl overflow-hidden shadow-glass">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-white/5 text-gray-400 uppercase text-[10px] tracking-wider border-b border-white/10 font-mono">
              <tr>
                <th className="p-4">Mã đơn</th>
                <th className="p-4">Dịch vụ</th>
                <th className="p-4">Đường dẫn Link</th>
                <th className="p-4 text-center">Số lượng</th>
                <th className="p-4 text-right">Tổng tiền</th>
                <th className="p-4 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length > 0 ? (
                filtered.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/5 transition-all">
                    <td className="p-4 font-bold text-neon-red font-mono">#{ord.orderCode}</td>
                    <td className="p-4 font-medium text-white max-w-xs leading-snug">
                      <div>{ord.serviceName}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{ord.createdAt}</div>
                    </td>
                    <td className="p-4 text-gray-400 font-mono max-w-xs truncate">
                      <a href={ord.targetLink} target="_blank" rel="noreferrer" className="hover:text-neon-red flex items-center gap-1">
                        <span className="truncate">{ord.targetLink}</span>
                        <ExternalLink className="w-3 h-3 shrink-0 text-gray-500" />
                      </a>
                    </td>
                    <td className="p-4 text-center font-mono font-bold text-gray-200">
                      {ord.quantity.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-mono text-emerald-400 font-bold">
                      {formatVND(ord.finalAmount)}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold font-mono inline-flex items-center gap-1 ${
                        ord.orderStatus === 'processing'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-white/10 text-gray-300'
                      }`}>
                        {ord.orderStatus === 'processing' ? '🟢 Đang xử lý' : '✅ Hoàn thành'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400 font-bold">
                    Không tìm thấy đơn hàng nào.
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
