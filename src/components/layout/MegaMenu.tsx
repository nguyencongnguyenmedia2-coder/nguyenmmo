'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MOCK_CATEGORIES } from '@/data/mockCategories';
import { Category } from '@/types';
import { Zap, ChevronRight, Flame, Sparkles } from 'lucide-react';

interface MegaMenuProps {
  onClose?: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ onClose }) => {
  const [categoriesList, setCategoriesList] = useState<Category[]>(MOCK_CATEGORIES);

  useEffect(() => {
    try {
      const savedAdminCategories = localStorage.getItem('nguyenmmo_categories');
      if (savedAdminCategories) {
        setCategoriesList(JSON.parse(savedAdminCategories));
      }
    } catch (e) {
      console.warn('Could not read admin categories cache:', e);
    }
  }, []);

  const smmCategories1 = categoriesList.filter((c) => ['facebook', 'tiktok', 'instagram', 'youtube', 'telegram'].includes(c.slug));
  const smmCategories2 = categoriesList.filter((c) => ['zalo', 'shopee', 'marketing'].includes(c.slug));
  const aiMmoCategories = categoriesList.filter((c) => ['ai', 'mmo'].includes(c.slug));
  const digitalCategories = categoriesList.filter((c) => ['digital', 'courses'].includes(c.slug));

  return (
    <div className="w-[880px] bg-[#09090D] border border-white/20 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] p-6 text-white grid grid-cols-4 gap-6 relative z-50">
      
      {/* Column 1: Social Media Main */}
      <div className="space-y-4 border-r border-white/5 pr-4">
        <div className="flex items-center gap-2 text-neon-red font-bold text-sm tracking-wider uppercase">
          <Zap className="w-4 h-4" />
          <span>Mạng Xã Hội</span>
        </div>
        <div className="space-y-2">
          {smmCategories1.map((cat) => (
            <Link
              key={cat.id}
              href={`/services/${cat.slug}`}
              onClick={onClose}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{cat.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-gray-200 group-hover:text-neon-red transition-colors flex items-center gap-1.5">
                    {cat.name}
                    {cat.isHot && (
                      <span className="px-1.5 py-0.2 rounded bg-neon-red/20 text-neon-red text-[9px] font-bold">HOT</span>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-400">{cat.count} dịch vụ</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-neon-red group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* Column 2: Social Media Platforms 2 */}
      <div className="space-y-4 border-r border-white/5 pr-4">
        <div className="flex items-center gap-2 text-neon-red font-bold text-sm tracking-wider uppercase">
          <Flame className="w-4 h-4" />
          <span>Nền Tảng Khác</span>
        </div>
        <div className="space-y-2">
          {smmCategories2.map((cat) => (
            <Link
              key={cat.id}
              href={`/services/${cat.slug}`}
              onClick={onClose}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{cat.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-gray-200 group-hover:text-neon-red transition-colors flex items-center gap-1.5">
                    {cat.name}
                  </div>
                  <div className="text-[11px] text-gray-400">{cat.count} dịch vụ</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-neon-red group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* Column 3: AI & MMO Tools */}
      <div className="space-y-4 border-r border-white/5 pr-4">
        <div className="flex items-center gap-2 text-purple-400 font-bold text-sm tracking-wider uppercase">
          <Sparkles className="w-4 h-4" />
          <span>AI & MMO Tools</span>
        </div>
        <div className="space-y-2">
          {aiMmoCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/services/${cat.slug}`}
              onClick={onClose}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{cat.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-gray-200 group-hover:text-purple-300 transition-colors flex items-center gap-1.5">
                    {cat.name}
                    {cat.badge && (
                      <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold">{cat.badge}</span>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-400">{cat.count} sản phẩm</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-purple-300 group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* Column 4: Digital Products & Courses */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm tracking-wider uppercase">
          <Sparkles className="w-4 h-4" />
          <span>Digital & Khóa Học</span>
        </div>
        <div className="space-y-2">
          {digitalCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/services/${cat.slug}`}
              onClick={onClose}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{cat.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-gray-200 group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                    {cat.name}
                  </div>
                  <div className="text-[11px] text-gray-400">{cat.count} mục</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-300 group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};
