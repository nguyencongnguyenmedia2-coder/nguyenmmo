'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Heart, ShoppingCart, Zap, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';
import { Service } from '@/types';
import { formatVND } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { favorites, toggleFavorite } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const isFav = favorites.includes(service.id);

  const displayPrice = service.salePrice || service.price;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(service, 'https://example.com/link-demo', service.min || 1000);
    showToast(`Đã thêm "${service.name}" vào giỏ hàng!`, 'success');
  };

  return (
    <div className="group relative border-beam-card p-5 flex flex-col justify-between transition-all duration-300">
      {/* Top Header info */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
              {service.icon || '🚀'}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300 uppercase font-mono">
                  {service.category}
                </span>
                {service.warranty && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>{service.warranty}</span>
                  </span>
                )}
              </div>
              <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1 font-mono">
                <Zap className="w-3.5 h-3.5 text-neon-red" />
                <span>{service.eta || '⚡ Tự động 24/7'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(service.id);
            }}
            className={`p-2 rounded-full border transition-all ${
              isFav
                ? 'bg-neon-red/20 border-neon-red text-neon-red'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            title="Thêm vào yêu thích"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-neon-red' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <Link href={`/service/${service.slug}`} className="block">
          <h3 className="text-sm font-bold text-white group-hover:text-neon-red transition-colors line-clamp-2 leading-snug mb-2">
            {service.name}
          </h3>
        </Link>

        {/* Description Short */}
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3">
          {service.description}
        </p>

        {/* Min / Max Info Badge */}
        {(service.min || service.max) && (
          <div className="mb-3 px-2.5 py-1 bg-white/5 border border-white/5 rounded-lg text-[11px] text-gray-400 flex items-center justify-between font-mono">
            <span>Tối thiểu: <strong className="text-white">{(service.min || 1).toLocaleString()}</strong></span>
            <span>Tối đa: <strong className="text-white">{(service.max || 100000).toLocaleString()}</strong></span>
          </div>
        )}
      </div>

      {/* Footer stats & Pricing */}
      <div>
        {/* Rating & Sold */}
        <div className="flex items-center justify-between text-xs text-gray-400 pb-3 mb-3 border-b border-white/10 font-mono">
          <div className="flex items-center gap-1 text-gold-400 font-bold">
            <Star className="w-3.5 h-3.5 fill-gold-400" />
            <span>{service.rating || 5.0}</span>
            <span className="text-gray-500 font-normal">({service.reviewCount || 100})</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Đã bán: {(service.sold || 1000).toLocaleString()}</span>
          </div>
        </div>

        {/* Price display */}
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <div className="text-[11px] text-gray-400 font-mono">Giá niêm yết:</div>
            <div className="text-lg font-black text-neon-red tracking-tight">
              {formatVND(displayPrice)}
            </div>
          </div>
          {service.vipPrice && service.vipPrice < displayPrice && (
            <div className="text-right">
              <div className="text-[10px] text-gold-400 font-bold uppercase tracking-wider font-mono">
                GIÁ VIP MEMBER
              </div>
              <div className="text-xs font-black text-gold-300 font-mono">
                {formatVND(service.vipPrice)}
              </div>
            </div>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-5 gap-2">
          <Link
            href={`/service/${service.slug}`}
            className="col-span-4 py-2.5 px-3 bg-neon-red hover:bg-neon-red-hover text-white text-xs font-bold rounded-xl btn-beam-touch text-center hover:scale-[1.02] transition-transform flex items-center justify-center gap-1.5 overflow-hidden"
          >
            <span>ĐẶT DỊCH VỤ NGAY</span>
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
