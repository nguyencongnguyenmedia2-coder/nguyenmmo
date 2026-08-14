'use client';

import React, { useState, useEffect } from 'react';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { MOCK_CATEGORIES } from '@/data/mockCategories';
import { MOCK_SERVICES } from '@/data/mockServices';
import { Service } from '@/types';
import { Search, Filter, Zap, Sparkles, ShieldCheck, RefreshCw, X, Layers } from 'lucide-react';

export default function ServicesPage() {
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');

  const ensureMinPrice = (list: Service[]): Service[] => {
    return list.map((s) => {
      const price = Math.max(250000, s.price || 250000);
      const salePrice = s.salePrice ? Math.max(250000, s.salePrice) : undefined;
      const vipPrice = s.vipPrice ? Math.max(250000, s.vipPrice) : undefined;
      return { ...s, price, salePrice, vipPrice };
    });
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const available = json.data.filter((s: Service) => s.inStock !== false);
          setServicesList(ensureMinPrice(available));
          return;
        }
      } catch (e) {}

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
    };

    fetchServices();
  }, []);

  const filteredServices = servicesList
    .filter((service) => {
      const matchCat = selectedCategory === 'all' || service.category === selectedCategory;
      const matchSearch =
        searchQuery === '' ||
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return (a.salePrice || a.price) - (b.salePrice || b.price);
      if (sortBy === 'price-high') return (b.salePrice || b.price) - (a.salePrice || a.price);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b.sold || 0) - (a.sold || 0);
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* 1. BANNER HEADER CHUYÊN NGHIỆP VỚI BORDER BEAM VIỀN CHẠY & BỎ LỚP SHADOW ĐỎ */}
      <div className="border-beam-always p-8 text-white space-y-4">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/15 text-neon-red font-extrabold text-xs tracking-wider uppercase font-mono">
            <Zap className="w-3.5 h-3.5 text-neon-red fill-neon-red" />
            <span>HỆ THỐNG DỊCH VỤ SMM & DIGITAL AUTOMATION</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            KHO DỊCH VỤ MMO & MẠNG XÃ HỘI TỰ ĐỘNG 24/7
          </h1>

          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Tất cả dịch vụ Facebook, TikTok, Instagram, YouTube, Telegram, AI Accounts & Proxy MMO. Xử lý tự động trong 5–30 giây, cam kết an toàn và hỗ trợ kỹ thuật 24/7.
          </p>
        </div>

        {/* Quick Stats Counter Bar */}
        <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="space-y-0.5">
            <div className="text-gray-400">Dịch vụ mở bán:</div>
            <div className="text-white font-black text-base">{servicesList.length}+ Gói</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-gray-400">Tốc độ kích hoạt:</div>
            <div className="text-emerald-400 font-black text-base">⚡ 5–30 Giây</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-gray-400">Bảo hành tụt:</div>
            <div className="text-sky-400 font-black text-base flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>1 Đổi 1 / Refill</span>
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-gray-400">Chế độ vận hành:</div>
            <div className="text-gold-400 font-black text-base">Tự động 24/7</div>
          </div>
        </div>
      </div>

      {/* 2. SEARCH & FILTER TOOLBAR */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 bg-[#0D0D14] border border-white/10 rounded-2xl">
        {/* Search Input */}
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên dịch vụ, TikTok, Facebook, Proxy..."
            className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-white/30"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          <span className="text-xs text-gray-400 font-bold flex items-center gap-1.5 font-mono">
            <Filter className="w-3.5 h-3.5 text-neon-red" /> Sắp xếp:
          </span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white outline-none focus:border-white/30"
          >
            <option value="popular" className="bg-[#0D0D14]">🔥 Phổ biến (Mua nhiều nhất)</option>
            <option value="price-low" className="bg-[#0D0D14]">💵 Giá từ thấp đến cao</option>
            <option value="price-high" className="bg-[#0D0D14]">💎 Giá từ cao đến thấp</option>
            <option value="rating" className="bg-[#0D0D14]">⭐ Đánh giá cao nhất</option>
          </select>
        </div>
      </div>

      {/* 3. CATEGORY PILLS SLIDER VỚI BORDER BEAM VIỀN CHẠY */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'border-beam-pill text-white font-black'
              : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          Tất cả dịch vụ ({servicesList.length})
        </button>

        {MOCK_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                isSelected
                  ? 'border-beam-pill text-white font-black'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Result Counter & Status */}
      <div className="flex items-center justify-between text-xs text-gray-400 font-mono pt-1">
        <div>
          Hiển thị <strong className="text-white">{filteredServices.length}</strong> / {servicesList.length} dịch vụ
        </div>
        {selectedCategory !== 'all' && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="text-neon-red hover:underline flex items-center gap-1 font-bold"
          >
            <RefreshCw className="w-3 h-3" /> Xem lại tất cả
          </button>
        )}
      </div>

      {/* 4. GRID SERVICES LIST */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center border-beam-always p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-gray-400">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Không tìm thấy dịch vụ phù hợp</h3>
            <p className="text-xs text-gray-400">Vui lòng thử tìm kiếm từ khóa khác hoặc thay đổi bộ lọc danh mục.</p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all"
          >
            Hiển thị lại toàn bộ dịch vụ
          </button>
        </div>
      )}
    </div>
  );
}
