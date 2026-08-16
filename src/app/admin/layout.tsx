'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Layers, 
  Grid, 
  Tag, 
  Settings, 
  ArrowLeft,
  FolderGit2,
  Sparkles,
  ShieldCheck,
  Zap,
  Bot,
  BookOpen
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { Lock, AlertTriangle } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isLoggedIn } = useAuth();

  // Admin Access Control Guard: Allow strictly if logged in as Admin
  const userEmail = (user?.email || '').toLowerCase();
  const isAdminAuthorized = Boolean(
    isLoggedIn &&
    user &&
    (user.isAdmin === true || user.role === 'admin' || userEmail.includes('admin') || userEmail === 'admin@nguyenmmo.com')
  );

  if (!isAdminAuthorized) {
    return (
      <div className="min-h-screen bg-[#050507] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0D0D14] border-2 border-red-500/50 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto shadow-lg animate-bounce">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-black text-white uppercase tracking-tight">
              🚫 KHÔNG CÓ QUYỀN TRUY CẬP TRANG ADMIN
            </h1>
            <p className="text-xs text-gray-300 leading-relaxed">
              Trang quản trị này chỉ dành riêng cho <span className="text-red-400 font-bold">Admin Quản Trị Hệ Thống</span>. Tài khoản khách hàng thường không thể truy cập hoặc thao tác các chức năng này.
            </p>
          </div>

          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-[11px] text-red-300 font-semibold flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>Tài khoản hiện tại: {user?.email || 'Chưa đăng nhập (Khách)'}</span>
          </div>

          <div className="pt-2 space-y-2.5">
            <Link
              href="/login"
              className="w-full py-3.5 bg-neon-red hover:bg-neon-red-hover text-white text-xs font-black rounded-2xl shadow-neon-red hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4 fill-white" />
              <span>🔑 ĐĂNG NHẬP TÀI KHOẢN ADMIN</span>
            </Link>

            <Link
              href="/"
              className="w-full py-3 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-2xl transition-all block"
            >
              ← Quay về Trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Grouped Navigation Sections for Professional SaaS Layout
  const menuGroups = [
    {
      groupTitle: 'TỔNG QUAN HỆ THỐNG',
      items: [
        { label: 'Dashboard & Báo Cáo', href: '/admin', icon: LayoutDashboard },
      ],
    },
    {
      groupTitle: 'QUẢN LÝ VẬN HÀNH',
      items: [
        { label: 'Yêu Cầu Dịch Vụ (Leads)', href: '/admin/orders', icon: ShoppingBag, badge: 'LEAD' },
        { label: 'Dịch Vụ & API Connector', href: '/admin/services', icon: Layers },
        { label: 'Danh Mục Dịch Vụ', href: '/admin/categories', icon: Grid },
        { label: 'Kho Tài Nguyên Digital', href: '/admin/resources', icon: FolderGit2 },
        { label: 'Bài Viết & Khóa Học Blog', href: '/admin/blogs', icon: BookOpen },
        { label: 'Quản Lý Khách Hàng', href: '/admin/users', icon: Users },
      ],
    },
    {
      groupTitle: 'MARKETING & CẤU HÌNH',
      items: [
        { label: 'Mã Coupon & Khuyến Mãi', href: '/admin/coupons', icon: Tag },
        { label: 'Cài Đặt & Thông Báo Bot', href: '/admin/settings', icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* ADMIN CONTROL HEADER BAR */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#0D0D14] border border-white/15 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center font-black text-sky-400 text-lg shrink-0">
              N
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white tracking-tight">
                  NGUYÊN MMO ADMIN CONTROL
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Online 24/7
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Trung tâm quản trị dịch vụ SMM, AI Tools, Proxy/VPS & Lead Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <Link
              href="/"
              className="text-xs font-bold text-gray-300 hover:text-white flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Xem trang cửa hàng</span>
            </Link>
          </div>
        </div>

        {/* MAIN BODY GRID: SIDEBAR LEFT & CONTENT RIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* PROFESSIONAL GROUPED SIDEBAR NAVIGATION */}
          <aside className="lg:col-span-3 bg-[#0D0D14] border border-white/10 rounded-3xl p-5 shadow-2xl space-y-6">
            
            {/* Admin User Mini Card */}
            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-neon-red/20 border border-neon-red/40 flex items-center justify-center font-bold text-neon-red text-sm">
                A
              </div>
              <div className="min-w-0">
                <div className="font-bold text-white text-xs truncate">Admin Nguyễn</div>
                <div className="text-[10px] text-neon-red font-mono font-bold">Super Admin</div>
              </div>
            </div>

            {/* Grouped Navigations */}
            <nav className="space-y-6">
              {menuGroups.map((group, gIdx) => (
                <div key={gIdx} className="space-y-2">
                  <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest px-3 flex items-center justify-between">
                    <span>{group.groupTitle}</span>
                    <span className="w-8 h-[1px] bg-white/10"></span>
                  </div>

                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all group ${
                            isActive
                              ? 'bg-gradient-to-r from-neon-red to-neon-red-hover text-white shadow-neon-red font-black border-l-4 border-white'
                              : 'text-gray-400 hover:text-white hover:bg-white/5 hover:translate-x-1'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-white scale-110' : 'group-hover:text-neon-red'}`} />
                            <span>{item.label}</span>
                          </div>

                          {item.badge && (
                            <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold ${
                              isActive ? 'bg-black/30 text-white' : 'bg-neon-red/20 text-neon-red border border-neon-red/30'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Sidebar Footer System Info */}
            <div className="pt-4 border-t border-white/10 text-[10px] text-gray-500 space-y-1 text-center font-mono">
              <div>System Version 2.4.0 (Pro)</div>
              <div>© 2026 Nguyên MMO Admin</div>
            </div>

          </aside>

          {/* MAIN PAGE CONTENT CONTAINER */}
          <main className="lg:col-span-9">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}
