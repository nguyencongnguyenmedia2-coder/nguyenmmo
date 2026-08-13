'use client';

import React from 'react';
import { formatVND } from '@/lib/utils';
import { DollarSign, ShoppingBag, Users, TrendingUp, Zap, Star } from 'lucide-react';
import { MOCK_SERVICES } from '@/data/mockServices';

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8">
      {/* 4 Stats Cards matching spec 18 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Stat 1: Today Revenue */}
        <div className="p-5 bg-[#0D0D14] border border-white/10 rounded-2xl shadow-glass space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Doanh thu hôm nay:</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
            {formatVND(12500000)}
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold">+18% so với hôm qua</div>
        </div>

        {/* Stat 2: Month Revenue */}
        <div className="p-5 bg-[#0D0D14] border border-white/10 rounded-2xl shadow-glass space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Doanh thu tháng:</span>
            <TrendingUp className="w-4 h-4 text-neon-red" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-neon-red font-mono">
            {formatVND(350000000)}
          </div>
          <div className="text-[10px] text-gray-500">Mục tiêu tháng: 400M</div>
        </div>

        {/* Stat 3: Total Orders */}
        <div className="p-5 bg-[#0D0D14] border border-white/10 rounded-2xl shadow-glass space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Tổng đơn hàng:</span>
            <ShoppingBag className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            1.245
          </div>
          <div className="text-[10px] text-gray-500">Tự động xử lý qua API</div>
        </div>

        {/* Stat 4: Total Users */}
        <div className="p-5 bg-[#0D0D14] border border-white/10 rounded-2xl shadow-glass space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Tổng Khách hàng:</span>
            <Users className="w-4 h-4 text-gold-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-gold-400 font-mono">
            5.420
          </div>
          <div className="text-[10px] text-gold-400 font-semibold">184 VIP Members</div>
        </div>

      </div>

      {/* Analytics chart representation & Top Services */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Revenue Trend Simulation (7 cols) */}
        <div className="lg:col-span-7 p-6 bg-[#0D0D14] border border-white/10 rounded-3xl space-y-4 shadow-glass">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-neon-red" />
              <span>Biểu đồ doanh thu 7 ngày qua</span>
            </h2>
            <span className="text-xs text-gray-400 font-mono">Đơn vị: VNĐ</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { day: 'Thứ 2', revenue: 9800000, pct: 60 },
              { day: 'Thứ 3', revenue: 11200000, pct: 70 },
              { day: 'Thứ 4', revenue: 14500000, pct: 90 },
              { day: 'Thứ 5', revenue: 10800000, pct: 68 },
              { day: 'Thứ 6', revenue: 13200000, pct: 82 },
              { day: 'Thứ 7', revenue: 15900000, pct: 100 },
              { day: 'Chủ nhật (Hôm nay)', revenue: 12500000, pct: 78 },
            ].map((bar) => (
              <div key={bar.day} className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-400 font-mono">
                  <span>{bar.day}</span>
                  <span className="text-white font-bold">{formatVND(bar.revenue)}</span>
                </div>
                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-neon-red to-gold-500 rounded-full transition-all duration-500"
                    style={{ width: `${bar.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Top Selling Services Table (5 cols) */}
        <div className="lg:col-span-5 p-6 bg-[#0D0D14] border border-white/10 rounded-3xl space-y-4 shadow-glass">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-gold-400" />
              <span>Top Dịch vụ Bán Chạy</span>
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            {MOCK_SERVICES.slice(0, 5).map((srv) => (
              <div key={srv.id} className="p-3 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
                <div className="space-y-0.5 max-w-xs truncate">
                  <div className="font-bold text-white truncate">{srv.name}</div>
                  <div className="text-[10px] text-gray-400 font-mono uppercase">{srv.category} • Đã bán: {srv.sold.toLocaleString()}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-neon-red font-mono">{formatVND(srv.salePrice || srv.price)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
