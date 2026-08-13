'use client';

import React, { useState, useEffect } from 'react';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { MOCK_CATEGORIES } from '@/data/mockCategories';
import { MOCK_SERVICES } from '@/data/mockServices';
import { Service } from '@/types';
import { Search, Filter, Zap, Sparkles } from 'lucide-react';

export default function ServicesPage() {
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high'>('popular');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const available = json.data.filter((s: Service) => s.inStock !== false);
          setServicesList(available);
          return;
        }
      } catch (e) {}

      try {
        const cached = localStorage.getItem('nguyenmmo_services');
        if (cached) {
          const parsed: Service[] = JSON.parse(cached);
          const available = parsed.filter((s) => s.inStock !== false);
          setServicesList(available);
          return;
        }
      } catch (e) {}

      setServicesList([]);
    };

    fetchServices();
  }, []);

  const filteredServices = servicesList.filter((service) => {
    const matchCat = selectedCategory === 'all' || service.category === selectedCategory;
    const matchSearch =
      searchQuery === '' ||
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return (a.salePrice || a.price) - (b.salePrice || b.price);
    if (sortBy === 'price-high') return (b.salePrice || b.price) - (a.salePrice || a.price);
    return b.sold - a.sold;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-neon-red/20 via-purple-900/20 to-[#0D0D14] border border-neon-red/30 shadow-glass">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-red/20 text-neon-red text-xs font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>KHO DỊCH VỤ SMM & DIGITAL</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            TẤT CẢ DỊCH VỤ DÀNH CHO MMO
          </h1>
          <p className="text-gray-300 text-sm">
            Hệ thống xử lý tự động 24/7. Hơn 500+ dịch vụ tăng tương tác Facebook, TikTok, Instagram, YouTube, Telegram, AI Tools, Proxy & VPS.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 bg-[#0D0D14] border border-white/10 rounded-2xl">
        {/* Search */}
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên dịch vụ hoặc từ khóa..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-neon-red/50"
          />
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          <span className="text-xs text-gray-400 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Sắp xếp:
          </span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white outline-none"
          >
            <option value="popular" className="bg-[#0D0D14]">Phổ biến nhất</option>
            <option value="price-low" className="bg-[#0D0D14]">Giá từ thấp đến cao</option>
            <option value="price-high" className="bg-[#0D0D14]">Giá từ cao đến thấp</option>
          </select>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            selectedCategory === 'all'
              ? 'bg-neon-red text-white shadow-neon-red'
              : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
          }`}
        >
          Tất cả ({MOCK_SERVICES.length})
        </button>
        {MOCK_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === cat.slug
                ? 'bg-neon-red text-white shadow-neon-red'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Grid Services */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}
