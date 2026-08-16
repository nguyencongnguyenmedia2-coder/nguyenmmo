'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { MOCK_CATEGORIES } from '@/data/mockCategories';
import { MOCK_SERVICES } from '@/data/mockServices';
import { Service } from '@/types';
import { ArrowLeft, Zap, ShieldCheck, Search, Filter, Sparkles } from 'lucide-react';

export default function CategoryServicesPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const ensureMinPrice = (list: Service[]): Service[] => {
    return list.map((s) => {
      if (s.price === 0 || s.category === 'web-app-design') {
        return { ...s, price: 0, salePrice: 0, vipPrice: 0 };
      }
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
  const services = servicesList
    .filter((s) => s.category === categorySlug)
    .filter((s) =>
      searchQuery === '' ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Breadcrumb & Back Link */}
      <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-white">Trang chủ</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-white">Dịch vụ</Link>
          <span>/</span>
          <span className="text-neon-red font-bold uppercase">{category?.name || categorySlug}</span>
        </div>

        <Link
          href="/services"
          className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Xem tất cả danh mục
        </Link>
      </div>

      {/* 1. CATEGORY HEADER BANNER VỚI BORDER BEAM VIỀN CHẠY & BỎ LỚP SHADOW ĐỎ */}
      <div className="border-beam-always p-8 text-white space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center text-4xl shrink-0">
            {category?.icon || '🚀'}
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-neon-red text-[11px] font-bold font-mono uppercase">
              <Zap className="w-3.5 h-3.5 text-neon-red fill-neon-red" />
              <span>DANH MỤC DỊCH VỤ {category?.name.toUpperCase() || categorySlug.toUpperCase()}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              TẤT CẢ GÓI DỊCH VỤ {category?.name.toUpperCase() || categorySlug.toUpperCase()}
            </h1>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
              {category?.description || `Kho dịch vụ ${categorySlug} hệ thống xử lý tự động 24/7 chất lượng cao, an toàn và ổn định tuyệt đối.`}
            </p>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="space-y-0.5">
            <div className="text-gray-400">Số gói dịch vụ:</div>
            <div className="text-white font-black text-sm">{services.length} Gói dịch vụ</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-gray-400">Thời gian kích hoạt:</div>
            <div className="text-emerald-400 font-black text-sm">⚡ 5 – 30 phút</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-gray-400">Bảo hành hệ thống:</div>
            <div className="text-sky-400 font-black text-sm flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>1 Đổi 1 / Tự động</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SEARCH BAR TRONG DANH MỤC */}
      <div className="flex items-center justify-between gap-4 p-4 bg-[#0D0D14] border border-white/10 rounded-2xl">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Tìm nhanh gói dịch vụ ${category?.name || categorySlug}...`}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-white/30"
          />
        </div>

        <div className="text-xs text-gray-400 font-mono hidden sm:block">
          Đang hiển thị: <strong className="text-white">{services.length}</strong> dịch vụ
        </div>
      </div>

      {/* 3. SERVICES GRID LIST */}
      {services.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center border-beam-always p-8 space-y-4">
          <p className="text-gray-300 font-bold text-sm">Hiện chưa có dịch vụ mở bán hoặc không tìm thấy kết quả tìm kiếm.</p>
          <Link
            href="/services"
            className="inline-block px-5 py-2.5 bg-neon-red text-white text-xs font-bold rounded-xl btn-beam-touch"
          >
            Xem tất cả các dịch vụ khác
          </Link>
        </div>
      )}
    </div>
  );
}
