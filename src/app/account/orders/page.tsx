'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useWallet } from '@/context/WalletContext';
import { formatVND } from '@/lib/utils';
import { ShoppingBag, Search, ExternalLink } from 'lucide-react';
import { Order } from '@/types';

export default function UserOrdersPage() {
  const { user } = useAuth();
  const { orders: contextOrders } = useWallet();
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchCode, setSearchCode] = useState<string>('');

  const fetchRequests = async () => {
    if (!user) {
      setAllOrders([]);
      return;
    }

    let combined: (Order & { rawStatus?: string })[] = [];

    // 1. Fetch live requests from Backend API /api/service-requests
    try {
      const res = await fetch('/api/service-requests?t=' + Date.now(), {
        headers: {
          'x-user-id': user.id || '',
          'x-user-email': user.email || '',
        },
        credentials: 'include',
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const apiMapped: (Order & { rawStatus?: string })[] = json.data.map((r: any) => ({
          id: r.id || `req-${Math.random()}`,
          orderCode: r.requestCode || r.request_code || 'DH1000',
          userId: r.userId || r.user_id || 'usr-guest',
          customerName: r.guestName || r.guest_name || 'Khách hàng',
          email: r.guestEmail || r.guest_email || '',
          phone: r.guestPhone || r.guest_phone || '',
          serviceId: r.serviceId || r.service_id || 'srv-custom',
          serviceName: r.serviceNameSnapshot || r.service_name_snapshot || 'Dịch vụ MMO',
          category: r.categorySnapshot || r.category_snapshot || 'mmo',
          targetLink: r.targetUrl || r.target_url || '#',
          quantity: Number(r.quantity) || 1,
          totalAmount: Number(r.estimatedPrice || r.estimated_price) || 0,
          discountAmount: 0,
          finalAmount: Number(r.estimatedPrice || r.estimated_price) || 0,
          paymentMethod: 'bank_transfer',
          paymentStatus: 'paid',
          orderStatus: r.status === 'COMPLETED' ? 'completed' : r.status === 'CANCELED' || r.status === 'REJECTED' ? 'canceled' : 'processing',
          rawStatus: r.status || 'NEW',
          createdAt: r.createdAt || r.created_at || new Date().toISOString().substring(0, 19).replace('T', ' '),
          updatedAt: r.updatedAt || r.updated_at || new Date().toISOString().substring(0, 19).replace('T', ' '),
        }));

        combined.push(...apiMapped);
      }
    } catch (e) {}

    // 2. Load local cached requests from localStorage nguyenmmo_requests (ONLY for current user)
    try {
      const cachedReqs = localStorage.getItem('nguyenmmo_requests');
      if (cachedReqs) {
        const reqs: any[] = JSON.parse(cachedReqs);
        if (Array.isArray(reqs)) {
          const ownReqs = reqs.filter(
            (r) =>
              (r.user_id && r.user_id === user.id) ||
              (r.userId && r.userId === user.id) ||
              (r.guestEmail && r.guestEmail.toLowerCase() === user.email.toLowerCase()) ||
              (r.guestPhone && user.phone && r.guestPhone === user.phone)
          );

          const mapped: (Order & { rawStatus?: string })[] = ownReqs.map((r: any) => ({
            id: r.id || `req-${Math.random()}`,
            orderCode: r.requestCode || r.orderCode || 'DH1000',
            userId: r.userId || r.user_id || user.id,
            customerName: r.guestName || user.name || 'Khách hàng',
            email: r.guestEmail || user.email || '',
            phone: r.guestPhone || user.phone || '',
            serviceId: r.serviceId || 'srv-custom',
            serviceName: r.serviceNameSnapshot || r.serviceName || 'Dịch vụ MMO',
            category: r.categorySnapshot || 'mmo',
            targetLink: r.targetUrl || r.targetLink || '#',
            quantity: r.quantity || 1,
            totalAmount: r.estimatedPrice || r.totalAmount || 0,
            discountAmount: 0,
            finalAmount: r.estimatedPrice || r.finalAmount || 0,
            paymentMethod: 'bank_transfer',
            paymentStatus: 'paid',
            orderStatus: r.status === 'COMPLETED' ? 'completed' : r.status === 'CANCELED' || r.status === 'REJECTED' ? 'canceled' : 'processing',
            rawStatus: r.status || 'NEW',
            createdAt: r.createdAt || new Date().toISOString().substring(0, 19).replace('T', ' '),
            updatedAt: r.updatedAt || new Date().toISOString().substring(0, 19).replace('T', ' '),
          }));

          const existingCodes = new Set(combined.map((o) => o.orderCode));
          mapped.forEach((m) => {
            if (!existingCodes.has(m.orderCode)) {
              combined.push(m);
            }
          });
        }
      }
    } catch (e) {}

    // 3. Merge contextOrders (ONLY for current user)
    const ownContextOrders = contextOrders.filter(
      (o) =>
        !o.userId ||
        o.userId === user.id ||
        (o.email && o.email.toLowerCase() === user.email.toLowerCase())
    );

    const existingCodes = new Set(combined.map((o) => o.orderCode));
    ownContextOrders.forEach((o) => {
      if (!existingCodes.has(o.orderCode)) {
        combined.push(o);
      }
    });

    setAllOrders(combined);
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(() => {
      fetchRequests();
    }, 5000);
    return () => clearInterval(interval);
  }, [user, contextOrders]);

  const getStatusBadge = (statusStr?: string, defaultStatus?: string) => {
    const s = (statusStr || defaultStatus || 'NEW').toUpperCase();
    if (s === 'COMPLETED') {
      return <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold font-mono">🟢 HOÀN THÀNH</span>;
    }
    if (s === 'PROCESSING') {
      return <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold font-mono">⚡ ĐANG XỬ LÝ</span>;
    }
    if (s === 'CONFIRMED') {
      return <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold font-mono">💜 ĐÃ XÁC NHẬN</span>;
    }
    if (s === 'CONTACTING') {
      return <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold font-mono">💬 ĐANG LIÊN HỆ</span>;
    }
    if (s === 'CANCELED') {
      return <span className="px-3 py-1 rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30 text-[10px] font-bold font-mono">⚪ ĐÃ HỦY</span>;
    }
    if (s === 'REJECTED') {
      return <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold font-mono">🔴 TỪ CHỐI</span>;
    }
    return <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold font-mono">🟡 CHỜ XỬ LÝ</span>;
  };

  const filtered = allOrders.filter((ord) => {
    const raw = (ord as any).rawStatus || ord.orderStatus;
    const matchStatus =
      filterStatus === 'all' ||
      raw === filterStatus ||
      ord.orderStatus === filterStatus;

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
            <span>QUẢN LÝ ĐƠN HÀNG CỦA TÔI</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Theo dõi tiến độ chạy tự động và lịch sử các đơn hàng do chính bạn khởi tạo. Trạng thái cập nhật trực tiếp từ Admin.
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
            <option value="NEW" className="bg-[#0D0D14]">🟡 Chờ xử lý</option>
            <option value="CONTACTING" className="bg-[#0D0D14]">💬 Đang liên hệ</option>
            <option value="CONFIRMED" className="bg-[#0D0D14]">💜 Đã xác nhận</option>
            <option value="PROCESSING" className="bg-[#0D0D14]">⚡ Đang xử lý</option>
            <option value="COMPLETED" className="bg-[#0D0D14]">🟢 Hoàn thành</option>
            <option value="CANCELED" className="bg-[#0D0D14]">⚪ Đã hủy</option>
            <option value="REJECTED" className="bg-[#0D0D14]">🔴 Từ chối</option>
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
                <th className="p-4 text-center">Trạng thái (Live)</th>
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
                      {getStatusBadge((ord as any).rawStatus, ord.orderStatus)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400 font-bold">
                    {user ? 'Bạn chưa có đơn hàng nào.' : 'Vui lòng đăng nhập để xem lịch sử đơn hàng của bạn.'}
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
