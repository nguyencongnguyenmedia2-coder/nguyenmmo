'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeroSection } from '@/components/home/HeroSection';
import { WhyChooseUsSection } from '@/components/home/WhyChooseUsSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { FaqSection } from '@/components/home/FaqSection';
import { CtaSection } from '@/components/home/CtaSection';
import { CategoryCard } from '@/components/ui/CategoryCard';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { ReviewsSection } from '@/components/home/ReviewsSection';
import { MOCK_CATEGORIES } from '@/data/mockCategories';
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
  CheckCircle2, 
  ShieldCheck, 
  Activity,
  ChevronDown,
  Info,
  Layers,
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
        const res = await fetch('/api/blogs');
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
        const cachedBlogs = localStorage.getItem('nguyenmmo_blogs');
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

  const filterTabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'tiktok', label: 'TikTok' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'telegram', label: 'Telegram' },
    { id: 'ai', label: 'AI Tools' },
    { id: 'mmo', label: 'MMO & Proxy' },
  ];

  const filteredServices = homepageServices.filter((s) => {
    const matchesCategory = activeCategoryFilter === 'all' || s.category === activeCategoryFilter;
    const matchesSearch =
      searchFilter === '' ||
      s.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.description.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
          'reviewCount': '420',
          'bestRating': '5'
        }
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://nguyenmmo.com/#faq',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'Dịch vụ tại Nguyên MMO có an toàn cho tài khoản Facebook, TikTok không?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Hoàn toàn an toàn 100%. Tất cả các dịch vụ tương tác được xử lý qua hệ thống tài khoản thật, tốc độ tự nhiên và tuân thủ chính sách các nền tảng.'
            }
          },
          {
            '@type': 'Question',
            'name': 'Thời gian hệ thống kích hoạt đơn hàng là bao lâu?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Hệ thống tự động kích hoạt xử lý đơn hàng trong từ 5 giây đến 30 phút sau khi hoàn tất nạp tiền.'
            }
          }
        ]
      }
    ]
  };

  return (
    <article className="space-y-16 pt-4">
      {/* INJECT HOMEPAGE SPECIFIC JSON-LD SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageLdSchema) }}
      />

      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. WHY CHOOSE US SECTION */}
      <WhyChooseUsSection />

      {/* 3. CATEGORY SECTION ("DANH MỤC HỆ THỐNG") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" aria-label="Danh mục dịch vụ">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/15 text-neon-red font-bold text-xs mb-2 uppercase font-mono">
              <Zap className="w-3.5 h-3.5 text-neon-red fill-neon-red" />
              <span>DANH MỤC HỆ THỐNG</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              DỊCH VỤ DÀNH CHO MMO & BRANDING DẪN ĐẦU
            </h2>
          </div>
          <Link
            href="/services"
            className="text-xs sm:text-sm font-bold text-neon-red hover:underline flex items-center gap-1 font-mono"
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

      {/* 4. BEST SELLING SERVICES SECTION ("🔥 DỊCH VỤ BÁN CHẠY") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" aria-label="Dịch vụ bán chạy nhất">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/15 text-neon-red font-bold text-xs mb-2 uppercase font-mono">
              <Flame className="w-3.5 h-3.5 fill-neon-red animate-bounce" />
              <span>BEST SELLER 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              🔥 GÓI DỊCH VỤ BÁN CHẠY NHẤT HỆ THỐNG
            </h2>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Tìm kiếm dịch vụ Facebook, TikTok..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#0D0D14] border border-white/10 rounded-2xl text-xs text-white placeholder-gray-500 outline-none focus:border-white/30 transition-all"
            />
          </div>
        </div>

        {/* Filter Tabs với Border Beam */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 custom-scrollbar mb-6">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategoryFilter(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeCategoryFilter === tab.id
                  ? 'border-beam-pill text-white font-black'
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
          <div className="py-16 text-center border-beam-always p-8 space-y-3">
            <p className="text-gray-300 font-bold text-xs sm:text-sm">Chưa có dịch vụ khả dụng trong danh mục này.</p>
            <button
              onClick={() => {
                setActiveCategoryFilter('all');
                setSearchFilter('');
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl"
            >
              Hiển thị lại tất cả dịch vụ
            </button>
          </div>
        )}
      </section>

      {/* 5. HOW IT WORKS SECTION */}
      <HowItWorksSection />

      {/* 6. REVIEWS SECTION */}
      <ReviewsSection />

      {/* 7. BLOG & KHÓA HỌC HIGHLIGHTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" aria-label="Blog kiến thức MMO">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/15 text-neon-red font-bold text-xs mb-2 uppercase font-mono">
              <BookOpen className="w-3.5 h-3.5" />
              <span>KIẾN THỨC & THỰC CHIẾN</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              BLOG BÍ QUYẾT XÂY KÊNH & KHÓA HỌC MMO
            </h2>
          </div>
          <Link href="/blog" className="text-xs sm:text-sm font-bold text-neon-red hover:underline flex items-center gap-1 font-mono">
            <span>Xem tất cả bài viết</span>
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
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#0D0D14] border border-white/15 text-gray-200 text-[10px] font-bold rounded-lg uppercase font-mono">
                  {post.category}
                </div>
              </div>
              <div className="p-5 space-y-2">
                <div className="text-xs text-gray-400 font-mono flex items-center gap-3">
                  <span>{post.date}</span>
                  <span>•</span>
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

      {/* 8. FAQ SECTION */}
      <FaqSection />

      {/* 9. SEO DEEP KEYWORD CONTENT SECTION (VỀ NGUYÊN MMO DIGITAL MARKETPLACE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" aria-label="Giới thiệu Nguyên MMO">
        <div className="border-beam-always p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-neon-red" />
              <h2 className="text-lg font-black text-white">VỀ NGUYÊN MMO - HỆ THỐNG DỊCH VỤ DIGITAL & SMM HÀNG ĐẦU VIỆT NAM</h2>
            </div>
            <button
              onClick={() => setShowSeoContent(!showSeoContent)}
              className="text-xs font-bold text-sky-400 hover:underline flex items-center gap-1 font-mono"
            >
              <span>{showSeoContent ? 'Thu gọn nội dung' : 'Đọc thêm chi tiết SEO'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showSeoContent ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed">
            <strong className="text-white font-bold">Nguyên MMO</strong> là nền tảng thương mại điện tử chuyên cung cấp giải pháp Marketing mạng xã hội (SMM Panel), công cụ trí tuệ nhân tạo (AI Tools), Proxy dân cư IPv4/IPv6, VPS MMO và tài nguyên xây dựng kênh số tự động 24/7.
          </p>

          {showSeoContent && (
            <div className="pt-4 border-t border-white/10 space-y-4 text-xs text-gray-300 leading-relaxed animate-in fade-in">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white">1. Dịch Vụ Tăng Tương Tác Mạng Xã Hội (Facebook, TikTok, YouTube, Instagram)</h3>
                <p>
                  Cung cấp các gói buff follower Facebook cá nhân, Fanpage, tăng like bài viết, seeding bình luận tự nhiên, tăng tim video TikTok, tăng subscribe YouTube và member Telegram từ nguồn tài khoản người dùng thực tại Việt Nam. Xử lý tự động trong vòng 5–30 giây.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white">2. Tài Khoản AI & Phần Mềm MMO Thực Chiến</h3>
                <p>
                  Cung cấp tài khoản ChatGPT Plus (GPT-4o), Claude 3.5 Sonnet Pro, Midjourney v6 render 8K, Canva Pro vĩnh viễn và các phần mềm tự động nuôi dàn VIA, BM Facebook Ads chuẩn Pro.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white">3. Chính Sách Bảo Hành & Thanh Toán Tự Động VietQR</h3>
                <p>
                  Mọi đơn hàng đều đính kèm chính sách bảo hành tụt 1 đổi 1 hoặc refill tự động. Nạp tiền tự động qua VietQR Ngân hàng (Techcombank, MBBank) với tốc độ cộng số dư tức thì 24/7.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 10. CTA CONVERSION SECTION */}
      <CtaSection />
    </article>
  );
}
