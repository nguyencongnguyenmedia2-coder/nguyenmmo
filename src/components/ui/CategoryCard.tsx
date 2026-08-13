'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Flame } from 'lucide-react';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link
      href={`/services/${category.slug}`}
      className="group relative border-beam-card p-5 block transition-all duration-300"
    >
      {/* Background Subtle Radial Glow */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-neon-red/10 rounded-full blur-xl group-hover:bg-neon-red/20 transition-all"></div>

      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 group-hover:border-neon-red/40 group-hover:bg-neon-red/10 flex items-center justify-center text-2xl transition-all group-hover:scale-110 shadow-inner">
          {category.icon}
        </div>
        {category.badge && (
          <span className="px-2.5 py-0.5 rounded-full bg-neon-red/20 border border-neon-red/30 text-neon-red text-[11px] font-bold tracking-wide flex items-center gap-1">
            <Flame className="w-3 h-3 fill-neon-red" />
            {category.badge}
          </span>
        )}
      </div>

      <div className="relative z-10 space-y-1">
        <h3 className="text-base font-bold text-white group-hover:text-neon-red transition-colors flex items-center justify-between">
          <span>{category.name}</span>
          <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-neon-red group-hover:translate-x-1 transition-all" />
        </h3>
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
          {category.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400 relative z-10 font-mono">
        <span>{category.count}+ dịch vụ</span>
        <span className="text-neon-red font-semibold group-hover:underline">Khám phá →</span>
      </div>
    </Link>
  );
};
