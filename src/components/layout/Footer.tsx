'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, ShieldCheck, Headphones, Send, PhoneCall, Mail, ChevronRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050508] border-t border-white/10 text-gray-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-neon-red to-red-600 flex items-center justify-center shadow-neon-red">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Nguyên<span className="text-neon-red">MMO</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Kho dịch vụ mạng xã hội, công cụ AI, phần mềm và giải pháp Digital chuyên nghiệp hàng đầu dành cho cá nhân, creator, doanh nghiệp và người làm MMO thực chiến.
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold text-gray-300 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Tự động 24/7</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <Headphones className="w-4 h-4 text-neon-red" />
                <span>Bảo hành uy tín</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-base tracking-wide">Dịch Vụ Nổi Bật</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services/facebook" className="hover:text-neon-red transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600" /> Dịch vụ Facebook
                </Link>
              </li>
              <li>
                <Link href="/services/tiktok" className="hover:text-neon-red transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600" /> Dịch vụ TikTok
                </Link>
              </li>
              <li>
                <Link href="/services/youtube" className="hover:text-neon-red transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600" /> Dịch vụ YouTube
                </Link>
              </li>
              <li>
                <Link href="/services/telegram" className="hover:text-neon-red transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600" /> Dịch vụ Telegram
                </Link>
              </li>
              <li>
                <Link href="/services/ai" className="hover:text-neon-red transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600" /> Tài khoản AI Tools
                </Link>
              </li>
              <li>
                <Link href="/services/mmo" className="hover:text-neon-red transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600" /> Proxy & VPS MMO
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Support */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-base tracking-wide">Hỗ Trợ Khách Hàng</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Trung tâm trợ giúp</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Chính sách bảo hành</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Chính sách hoàn tiền</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Điều khoản dịch vụ</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-base tracking-wide">Kết Nối 24/7</h3>
            <div className="space-y-2 text-sm">
              <a href="https://t.me/nguyenmmo07" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-300 hover:text-sky-400 transition-colors">
                <Send className="w-4 h-4 text-sky-400" />
                <span>Telegram: @nguyenmmo07</span>
              </a>
              <a href="https://zalo.me/0934811307" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors">
                <PhoneCall className="w-4 h-4 text-blue-400" />
                <span>Zalo: 0934811307</span>
              </a>
              <a href="https://www.facebook.com/nguyenads7" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-300 hover:text-indigo-400 transition-colors">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>FB: nguyenads7</span>
              </a>
            </div>
            
            <div className="pt-2">
              <div className="text-xs font-semibold text-gray-400 mb-2">Thanh toán tự động qua:</div>
              <div className="flex flex-wrap gap-2 text-xs font-mono font-bold text-gray-300">
                <span className="px-2 py-1 bg-white/5 border border-white/10 rounded">VietQR</span>
                <span className="px-2 py-1 bg-white/5 border border-white/10 rounded">MB Bank</span>
                <span className="px-2 py-1 bg-white/5 border border-white/10 rounded">Techcombank</span>
                <span className="px-2 py-1 bg-white/5 border border-white/10 rounded">MoMo</span>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 Nguyên MMO. All rights reserved. Nền tảng dịch vụ MMO & Digital hàng đầu Việt Nam.</p>
          <div className="flex gap-6">
            <Link href="/contact" className="hover:text-gray-300">Quyền riêng tư</Link>
            <Link href="/contact" className="hover:text-gray-300">Điều khoản sử dụng</Link>
            <Link href="/sitemap.xml" className="hover:text-gray-300">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
