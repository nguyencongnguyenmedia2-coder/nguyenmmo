'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Flame, 
  Heart, 
  ShoppingCart, 
  User as UserIcon, 
  Search, 
  Menu as MenuIcon, 
  X, 
  ChevronDown, 
  Wallet,
  Clock,
  Coffee
} from 'lucide-react';
import { MegaMenu } from './MegaMenu';
import { SearchModal } from '../ui/SearchModal';
import { CoffeeModal } from '../ui/CoffeeModal';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { formatVND } from '@/lib/utils';

export const Header: React.FC = () => {
  const { user, isLoggedIn, favorites, logout } = useAuth();
  const { itemCount } = useCart();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCoffeeModalOpen, setIsCoffeeModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-4 z-40 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#0B0B10]/95 backdrop-blur-xl border border-white/15 rounded-pill shadow-2xl px-4 lg:px-8 py-3 flex items-center justify-between transition-all">
          
          {/* LEFT: BRAND LOGO - NGUYÊN MMO */}
          <Link href="/" className="flex items-center gap-2 group py-0.5">
            <img 
              src="/logo.png" 
              alt="Nguyên MMO" 
              className="h-7 sm:h-8 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" 
            />
          </Link>

          {/* CENTER: DESKTOP NAV MENU (Clean redesigned layout) */}
          <nav className="hidden lg:flex items-center gap-1.5 text-sm font-medium">
            <Link 
              href="/" 
              className="px-3.5 py-2 rounded-full text-gray-200 hover:text-white hover:bg-white/5 transition-all"
            >
              Trang chủ
            </Link>

            {/* MEGA MENU TRIGGER - DỊCH VỤ */}
            <div 
              className="relative"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button 
                className="px-3.5 py-2 rounded-full text-gray-200 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1 group whitespace-nowrap"
              >
                <span>Dịch vụ MMO</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-white transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* MEGA MENU DROPDOWN */}
              {isMegaMenuOpen && (
                <div className="absolute top-full -left-20 pt-3 z-50">
                  <MegaMenu onClose={() => setIsMegaMenuOpen(false)} />
                </div>
              )}
            </div>

            <Link 
              href="/services/web-app-design" 
              className="px-4 py-2 rounded-full bg-gradient-to-r from-neon-red/15 to-purple-600/15 border border-neon-red/40 text-neon-red font-bold hover:bg-neon-red/20 transition-all whitespace-nowrap flex items-center gap-1.5 shadow-sm"
            >
              <span>💻 Thiết Kế Web & App</span>
            </Link>

            <Link href="/resources" className="px-3.5 py-2 rounded-full text-gray-200 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap">
              Kho tài nguyên
            </Link>

            <Link href="/blog" className="px-3.5 py-2 rounded-full text-gray-200 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap">
              Blog
            </Link>

            {/* HOT CTA BUTTON */}
            <Link 
              href="/services" 
              className="px-4 py-2 rounded-full bg-neon-red/10 border border-neon-red/40 text-white font-extrabold text-xs flex items-center gap-1.5 hover:scale-105 transition-transform ml-1 whitespace-nowrap"
            >
              <Flame className="w-4 h-4 text-neon-red fill-neon-red animate-bounce shrink-0" />
              <span className="text-neon-red tracking-wide font-black uppercase">Ưu đãi HOT</span>
            </Link>
          </nav>

          {/* RIGHT ACTION BUTTONS */}
          <div className="flex items-center gap-2">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-all relative"
              title="Tìm kiếm dịch vụ"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="hidden sm:flex p-2 rounded-full text-gray-300 hover:text-neon-red hover:bg-white/10 transition-all relative"
              title="Giỏ hàng"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-neon-red text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* USER BALANCE & PROFILE */}
            {isLoggedIn && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-neon-red/20 border border-neon-red/40 flex items-center justify-center text-xs font-bold text-neon-red">
                    {(user?.name || 'U').charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-bold text-white leading-tight">
                      {(user?.name || 'User').split(' ')[0]}
                    </div>
                    <div className="text-[11px] font-bold text-neon-red leading-tight">
                      {user?.vipTier === 'business' ? 'PRO VIP' : 'Thành viên'}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-[#0E0E16] border border-white/15 rounded-2xl shadow-2xl p-2 z-50">
                    <div className="p-3 border-b border-white/10 text-xs">
                      <div className="font-bold text-white">{user?.name || 'Thành viên'}</div>
                      <div className="text-gray-400 truncate">{user?.email || 'N/A'}</div>
                    </div>

                    <div className="py-1 text-xs text-gray-300 space-y-1">
                      <Link href="/account" onClick={() => setIsUserMenuOpen(false)} className="block px-3 py-2 hover:bg-white/5 rounded-xl transition-colors">
                        📊 Dashboard cá nhân
                      </Link>
                      <Link href="/account/orders" onClick={() => setIsUserMenuOpen(false)} className="block px-3 py-2 hover:bg-white/5 rounded-xl transition-colors">
                        📦 Yêu cầu dịch vụ của tôi
                      </Link>

                      {(user?.isAdmin || user?.role === 'admin' || (user?.email || '').toLowerCase().includes('admin')) && (
                        <Link href="/admin" onClick={() => setIsUserMenuOpen(false)} className="block px-3 py-2 hover:bg-neon-red/10 text-neon-red font-bold rounded-xl transition-colors">
                          ⚙️ Admin Control
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-white/10">
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-semibold"
                      >
                        🚪 Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 ml-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-full text-xs font-semibold text-gray-200 hover:text-white hover:bg-white/10 transition-all"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-full bg-neon-red hover:bg-neon-red-hover text-white text-xs font-bold btn-beam-touch hover:scale-105 transition-all overflow-hidden"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU DRAWER */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 border-beam-always p-5 shadow-2xl text-white space-y-4 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 font-black text-white text-sm">
                <Zap className="w-5 h-5 text-neon-red fill-neon-red" />
                <span>NGUYÊN MMO DIGITAL</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                ONLINE 24/7
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-center transition-all flex items-center justify-center gap-1.5">🏠 Trang chủ</Link>
              <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-center transition-all flex items-center justify-center gap-1.5">🚀 Dịch vụ MMO</Link>
              <Link href="/services/web-app-design" onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-gradient-to-r from-neon-red/20 to-purple-600/20 border border-neon-red/40 text-neon-red rounded-2xl text-center font-extrabold col-span-2 transition-all flex items-center justify-center gap-2 shadow-sm">
                <span>💻 Thiết Kế Web & App Chuẩn SEO</span>
                <span className="px-1.5 py-0.2 rounded bg-neon-red text-white text-[9px] font-black uppercase">HOT</span>
              </Link>
              <Link href="/resources" onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-center transition-all flex items-center justify-center gap-1.5">📦 Kho Tài Nguyên</Link>
              <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-center transition-all flex items-center justify-center gap-1.5">📖 Blog & Bài viết</Link>
              <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-white/10 border border-white/15 text-white rounded-2xl text-center font-extrabold col-span-2 flex items-center justify-center gap-2">👤 Quản Lý Tài Khoản</Link>
            </div>

            {/* Quick Contact Hotline Bar */}
            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl space-y-2 text-xs">
              <div className="text-gray-400 text-[11px] font-bold">Hỗ trợ kỹ thuật 24/7:</div>
              <div className="grid grid-cols-3 gap-1.5">
                <a href="https://t.me/nguyenmmo07" target="_blank" rel="noreferrer" className="p-2 bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-xl text-center font-bold text-[10px] flex items-center justify-center gap-1">
                  ✈️ Telegram
                </a>
                <a href="https://zalo.me/0934811307" target="_blank" rel="noreferrer" className="p-2 bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-xl text-center font-bold text-[10px] flex items-center justify-center gap-1">
                  💬 Zalo
                </a>
                <a href="https://www.facebook.com/nguyenads7" target="_blank" rel="noreferrer" className="p-2 bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 rounded-xl text-center font-bold text-[10px] flex items-center justify-center gap-1">
                  📘 Facebook
                </a>
              </div>
            </div>

            {!isLoggedIn && (
              <div className="flex gap-2 pt-2 border-t border-white/10">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 py-3 text-center bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-bold">Đăng nhập</Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 py-3 text-center bg-neon-red text-white rounded-2xl text-xs font-black btn-beam-touch overflow-hidden">⚡ Đăng ký</Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Global Search Dialog */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Buy Me A Coffee Dialog */}
      <CoffeeModal isOpen={isCoffeeModalOpen} onClose={() => setIsCoffeeModalOpen(false)} />
    </>
  );
};
