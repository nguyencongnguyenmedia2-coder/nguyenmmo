'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { MOCK_BLOGS } from '@/data/mockBlog';
import { BlogPost } from '@/types';
import { 
  BookOpen, 
  Search, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  Sparkles, 
  Eye, 
  SlidersHorizontal,
  Flame,
  Send,
  CheckCircle2,
  Zap,
  Bookmark,
  Layers,
  Compass
} from 'lucide-react';

export default function BlogPage() {
  const [blogsList, setBlogsList] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'views' | 'featured'>('latest');

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/blogs?summary=true');
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setBlogsList(json.data);
          try {
            localStorage.setItem('nguyenmmo_blogs_summary', JSON.stringify(json.data));
          } catch (e) {}
          setIsLoading(false);
          return;
        }
      } catch (e) {}

      try {
        const cached = localStorage.getItem('nguyenmmo_blogs_summary') || localStorage.getItem('nguyenmmo_blogs');
        if (cached) {
          setBlogsList(JSON.parse(cached));
        } else {
          setBlogsList(MOCK_BLOGS.map((b) => ({ ...b, published: true })));
        }
      } catch (e) {
        setBlogsList(MOCK_BLOGS.map((b) => ({ ...b, published: true })));
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const categories = useMemo(() => [
    'all', 
    'Thủ thuật Facebook', 
    'AI Automation', 
    'MMO Thực chiến', 
    'Khóa học', 
    'Mẹo TikTok', 
    'Giải pháp Digital'
  ], []);

  const publishedBlogs = useMemo(() => {
    return blogsList.filter((b) => b.published !== false);
  }, [blogsList]);

  // Featured article spotlight
  const featuredPost = useMemo(() => {
    return publishedBlogs.find((b) => b.featured) || publishedBlogs[0];
  }, [publishedBlogs]);

  // Filtered & Sorted Blogs
  const filteredAndSorted = useMemo(() => {
    let result = publishedBlogs.filter((post) => {
      const matchCat = selectedCat === 'all' || post.category === selectedCat;
      const matchSearch =
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.tags && post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchCat && matchSearch;
    });

    if (sortBy === 'views') {
      result.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === 'featured') {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return result;
  }, [publishedBlogs, selectedCat, searchQuery, sortBy]);

  // Top trending sidebar articles
  const trendingPosts = useMemo(() => {
    return [...publishedBlogs].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4);
  }, [publishedBlogs]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* 🚀 PAGE HERO HEADER */}
      <div className="relative rounded-3xl p-6 sm:p-10 border border-white/10 bg-gradient-to-br from-[#0F0F1A] via-[#121225] to-[#0A0A10] overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-neon-red/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-red/10 border border-neon-red/30 text-neon-red font-bold text-xs shadow-neon-red tracking-wide">
            <Sparkles className="w-4 h-4 animate-pulse text-amber-400" />
            <span>KHO TRI THỨC MMO & AUTOMATION HÀNG ĐẦU 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            BLOG & KHÓA HỌC <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-red via-pink-400 to-amber-300">NGUYÊN MMO</span>
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl font-medium">
            Tổng hợp bí quyết nuôi VIA/BM Facebook Ads, xây kênh TikTok triệu view, tối ưu phễu AI Automation và lộ trình kiếm 1.000$+ thụ động từ Affiliate Marketing.
          </p>

          {/* Search & Sort Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm thủ thuật Facebook, TikTok, AI Automation..."
                className="w-full pl-11 pr-8 py-3 bg-[#05050A]/90 border border-white/15 rounded-2xl text-xs sm:text-sm text-white placeholder-gray-500 outline-none focus:border-neon-red focus:ring-1 focus:ring-neon-red transition-all shadow-inner"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white bg-white/10 w-5 h-5 rounded-full flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative bg-[#05050A]/90 border border-white/15 rounded-2xl px-3 py-2 flex items-center gap-2 shrink-0">
                <SlidersHorizontal className="w-4 h-4 text-neon-red" />
                <span className="text-[11px] text-gray-400 font-medium">Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs text-white font-bold outline-none cursor-pointer pr-1"
                >
                  <option value="latest" className="bg-[#0D0D14] text-white">Mới nhất</option>
                  <option value="views" className="bg-[#0D0D14] text-white">Lượt xem cao</option>
                  <option value="featured" className="bg-[#0D0D14] text-white">Nổi bật</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 FEATURED SPOTLIGHT ARTICLE (Hero Banner Magazine Style) */}
      {featuredPost && !searchQuery && selectedCat === 'all' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 font-mono uppercase tracking-wider">
            <Flame className="w-4 h-4 text-neon-red animate-bounce" />
            <span>Bài Viết Nổi Bật Tiêu Điểm</span>
          </div>

          <Link
            href={`/blog/${featuredPost.slug}`}
            className="group block relative border-beam-always rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-neon-red/20"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Image Col */}
              <div className="lg:col-span-7 relative min-h-[260px] sm:min-h-[340px] overflow-hidden bg-black/50">
                <img
                  src={featuredPost.thumbnail}
                  alt={featuredPost.title}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D14] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0D0D14]"></div>
                
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3.5 py-1 bg-neon-red text-white text-[11px] font-black rounded-full uppercase shadow-neon-red tracking-wider">
                    ★ FEATURED
                  </span>
                  <span className="px-3 py-1 bg-black/70 backdrop-blur-md border border-white/15 text-white text-[11px] font-bold rounded-full">
                    {featuredPost.category}
                  </span>
                </div>
              </div>

              {/* Info Col */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4 bg-[#0D0D14]">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
                    <span>{featuredPost.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-gray-300">
                      <Clock className="w-3.5 h-3.5 text-neon-red" />
                      {featuredPost.readTime}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <Eye className="w-3.5 h-3.5" />
                      {(featuredPost.views || 0).toLocaleString()} lượt xem
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-neon-red transition-colors leading-snug">
                    {featuredPost.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-gray-300 line-clamp-3 leading-relaxed font-medium">
                    {featuredPost.summary}
                  </p>

                  {/* Tags */}
                  {featuredPost.tags && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {featuredPost.tags.slice(0, 3).map((t) => (
                        <span key={t} className="px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-gray-400 font-mono">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {featuredPost.authorAvatar ? (
                      <img src={featuredPost.authorAvatar} alt={featuredPost.author} className="w-8 h-8 rounded-full border border-neon-red/50 object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-neon-red/20 border border-neon-red/40 flex items-center justify-center font-bold text-neon-red text-xs">
                        N
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-bold text-white leading-none">{featuredPost.author}</div>
                      <div className="text-[10px] text-gray-400 leading-tight mt-0.5">{featuredPost.authorRole || 'Tác giả MMO'}</div>
                    </div>
                  </div>

                  <div className="px-4 py-2 bg-neon-red group-hover:bg-neon-red-hover text-white text-xs font-bold rounded-xl btn-beam-touch flex items-center gap-1.5 shadow-neon-red transition-all">
                    <span>Đọc chi tiết</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* 🏷️ CATEGORY FILTER CHIPS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-300 font-mono uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-neon-red" />
            <span>Danh Mục Bài Viết & Khóa Học</span>
          </h3>
          <span className="text-xs text-gray-400 font-mono">
            {filteredAndSorted.length} bài viết
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {categories.map((cat) => {
            const count = cat === 'all' 
              ? publishedBlogs.length 
              : publishedBlogs.filter(b => b.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  selectedCat === cat
                    ? 'bg-neon-red text-white shadow-neon-red scale-105'
                    : 'bg-[#0D0D14] border border-white/10 text-gray-300 hover:text-white hover:border-white/25 hover:bg-white/5'
                }`}
              >
                <span>{cat === 'all' ? 'Tất cả bài viết' : cat}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  selectedCat === cat ? 'bg-black/30 text-white' : 'bg-white/10 text-gray-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 📰 MAIN CONTENT GRID WITH SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Blog Grid */}
        <div className="lg:col-span-8 space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-[#0D0D14] border border-white/10 rounded-3xl p-5 space-y-4 animate-pulse">
                  <div className="h-48 bg-white/5 rounded-2xl"></div>
                  <div className="h-4 bg-white/10 rounded w-1/3"></div>
                  <div className="h-6 bg-white/10 rounded w-5/6"></div>
                  <div className="h-4 bg-white/5 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : filteredAndSorted.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAndSorted.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group border-beam-card flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="space-y-3">
                    {/* Thumbnail */}
                    <div className="relative h-48 sm:h-52 overflow-hidden bg-black/40">
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D14] via-transparent to-transparent opacity-80"></div>
                      
                      <div className="absolute top-3 left-3 px-3 py-1 bg-neon-red/90 backdrop-blur-md text-white text-[10px] font-black rounded-full uppercase shadow-neon-red tracking-wider">
                        {post.category}
                      </div>

                      <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-md text-emerald-400 text-[10px] font-bold rounded-full border border-white/10 flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{(post.views || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Body Info */}
                    <div className="p-5 space-y-3">
                      <div className="text-xs text-gray-400 font-mono flex items-center justify-between">
                        <span>{post.date}</span>
                        <span className="flex items-center gap-1 text-gray-300">
                          <Clock className="w-3 h-3 text-neon-red" />
                          {post.readTime}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-neon-red transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed font-normal">
                        {post.summary}
                      </p>

                      {/* Tags */}
                      {post.tags && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {post.tags.slice(0, 2).map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-gray-400 font-mono">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-white/5">
                    <div className="flex items-center gap-2">
                      {post.authorAvatar ? (
                        <img src={post.authorAvatar} alt={post.author} className="w-6 h-6 rounded-full border border-neon-red/40 object-cover" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-neon-red/20 text-neon-red text-[10px] font-bold flex items-center justify-center">
                          N
                        </div>
                      )}
                      <span className="text-xs text-gray-300 font-medium">{post.author || 'Nguyên MMO'}</span>
                    </div>

                    <div className="text-xs font-bold text-neon-red flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Đọc tiếp</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-[#0D0D14] border border-white/10 rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-400">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-gray-300 font-bold text-sm">Không tìm thấy bài viết nào phù hợp với tìm kiếm của bạn.</p>
              <button
                onClick={() => {
                  setSelectedCat('all');
                  setSearchQuery('');
                  setSortBy('latest');
                }}
                className="px-5 py-2.5 bg-neon-red hover:bg-neon-red-hover text-white text-xs font-bold rounded-xl shadow-neon-red transition-all"
              >
                Xóa bộ lọc & xem tất cả
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar Widget */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Widget 1: Trending Popular Posts */}
          <div className="p-6 bg-[#0D0D14] border border-white/10 rounded-3xl space-y-4 shadow-glass">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <TrendingUp className="w-4 h-4 text-neon-red" />
                <span>BÀI VIẾT XEM NHIỀU NHẤT</span>
              </div>
              <span className="px-2 py-0.5 bg-neon-red/20 text-neon-red text-[10px] font-mono font-bold rounded-full">
                TOP READS
              </span>
            </div>

            <div className="space-y-4">
              {trendingPosts.map((trend, index) => (
                <Link
                  key={trend.id}
                  href={`/blog/${trend.slug}`}
                  className="group flex gap-3 items-center p-2 rounded-2xl hover:bg-white/5 transition-all"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-black/40">
                    <img src={trend.thumbnail} alt={trend.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute top-0 left-0 w-5 h-5 bg-neon-red text-white text-[10px] font-black flex items-center justify-center rounded-br-lg">
                      #{index + 1}
                    </div>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-200 group-hover:text-neon-red transition-colors line-clamp-2 leading-snug">
                      {trend.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                      <span>{trend.date}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                        <Eye className="w-3 h-3" />
                        {(trend.views || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Widget 2: Join Telegram / Zalo Community Box */}
          <div className="border-beam-always p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-neon-red/20 border border-neon-red/40 flex items-center justify-center text-neon-red shrink-0">
                <Send className="w-6 h-6 fill-neon-red text-neon-red animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">GIA NHẬP CỘNG ĐỒNG MMO</h4>
                <p className="text-xs text-gray-300 mt-0.5">
                  Nhận Tut/Trick Facebook Ads, cấu hình AI & mã giảm giá dịch vụ độc quyền.
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-300 pt-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Cập nhật bão quét Facebook & TikTok 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Chia sẻ Prompt AI & Tool nuôi VIA miễn phí</span>
              </div>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-2">
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <span>Telegram Group</span>
              </a>
              <a
                href="https://zalo.me"
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <span>Zalo VIP Group</span>
              </a>
            </div>
          </div>

          {/* Widget 3: Quick Stats Banner */}
          <div className="p-6 bg-[#0D0D14] border border-white/10 rounded-3xl space-y-4">
            <h4 className="text-xs font-mono uppercase text-gray-400 font-bold tracking-wider">THỐNG KÊ CỦA NGUYÊN MMO</h4>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                <div className="text-lg font-black text-neon-red">500+</div>
                <div className="text-[10px] text-gray-400 font-medium">Bài viết & Tut Trick</div>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                <div className="text-lg font-black text-amber-400">100K+</div>
                <div className="text-[10px] text-gray-400 font-medium">Lượt đọc mỗi tháng</div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
