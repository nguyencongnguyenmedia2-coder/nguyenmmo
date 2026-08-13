'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatVND } from '@/lib/utils';
import { DollarSign, ShoppingBag, Users, TrendingUp, Zap, Layers, AlertCircle } from 'lucide-react';
import { Service, ServiceRequest } from '@/types';

export default function AdminOverviewPage() {
  const [totalOrdersCount, setTotalOrdersCount] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [todayRevenue, setTodayRevenue] = useState<number>(0);
  const [servicesCount, setServicesCount] = useState<number>(0);
  const [topServices, setTopServices] = useState<Service[]>([]);

  useEffect(() => {
    // 1. Calculate Orders & Revenue from localStorage requests & orders
    let combinedPrice = 0;
    let ordersLen = 0;
    let todayPrice = 0;
    const todayStr = new Date().toISOString().substring(0, 10);

    try {
      const cachedReqs = localStorage.getItem('nguyenmmo_requests');
      if (cachedReqs) {
        const reqs: ServiceRequest[] = JSON.parse(cachedReqs);
        if (Array.isArray(reqs)) {
          ordersLen += reqs.length;
          reqs.forEach((r) => {
            combinedPrice += r.estimatedPrice || 0;
            if (r.createdAt && r.createdAt.startsWith(todayStr)) {
              todayPrice += r.estimatedPrice || 0;
            }
          });
        }
      }
    } catch (e) {}

    try {
      const cachedOrders = localStorage.getItem('digital_mmo_orders');
      if (cachedOrders) {
        const ords: any[] = JSON.parse(cachedOrders);
        if (Array.isArray(ords)) {
          ords.forEach((o) => {
            combinedPrice += o.finalAmount || 0;
            if (o.createdAt && o.createdAt.startsWith(todayStr)) {
              todayPrice += o.finalAmount || 0;
            }
          });
        }
      }
    } catch (e) {}

    setTotalOrdersCount(ordersLen);
    setTotalRevenue(combinedPrice);
    setTodayRevenue(todayPrice);

    // 2. Load active services count
    try {
      const cachedServices = localStorage.getItem('nguyenmmo_services');
      if (cachedServices) {
        const srvs: Service[] = JSON.parse(cachedServices);
        if (Array.isArray(srvs)) {
          setServicesCount(srvs.length);
          setTopServices(srvs.slice(0, 5));
        }
      }
    } catch (e) {}
  }, []);

  return (
    <div className="space-y-8">
      
      {/* HEADER TITLE */}
      <div className="pb-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-neon-red" />
            <span>DASHBOARD & BÁO CÁO TỔNG QUAN</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Báo cáo chỉ số doanh thu, đơn hàng thực tế phát sinh trên hệ thống.
          </p>
        </div>
      </div>

      {/* 4 Dynamic Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Stat 1: Today Revenue */}
        <div className="p-5 bg-[#0D0D14] border border-white/10 rounded-2xl shadow-glass space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Doanh thu hôm nay:</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
            {formatVND(todayRevenue)}
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold">Tự động cập nhật</div>
        </div>

        {/* Stat 2: Month Revenue */}
        <div className="p-5 bg-[#0D0D14] border border-white/10 rounded-2xl shadow-glass space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Tổng Doanh Thu:</span>
            <TrendingUp className="w-4 h-4 text-neon-red" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-neon-red font-mono">
            {formatVND(totalRevenue)}
          </div>
          <div className="text-[10px] text-gray-400">Từ các đơn hàng khách đặt</div>
        </div>

        {/* Stat 3: Total Orders */}
        <div className="p-5 bg-[#0D0D14] border border-white/10 rounded-2xl shadow-glass space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Tổng Yêu Cầu/Đơn hàng:</span>
            <ShoppingBag className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            {totalOrdersCount}
          </div>
          <div className="text-[10px] text-gray-400">Đơn hàng mới từ website</div>
        </div>

        {/* Stat 4: Active Services */}
        <div className="p-5 bg-[#0D0D14] border border-white/10 rounded-2xl shadow-glass space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Dịch Vụ Đã Tạo:</span>
            <Layers className="w-4 h-4 text-gold-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-gold-400 font-mono">
            {servicesCount}
          </div>
          <div className="text-[10px] text-gold-400 font-semibold">Dịch vụ đang mở bán</div>
        </div>

      </div>

      {/* Analytics chart & Top Services */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 7 Days Revenue Trend Bar */}
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
              { day: 'Thứ 2', revenue: 0, pct: 0 },
              { day: 'Thứ 3', revenue: 0, pct: 0 },
              { day: 'Thứ 4', revenue: 0, pct: 0 },
              { day: 'Thứ 5', revenue: 0, pct: 0 },
              { day: 'Thứ 6', revenue: 0, pct: 0 },
              { day: 'Thứ 7', revenue: 0, pct: 0 },
              { day: 'Chủ nhật (Hôm nay)', revenue: todayRevenue, pct: todayRevenue > 0 ? 100 : 0 },
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

        {/* Right: Top Selling Services Table */}
        <div className="lg:col-span-5 p-6 bg-[#0D0D14] border border-white/10 rounded-3xl space-y-4 shadow-glass">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-gold-400" />
              <span>Dịch vụ Trên Hệ Thống</span>
            </h2>
          </div>

          {topServices.length > 0 ? (
            <div className="space-y-3 text-xs">
              {topServices.map((srv) => (
                <div key={srv.id} className="p-3 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
                  <div className="space-y-0.5 max-w-xs truncate">
                    <div className="font-bold text-white truncate">{srv.name}</div>
                    <div className="text-[10px] text-gray-400 font-mono uppercase">{srv.category} • Đã bán: {srv.sold || 0}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-neon-red font-mono">{formatVND(srv.salePrice || srv.price)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 mx-auto">
                <AlertCircle className="w-5 h-5" />
              </div>
              <p className="text-gray-300 font-bold text-xs">Chưa có dịch vụ nào trên hệ thống.</p>
              <Link
                href="/admin/services"
                className="inline-block px-4 py-2 bg-neon-red text-white text-xs font-bold rounded-xl shadow-neon-red"
              >
                ➕ Thêm Dịch Vụ Mới
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
