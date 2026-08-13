'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, FolderGit2, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { itemCount } = useCart();

  // Hide mobile bottom nav in admin routes to give admins full screen real estate
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    {
      label: 'Trang chủ',
      href: '/',
      icon: Home,
      exact: true,
    },
    {
      label: 'Dịch vụ',
      href: '/services',
      icon: Grid,
      exact: false,
    },
    {
      label: 'Tài nguyên',
      href: '/resources',
      icon: FolderGit2,
      exact: false,
    },
    {
      label: 'Giỏ hàng',
      href: '/cart',
      icon: ShoppingCart,
      badge: itemCount > 0 ? itemCount : undefined,
      exact: false,
    },
    {
      label: 'Tài khoản',
      href: '/account',
      icon: User,
      exact: false,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#08080F]/95 backdrop-blur-2xl border-t border-white/10 px-3 py-2 shadow-[0_-10px_25px_rgba(0,0,0,0.8)] pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-neon-red bg-neon-red/10 border border-neon-red/20 font-bold scale-105'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 bg-neon-red text-white text-[9px] font-black px-1.5 py-0.2 rounded-full min-w-[16px] text-center border border-[#08080F] shadow-neon-red animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight leading-none font-medium truncate w-full text-center">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
