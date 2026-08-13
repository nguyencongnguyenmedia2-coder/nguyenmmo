'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryCard } from '@/components/ui/CategoryCard';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { ReviewsSection } from '@/components/home/ReviewsSection';
import { MOCK_CATEGORIES } from '@/data/mockCategories';
import { MOCK_SERVICES } from '@/data/mockServices';
import { MOCK_BLOGS } from '@/data/mockBlog';
import { BlogPost, Service } from '@/types';
import { Flame, Search, Sparkles, ArrowRight, Zap, BookOpen } from 'lucide-react';

export default function HomePage() {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [homepageBlogs, setHomepageBlogs] = useState<BlogPost[]>([]);
  const [homepageServices, setHomepageServices] = useState<Service[]>([]);

  useEffect(() => {
    // Sync Blogs
    try {
      const cachedBlogs = localStorage.getItem('nguyenmmo_blogs');
      if (cachedBlogs) {
        const blogsList: BlogPost[] = JSON.parse(cachedBlogs);
        const published = blogsList.filter((b) => b.published !== false);
        if (published.length > 0) {
          setHomepageBlogs(published.slice(0, 3));
        } else {
          setHomepageBlogs(MOCK_BLOGS.slice(0, 3));
        }
      } else {
        setHomepageBlogs(MOCK_BLOGS.slice(0, 3));
      }
    } catch (e) {
      setHomepageBlogs(MOCK_BLOGS.slice(0, 3));
    }

    // Sync Services Live from Supabase API & localStorage
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const available = json.data.filter((s: Service) => s.inStock !== false);
          setHomepageServices(available);
          return;
        }
      } catch (e) {}

      try {
        const cachedServices = localStorage.getItem('nguyenmmo_services');
        if (cachedServices) {
          const srvList: Service[] = JSON.parse(cachedServices);
          const available = srvList.filter((s) => s.inStock !== false);
          setHomepageServices(available);
          return;
        }
      } catch (e) {}

      setHomepageServices([]);
    };

    fetchServices();
  }, []);

  const filterTabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'tiktok', label: 'TikTok' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'telegram', label: 'Telegram' },
    { id: 'ai', label: 'AI Tools' },
    { id: 'mmo', label: 'MMO' },
  ];

  const filteredServices = homepageServices.filter((s) => {
    const matchesCategory = activeCategoryFilter === 'all' || s.category === activeCategoryFilter;
    const matchesSearch =
      searchFilter === '' ||
      s.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.description.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-16">
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. CATEGORY SECTION ("DỊCH VỤ NỔI BẬT") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-red/10 text-neon-red font-bold text-xs mb-2">
              <Zap className="w-3.5 h-3.5" />
              <span>DANH MỤC HỆ THỐNG</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              DỊCH VỤ NỔI BẬT
            </h2>
          </div>
          <Link
            href="/services"
            className="text-xs sm:text-sm font-bold text-neon-red hover:underline flex items-center gap-1"
          >
            <span>Xem tất cả ({MOCK_CATEGORIES.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {MOCK_CATEGORIES.slice(0, 8).map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* 3. BEST SELLING SERVICES SECTION ("🔥 DỊCH VỤ BÁN CHẠY") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-red/10 border border-neon-red/30 text-neon-red font-bold text-xs mb-2">
              <Flame className="w-3.5 h-3.5 fill-neon-red animate-bounce" />
              <span>BEST SELLER 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              🔥 DỊCH VỤ BÁN CHẠY
            </h2>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Tìm kiếm dịch vụ..."
              className="w-full pl-10 pr-4 py-2 bg-[#0D0D14] border border-white/10 rounded-2xl text-xs text-white placeholder-gray-500 outline-none focus:border-neon-red/50 transition-all"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 custom-scrollbar mb-6">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategoryFilter(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeCategoryFilter === tab.id
                  ? 'bg-neon-red text-white shadow-neon-red scale-105'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.id === 'all' && <Sparkles className="w-3.5 h-3.5 text-neon-red" />}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.slice(0, 9).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white/5 border border-white/10 rounded-3xl">
            <p className="text-gray-300 font-bold">Không tìm thấy dịch vụ nào cho bộ lọc này.</p>
            <button
              onClick={() => {
                setActiveCategoryFilter('all');
                setSearchFilter('');
              }}
              className="mt-3 px-4 py-2 bg-neon-red text-white text-xs font-bold rounded-xl"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </section>

      {/* 4. REVIEWS SECTION */}
      <ReviewsSection />

      {/* 5. BLOG & KHÓA HỌC HIGHLIGHTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-red/10 text-neon-red font-bold text-xs mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>KIẾN THỨC & KHÓA HỌC</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              BLOG & KHÓA HỌC MMO
            </h2>
          </div>
          <Link href="/blog" className="text-xs sm:text-sm font-bold text-neon-red hover:underline flex items-center gap-1">
            <span>Xem tất cả bài viết & khóa học</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {homepageBlogs.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group border-beam-card block overflow-hidden transition-all"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-neon-red text-white text-[10px] font-bold rounded-full uppercase shadow">
                  {post.category}
                </div>
              </div>
              <div className="p-5 space-y-2">
                <div className="text-xs text-gray-400 font-mono flex items-center gap-3">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-neon-red transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {post.summary}
                </p>
                <div className="pt-2 text-xs font-bold text-neon-red flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Đọc bài viết</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
