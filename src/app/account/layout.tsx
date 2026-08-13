'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { formatVND } from '@/lib/utils';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  PlayCircle, 
  History, 
  Wallet, 
  PlusCircle, 
  Tag, 
  Heart, 
  Star, 
  Bell, 
  User as UserIcon, 
  KeyRound, 
  LogOut 
} from 'lucide-react';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems = [
    { label: 'Tổng quan', href: '/account', icon: LayoutDashboard },
    { label: 'Đơn hàng', href: '/account/orders', icon: ShoppingBag },
    { label: 'Lịch sử giao dịch & Ví tiền', href: '/account/wallet', icon: Wallet },
    { label: 'Yêu thích', href: '/account/favorites', icon: Heart },
    { label: 'Thông báo', href: '/account/notifications', icon: Bell },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT SIDEBAR MENU */}
        <aside className="lg:col-span-3 bg-[#0D0D14] border border-white/10 rounded-3xl p-5 shadow-glass space-y-6">
          
          {/* User Bio Header */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-neon-red/20 border-2 border-neon-red mx-auto flex items-center justify-center text-xl font-bold text-neon-red shadow-neon-red">
              {user?.name.charAt(0) || 'N'}
            </div>
            <div>
              <div className="font-extrabold text-white text-sm">
                {user?.name || 'Nguyễn Văn Tiến'}
              </div>
              <div className="text-xs text-emerald-400 font-bold uppercase font-mono mt-0.5">
                Thành viên chính thức
              </div>
            </div>
            <div className="pt-2 border-t border-white/10">
              <div className="text-[11px] text-gray-400">Số dư khả dụng:</div>
              <div className="text-lg font-black text-emerald-400 font-mono">
                {formatVND(user?.balance || 2500000)}
              </div>
            </div>
          </div>

          {/* Navigation Links matching spec 11 */}
          <nav className="space-y-1 text-xs">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                    isActive
                      ? 'bg-neon-red text-white shadow-neon-red'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-red-400 hover:bg-red-500/10 transition-all text-left mt-4 border-t border-white/10 pt-4"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Đăng xuất</span>
            </button>
          </nav>

        </aside>

        {/* RIGHT MAIN CONTENT AREA */}
        <main className="lg:col-span-9">
          {children}
        </main>

      </div>
    </div>
  );
}
