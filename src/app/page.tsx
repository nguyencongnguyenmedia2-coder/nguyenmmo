'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { HeroSection } from '@/components/home/HeroSection';
import { WhyChooseUsSection } from '@/components/home/WhyChooseUsSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { FaqSection } from '@/components/home/FaqSection';
import { CtaSection } from '@/components/home/CtaSection';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { ReviewsSection } from '@/components/home/ReviewsSection';
import { MOCK_BLOGS } from '@/data/mockBlog';
import { MOCK_SERVICES } from '@/data/mockServices';
import { BlogPost, Service } from '@/types';
import { 
  Flame, 
  Search, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  BookOpen, 
  ChevronDown,
  Award
} from 'lucide-react';

export default function HomePage() {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [homepageBlogs, setHomepageBlogs] = useState<BlogPost[]>([]);
  const [homepageServices, setHomepageServices] = useState<Service[]>([]);
  const [showSeoContent, setShowSeoContent] = useState(false);

  const ensureMinPrice = (list: Service[]): Service[] => {
    return list.map((s) => {
      const price = Math.max(250000, s.price || 250000);
      const salePrice = s.salePrice ? Math.max(250000, s.salePrice) : undefined;
      const vipPrice = s.vipPrice ? Math.max(250000, s.vipPrice) : undefined;
      return { ...s, price, salePrice, vipPrice };
    });
  };

  useEffect(() => {
    // Sync Blogs live from /api/blogs
    const fetchHomepageBlogs = async () => {
      try {
        const res = await fetch('/api/blogs?summary=true');
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const published = json.data.filter((b: BlogPost) => b.published !== false);
          if (published.length > 0) {
            setHomepageBlogs(published.slice(0, 3));
            return;
          }
        }
      } catch (e) {}

      try {
        const cachedBlogs = localStorage.getItem('nguyenmmo_blogs_summary') || localStorage.getItem('nguyenmmo_blogs');
        if (cachedBlogs) {
          const blogsList: BlogPost[] = JSON.parse(cachedBlogs);
          const published = blogsList.filter((b) => b.published !== false);
          if (published.length > 0) {
            setHomepageBlogs(published.slice(0, 3));
            return;
          }
        }
      } catch (e) {}

      setHomepageBlogs(MOCK_BLOGS.slice(0, 3));
    };

    fetchHomepageBlogs();

    // Sync Services Live from Supabase API & localStorage
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const available = json.data.filter((s: Service) => s.inStock !== false);
          setHomepageServices(ensureMinPrice(available));
          return;
        }
      } catch (e) {}

      try {
        const cachedServices = localStorage.getItem('nguyenmmo_services');
        if (cachedServices) {
          const srvList: Service[] = JSON.parse(cachedServices);
          const available = srvList.filter((s) => s.inStock !== false);
          if (available.length > 0) {
            setHomepageServices(ensureMinPrice(available));
            return;
          }
        }
      } catch (e) {}

      setHomepageServices(ensureMinPrice(MOCK_SERVICES.filter((s) => s.inStock !== false)));
    };

    fetchServices();
  }, []);

  // Category filter tabs as specified in prompt: Tất cả, MMO, Social Media, AI Tools, Proxy, VPS
  const categoryTabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'mmo', label: 'MMO' },
    { id: 'social', label: 'Social Media' },
    { id: 'ai', label: 'AI Tools' },
    { id: 'proxy', label: 'Proxy' },
    { id: 'vps', label: 'VPS' },
  ];

  // Realtime search and category filtering logic
  const filteredServices = useMemo(() => {
    return homepageServices.filter((s) => {
      let matchesCat = true;
      if (activeCategoryFilter === 'mmo') {
        matchesCat = s.category?.toLowerCase().includes('mmo') || s.category?.toLowerCase().includes('facebook') || s.category?.toLowerCase().includes('via');
      } else if (activeCategoryFilter === 'social') {
        matchesCat = s.category?.toLowerCase().includes('facebook') || s.category?.toLowerCase().includes('tiktok') || s.category?.toLowerCase().includes('instagram') || s.category?.toLowerCase().includes('youtube') || s.category?.toLowerCase().includes('telegram');
      } else if (activeCategoryFilter === 'ai') {
        matchesCat = s.category?.toLowerCase().includes('ai') || s.name.toLowerCase().includes('chatgpt') || s.name.toLowerCase().includes('claude');
      } else if (activeCategoryFilter === 'proxy') {
        matchesCat = s.category?.toLowerCase().includes('proxy') || s.name.toLowerCase().includes('proxy');
      } else if (activeCategoryFilter === 'vps') {
        matchesCat = s.category?.toLowerCase().includes('vps') || s.name.toLowerCase().includes('vps');
      }

      const matchesSearch =
        searchFilter === '' ||
        s.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        s.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
        s.category?.toLowerCase().includes(searchFilter.toLowerCase());

      return matchesCat && matchesSearch;
    });
  }, [homepageServices, activeCategoryFilter, searchFilter]);

  // HOMEPAGE JSON-LD SCHEMA FOR RICH GOOGLE SEARCH SNIPPETS
  const homepageLdSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://nguyenmmo.com/#organization',
        'name': 'Nguyên MMO',
        'url': 'https://nguyenmmo.com',
        'logo': 'https://nguyenmmo.com/logo.png',
        'description': 'Nền tảng dịch vụ Digital, MMO & Mạng xã hội tự động hóa 24/7 uy tín hàng đầu Việt Nam.',
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.9',
          'reviewCount': '500',
          'bestRating': '5'
        }
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://nguyenmmo.com/#faq',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'Dịch vụ được kích hoạt trong bao lâu?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Hệ thống tự động kích hoạt xử lý đơn hàng chỉ trong 5 đến 30 giây ngay sau khi nạp tiền/đặt đơn hoàn tất.'
            }
          },
          {
            '@type': 'Question',
            'name': 'NGUYÊN MMO có hỗ trợ sau khi mua không?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Có. Đội ngũ kĩ thuật viên túc trực 24/7 qua Telegram và Zalo để tư vấn và hỗ trợ 1-1 cho khách hàng.'
            }
          }
        ]
      }
    ]
  };

  return (
    <article className="space-y-16 pt-2">
      {/* INJECT HOMEPAGE SPECIFIC JSON-LD SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageLdSchema) }}
      />

      {/* 1. HERO SECTION & TRUST/STATS */}
      <HeroSection />

      {/* 2. WHY CHOOSE US SECTION */}
      <WhyChooseUsSection />

      {/* 3. DISCOVER SERVICES & REALTIME SEARCH & CATEGORY TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8" aria-label="Khám phá dịch vụ Digital">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/15 text-neon-red font-bold text-xs uppercase font-mono">
            <Zap className="w-3.5 h-3.5 text-neon-red fill-neon-red" />
            <span>KHO DỊCH VỤ CÔNG NGHỆ & MMO</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            DỊCH VỤ DIGITAL HÀNG ĐẦU
          </h2>

          <p className="text-gray-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Tất cả công cụ và dịch vụ cần thiết để phát triển hệ sinh thái Digital của bạn.
          </p>
        </div>

        {/* Realtime Search Box */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="🔎 Tìm TikTok, Facebook, YouTube, Proxy, VPS..."
              className="w-full pl-12 pr-10 py-3.5 sm:py-4 bg-[#0A0A0F] border border-white/15 rounded-2xl text-xs sm:text-sm text-white placeholder-gray-500 outline-none focus:border-neon-red focus:ring-1 focus:ring-neon-red transition-all shadow-inner"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white bg-white/10 w-5 h-5 rounded-full flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategoryFilter(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeCategoryFilter === tab.id
                  ? 'bg-neon-red text-white shadow-neon-red scale-105'
                  : 'bg-[#0D0D14] border border-white/10 text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.id === 'all' && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* BEST SELLER PRODUCT SECTION & GRID */}
        <div className="space-y-6 pt-4">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-neon-red fill-neon-red animate-bounce" />
              <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
                🔥 GÓI DỊCH VỤ BÁN CHẠY NHẤT
              </h3>
            </div>

            <Link
              href="/services"
              className="text-xs sm:text-sm font-bold text-neon-red hover:underline flex items-center gap-1 font-mono"
            >
              <span>Xem tất cả dịch vụ</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Product Grid (3 cols PC / 2 cols Tablet / 1 col Mobile) */}
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.slice(0, 9).map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-[#0D0D14] border border-white/10 rounded-3xl space-y-4 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-400">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-gray-300 font-bold text-xs sm:text-sm">Không tìm thấy dịch vụ nào phù hợp với tìm kiếm của bạn.</p>
              <button
                onClick={() => {
                  setActiveCategoryFilter('all');
                  setSearchFilter('');
                }}
                className="px-5 py-2.5 bg-neon-red hover:bg-neon-red-hover text-white text-xs font-bold rounded-xl shadow-neon-red transition-all"
              >
                Xóa bộ lọc & xem tất cả
              </button>
            </div>
          )}

        </div>

      </section>

      {/* 4. ORDER PROCESS TIMELINE */}
      <HowItWorksSection />

      {/* 5. SOCIAL PROOF & REVIEWS */}
      <ReviewsSection />

      {/* 6. BLOG & DIGITAL KNOWLEDGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6" aria-label="Blog kiến thức Digital">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/15 text-neon-red font-bold text-xs mb-2 uppercase font-mono">
              <BookOpen className="w-3.5 h-3.5" />
              <span>CẬP NHẬT KIẾN THỨC BỨT PHÁ</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              BLOG & KIẾN THỨC DIGITAL
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Cập nhật kiến thức MMO, Marketing, AI và Social Media.
            </p>
          </div>

          <Link href="/blog" className="text-xs sm:text-sm font-bold text-neon-red hover:underline flex items-center gap-1 font-mono shrink-0">
            <span>XEM TẤT CẢ BÀI VIẾT</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar text-xs font-mono">
          {['MMO', 'Marketing', 'TikTok', 'Facebook', 'AI'].map((tag) => (
            <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-300 font-bold">
              #{tag}
            </span>
          ))}
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {homepageBlogs.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group border-beam-card block overflow-hidden transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden bg-black/40">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#0D0D14]/90 backdrop-blur-md border border-white/15 text-neon-red text-[10px] font-bold rounded-lg uppercase font-mono">
                  {post.category}
                </div>
              </div>
              <div className="p-5 space-y-2">
                <div className="text-xs text-gray-400 font-mono flex items-center justify-between">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-neon-red transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {post.summary}
                </p>
                <div className="pt-2 text-xs font-bold text-neon-red flex items-center gap-1 group-hover:translate-x-1 transition-transform font-mono">
                  <span>Đọc chi tiết</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <FaqSection />

      {/* 8. SEO DEEP CONTENT ACCORDION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" aria-label="Giới thiệu Nguyên MMO">
        <div className="border-beam-always p-6 sm:p-8 space-y-4 rounded-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-neon-red" />
              <h2 className="text-sm sm:text-base font-black text-white uppercase">VỀ NGUYÊN MMO - DIGITAL SERVICE PLATFORM</h2>
            </div>
            <button
              onClick={() => setShowSeoContent(!showSeoContent)}
              className="text-xs font-bold text-sky-400 hover:underline flex items-center gap-1 font-mono"
            >
              <span>{showSeoContent ? 'Thu gọn' : 'Đọc thêm'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showSeoContent ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed">
            <strong className="text-white font-bold">Nguyên MMO</strong> là nền tảng thương mại dịch vụ số chuyên cung cấp giải pháp Marketing mạng xã hội (SMM Panel), công cụ trí tuệ nhân tạo (AI Tools), Proxy dân cư IPv4/IPv6, VPS MMO và tài nguyên xây dựng hệ sinh thái kinh doanh tự động 24/7.
          </p>

          {showSeoContent && (
            <div className="pt-4 border-t border-white/10 space-y-4 text-xs text-gray-300 leading-relaxed animate-in fade-in">
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-white">1. Dịch Vụ Tương Tác Mạng Xã Hội (Facebook, TikTok, YouTube, Instagram, Telegram)</h3>
                <p>
                  Cung cấp các gói buff follower Facebook cá nhân, Fanpage, tăng like bài viết, seeding bình luận tự nhiên, tăng tim video TikTok, tăng subscribe YouTube và member Telegram từ nguồn tài khoản người dùng thực tại Việt Nam. Xử lý tự động trong vòng 5–30 giây.
                </p>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-white">2. Tài Khoản AI & Phần Mềm MMO Thực Chiến</h3>
                <p>
                  Cung cấp tài khoản ChatGPT Plus (GPT-4o), Claude 3.5 Sonnet Pro, Midjourney v6 render 8K, Canva Pro vĩnh viễn và các phần mềm tự động nuôi dàn VIA, BM Facebook Ads chuẩn Pro.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 9. FINAL CTA BLOCK */}
      <CtaSection />
    </article>
  );
}
