'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { MOCK_CATEGORIES } from '@/data/mockCategories';
import { MOCK_SERVICES } from '@/data/mockServices';
import { Service } from '@/types';
import { ArrowLeft, Zap } from 'lucide-react';

export default function CategoryServicesPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const [servicesList, setServicesList] = useState<Service[]>([]);

  const ensureMinPrice = (list: Service[]): Service[] => {
    return list.map((s) => {
      const price = Math.max(250000, s.price || 250000);
      const salePrice = s.salePrice ? Math.max(250000, s.salePrice) : undefined;
      const vipPrice = s.vipPrice ? Math.max(250000, s.vipPrice) : undefined;
      return { ...s, price, salePrice, vipPrice };
    });
  };

  useEffect(() => {
    try {
      const cached = localStorage.getItem('nguyenmmo_services');
      if (cached) {
        const parsed: Service[] = JSON.parse(cached);
        const available = parsed.filter((s) => s.inStock !== false);
        if (available.length > 0) {
          setServicesList(ensureMinPrice(available));
          return;
        }
      }
    } catch (e) {}

    setServicesList(ensureMinPrice(MOCK_SERVICES.filter((s) => s.inStock !== false)));
  }, []);

  const category = MOCK_CATEGORIES.find((c) => c.slug === categorySlug);
  const services = servicesList.filter((s) => s.category === categorySlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb & Back */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-white">Trang chủ</Link>
        <span>/</span>
        <Link href="/services" className="hover:text-white">Dịch vụ</Link>
        <span>/</span>
        <span className="text-neon-red font-bold uppercase">{category?.name || categorySlug}</span>
      </div>

      {/* Category Banner */}
      <div className="p-8 rounded-3xl bg-[#0D0D14] border border-white/10 shadow-glass flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-neon-red/20 border border-neon-red/40 flex items-center justify-center text-4xl shadow-neon-red shrink-0">
          {category?.icon || '🚀'}
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <span>DỊCH VỤ {category?.name.toUpperCase() || categorySlug.toUpperCase()}</span>
          </h1>
          <p className="text-gray-300 text-sm">
            {category?.description || `Kho dịch vụ ${categorySlug} tự động 24/7 chất lượng cao.`}
          </p>
        </div>
      </div>

      {/* Services Grid */}
      {services.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white/5 border border-white/10 rounded-3xl space-y-3">
          <p className="text-gray-300 font-bold">Hiện chưa có dịch vụ mở bán cho danh mục này.</p>
          <Link
            href="/services"
            className="inline-block px-4 py-2 bg-neon-red text-white text-xs font-bold rounded-xl"
          >
            Xem tất cả dịch vụ
          </Link>
        </div>
      )}
    </div>
  );
}
