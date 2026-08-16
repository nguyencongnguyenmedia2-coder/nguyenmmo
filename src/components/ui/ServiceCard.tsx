'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ShoppingCart, Zap, CheckCircle2, ShieldCheck, Flame, ArrowRight, Check } from 'lucide-react';
import { Service } from '@/types';
import { formatVND } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const displayPrice = service.salePrice || service.price;

  // Determine badge type based on service properties or index
  const getBadge = () => {
    if (service.featured) {
      return { text: '🔥 BÁN CHẠY', color: 'bg-neon-red text-white border-neon-red/50 shadow-neon-red' };
    }
    if (service.vipPrice && service.vipPrice < displayPrice) {
      return { text: '⭐ KHUYÊN DÙNG', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    }
    return { text: '⚡ KÍCH HOẠT NHANH', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
  };

  const badge = getBadge();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(service, 'https://example.com/link-demo', service.min || 1000);
    showToast(`Đã thêm "${service.name}" vào giỏ hàng!`, 'success');
  };

  return (
    <div className="group relative border-beam-card p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-white/30">
      
      {/* Top Header info */}
      <div className="space-y-3">
        
        {/* Badge & Category Row */}
        <div className="flex items-center justify-between gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-mono tracking-wider border ${badge.color}`}>
            {badge.text}
          </span>

          <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-400 uppercase font-mono">
            {service.category}
          </span>
        </div>

        {/* Service Icon & Title */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
            {service.icon || '🚀'}
          </div>

          <Link href={`/service/${service.slug}`} className="block flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-neon-red transition-colors line-clamp-2 leading-snug">
              {service.name}
            </h3>
          </Link>
        </div>

        {/* Rating & Sold count */}
        <div className="flex items-center justify-between text-xs text-gray-400 font-mono pt-1">
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-[11px] text-amber-300 ml-0.5">4.9</span>
          </div>

          <div className="flex items-center gap-1 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Đã bán: <strong className="text-gray-200">{(service.sold || 1284).toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Features list */}
        <div className="space-y-1.5 pt-2 border-t border-white/5 text-xs text-gray-300">
          <div className="flex items-center gap-2 text-[11px]">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Kích hoạt tự động 5-30s</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Bảo hành {service.warranty || '1 đổi 1'}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Hỗ trợ kỹ thuật 24/7</span>
          </div>
        </div>

      </div>

      {/* Footer Pricing & Actions */}
      <div className="pt-4 mt-3 border-t border-white/10 space-y-3">
        
        {/* Price display */}
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-[10px] text-gray-400 font-mono">Giá niêm yết:</div>
            <div className="text-lg sm:text-xl font-black text-neon-red tracking-tight font-mono">
              {formatVND(displayPrice)}
            </div>
          </div>

          {service.vipPrice && service.vipPrice < displayPrice && (
            <div className="text-right">
              <div className="text-[9px] text-amber-400 font-bold uppercase tracking-wider font-mono">
                GIÁ VIP MEMBER
              </div>
              <div className="text-xs font-black text-amber-300 font-mono">
                {formatVND(service.vipPrice)}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-5 gap-2">
          <Link
            href={`/service/${service.slug}`}
            className="col-span-4 py-2.5 px-3 bg-neon-red hover:bg-neon-red-hover text-white text-xs font-black rounded-xl btn-beam-touch text-center flex items-center justify-center gap-1.5 transition-all shadow-neon-red"
          >
            <span>MUA NGAY</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleQuickAdd}
            className="col-span-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-xl flex items-center justify-center transition-colors"
            title="Thêm nhanh vào giỏ hàng"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
