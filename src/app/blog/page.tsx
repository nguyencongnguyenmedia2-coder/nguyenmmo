'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MOCK_BLOGS } from '@/data/mockBlog';
import { BlogPost } from '@/types';
import { 
  BookOpen, Search, Clock, ArrowRight, Sparkles, Eye, TrendingUp, 
  Share2, Bookmark, CheckCircle2, Flame, Layers, Tag, X, ChevronRight, MessageSquareCode
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function BlogPage() {
  const { showToast } = useToast();
  const [blogsList, setBlogsList] = useState<BlogPost[]>([]);
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const cached = localStorage.getItem('nguyenmmo_blogs');
      if (cached) {
        setBlogsList(JSON.parse(cached));
      } else {
        setBlogsList(MOCK_BLOGS.map((b) => ({ ...b, published: true })));
      }

      const savedBookmarks = localStorage.getItem('nguyenmmo_blog_bookmarks');
      if (savedBookmarks) {
        setBookmarkedIds(JSON.parse(savedBookmarks));
      }
    } catch (e) {
      setBlogsList(MOCK_BLOGS.map((b) => ({ ...b, published: true })));
    }
  }, []);

  const toggleBookmark = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    let updated: string[];
    if (bookmarkedIds.includes(id)) {
      updated = bookmarkedIds.filter((bId) => bId !== id);
      showToast('Đã xóa khỏi danh sách bài viết đã lưu', 'info');
    } else {
      updated = [...bookmarkedIds, id];
      showToast('Đã lưu bài viết vào mục yêu thích!', 'success');
    }
    setBookmarkedIds(updated);
    try {
      localStorage.setItem('nguyenmmo_blog_bookmarks', JSON.stringify(updated));
    } catch (e) {}
  };

  const categories = [
    { name: 'all', label: 'Tất cả bài viết', icon: Layers },
    { name: 'Thủ thuật Facebook', label: 'Facebook Ads & VIA', icon: Sparkles },
    { name: 'AI Automation', label: 'AI & Automation', icon: MessageSquareCode },
    { name: 'MMO Thực chiến', label: 'MMO & Affiliate', icon: TrendingUp },
    { name: 'Khóa học', label: 'Khóa Học Thực Chiến', icon: BookOpen },
    { name: 'Mẹo TikTok', label: 'Mẹo TikTok & Reels', icon: Flame },
    { name: 'Giải pháp Digital', label: 'Giải Pháp Digital', icon: Tag },
  ];

  const publishedBlogs = blogsList.filter((b) => b.published !== false);

  // Top featured post
  const featuredPost = publishedBlogs.find((b) => b.featured) || publishedBlogs[0];

  // Filtered posts list
  const filtered = publishedBlogs.filter((post) => {
    const matchCat = selectedCat === 'all' || post.category === selectedCat;
    const matchSearch =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Top viewed / popular posts for sidebar
  const popularPosts = [...publishedBlogs].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-neon-red/10 via-purple-900/5 to-transparent pointer-events-none blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* HERO HEADER SECTION */}
        <div className="relative rounded-3xl p-6 sm:p-10 border border-white/10 bg-gradient-to-br from-[#0D0D14] via-[#0F0F1A] to-[#07070C] overflow-hidden shadow-2xl">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-neon-red/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neon-red/15 border border-neon-red/30 text-neon-red font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>TRI THỨC & CẨM NANG THỰC CHIẾN 2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              BLOG & KHO KIẾN THỨC <span className="bg-gradient-to-r from-neon-red via-red-400 to-rose-300 bg-clip-text text-transparent">NGUYÊN MMO</span>
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
              Tổng hợp kinh nghiệm thực chiến Facebook Ads, AI Automation, TikTok Shop, Affiliate Marketing và các lộ trình đào tạo tối ưu hóa thu nhập số.
            </p>

            {/* Quick Stats Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-gray-400 font-mono">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neon-red animate-ping" />
                <span className="text-white font-bold">{publishedBlogs.length}+ Bài viết chất lượng</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300">100% Kiến thức thực chiến</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-neon-red" />
                <span className="text-gray-300">35,000+ Lượt đọc/tháng</span>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH & CATEGORY FILTER TOOLBAR */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative flex-1 max-w-xl">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm từ khóa thủ thuật, Facebook, AI, TikTok, MMO..."
                className="w-full pl-11 pr-10 py-3 bg-[#0D0D14] border border-white/15 rounded-2xl text-xs sm:text-sm text-white placeholder-gray-500 outline-none focus:border-neon-red transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Active search filter badge counter */}
            <div className="text-xs text-gray-400 flex items-center justify-between sm:justify-end gap-2 font-mono">
              <span>Đang hiển thị: <strong className="text-neon-red">{filtered.length}</strong> bài viết</span>
              {searchQuery && (
                <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[11px] text-gray-300">
                  Từ khóa: "{searchQuery}"
                </span>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              const isActive = selectedCat === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCat(cat.name)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border ${
                    isActive
                      ? 'bg-neon-red border-neon-red text-white shadow-neon-red scale-[1.02]'
                      : 'bg-[#0D0D14]/80 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FEATURED SPOTLIGHT ARTICLE BANNER (If no search query active) */}
        {!searchQuery && selectedCat === 'all' && featuredPost && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-neon-red uppercase font-mono tracking-wider">
              <Flame className="w-4 h-4 animate-bounce" />
              <span>BÀI VIẾT TÂM ĐIỂM NỔI BẬT</span>
            </div>

            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group relative block rounded-3xl overflow-hidden border border-white/15 bg-[#0D0D14] hover:border-neon-red/50 transition-all duration-300 shadow-2xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
                {/* Thumbnail Image Left/Top */}
                <div className="lg:col-span-7 relative overflow-hidden min-h-[240px] lg:min-h-full">
                  <img
                    src={featuredPost.thumbnail}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                  <span className="absolute top-4 left-4 px-3.5 py-1.5 bg-neon-red text-white text-xs font-black rounded-full uppercase shadow-neon-red tracking-wider">
                    {featuredPost.category}
                  </span>
                </div>

                {/* Content Right/Bottom */}
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4 bg-gradient-to-b from-[#0D0D14] to-[#12121D]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                      <div className="flex items-center gap-2">
                        <img
                          src={featuredPost.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop'}
                          alt={featuredPost.author}
                          className="w-6 h-6 rounded-full object-cover border border-neon-red/50"
                        />
                        <span className="text-gray-200 font-bold">{featuredPost.author}</span>
                      </div>
                      <span>{featuredPost.date}</span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-neon-red transition-colors line-clamp-3 leading-snug">
                      {featuredPost.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-gray-300 line-clamp-3 leading-relaxed">
                      {featuredPost.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-400 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-neon-red" />
                        {featuredPost.readTime}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        {(featuredPost.views || 1200).toLocaleString()} views
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-neon-red/20 text-neon-red group-hover:bg-neon-red group-hover:text-white rounded-xl text-xs font-bold transition-all">
                      <span>Đọc bài viết</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* MAIN ARTICLES GRID + SIDEBAR LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Main Grid (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-base font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-neon-red" />
                <span>DANH SÁCH BÀI VIẾT ({filtered.length})</span>
              </h2>
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filtered.map((post) => {
                  const isBookmarked = bookmarkedIds.includes(post.id);
                  return (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group border-beam-card flex flex-col justify-between overflow-hidden transition-all duration-300 h-full"
                    >
                      <div>
                        {/* Image preview */}
                        <div className="relative h-44 overflow-hidden">
                          <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D14] via-transparent to-black/30" />
                          
                          <span className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/15 text-neon-red text-[10px] font-black rounded-full uppercase">
                            {post.category}
                          </span>

                          <button
                            onClick={(e) => toggleBookmark(e, post.id)}
                            title={isBookmarked ? 'Xóa khỏi danh sách lưu' : 'Lưu bài viết'}
                            className={`absolute top-3 right-3 p-1.5 rounded-full border backdrop-blur-md transition-all ${
                              isBookmarked
                                ? 'bg-neon-red border-neon-red text-white'
                                : 'bg-black/60 border-white/20 text-gray-300 hover:text-white hover:bg-black/80'
                            }`}
                          >
                            <Bookmark className="w-3.5 h-3.5 fill-current" />
                          </button>
                        </div>

                        {/* Article body */}
                        <div className="p-5 space-y-3">
                          <div className="text-[11px] text-gray-400 font-mono flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-neon-red" />
                              <span>{post.readTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3 text-emerald-400" />
                              <span>{(post.views || 950).toLocaleString()}</span>
                            </div>
                          </div>

                          <h3 className="text-base font-bold text-white group-hover:text-neon-red transition-colors line-clamp-2 leading-snug">
                            {post.title}
                          </h3>

                          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                            {post.summary}
                          </p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-white/5 text-xs text-gray-400 font-mono">
                        <span className="text-[11px] text-gray-500">{post.date}</span>
                        <div className="font-bold text-neon-red flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>Xem ngay</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center bg-[#0D0D14] border border-white/10 rounded-3xl space-y-4">
                <div className="w-12 h-12 rounded-full bg-neon-red/10 border border-neon-red/30 flex items-center justify-center text-neon-red mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <p className="text-gray-300 font-bold text-sm">Không tìm thấy bài viết nào phù hợp.</p>
                <button
                  onClick={() => {
                    setSelectedCat('all');
                    setSearchQuery('');
                  }}
                  className="px-5 py-2.5 bg-neon-red text-white text-xs font-bold rounded-xl hover:bg-neon-red-hover transition-all"
                >
                  Đặt lại bộ lọc bài viết
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* POPULAR ARTICLES WIDGET */}
            <div className="p-6 bg-[#0D0D14] border border-white/10 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <Flame className="w-4 h-4 text-neon-red" />
                <h3 className="text-xs font-black text-white uppercase font-mono tracking-wider">
                  BÀI VIẾT XEM NHIỀU NHẤT
                </h3>
              </div>

              <div className="space-y-4">
                {popularPosts.map((post, idx) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex gap-3.5 items-start p-2 rounded-2xl hover:bg-white/5 transition-all"
                  >
                    <span className="w-6 h-6 rounded-lg bg-neon-red/20 border border-neon-red/40 text-neon-red font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      0{idx + 1}
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-gray-200 group-hover:text-neon-red transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[10px] text-gray-400 font-mono">
                        <span>{post.readTime}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">{(post.views || 0).toLocaleString()} lượt xem</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* VIP TELEGRAM & COMMUNITY CALLOUT */}
            <div className="p-6 bg-gradient-to-br from-neon-red/15 via-[#0D0D14] to-[#140810] border border-neon-red/30 rounded-3xl space-y-4 shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-neon-red/20 border border-neon-red/40 flex items-center justify-center text-neon-red shrink-0">
                  <Sparkles className="w-5 h-5 animate-spin" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">CỘNG ĐỒNG MMO VIP 2026</h3>
                  <p className="text-[11px] text-gray-300">Tham gia Telegram nhận tài liệu & mẹo ads mới nhất!</p>
                </div>
              </div>

              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-neon-red hover:bg-neon-red-hover text-white text-xs font-black rounded-xl btn-beam-touch flex items-center justify-center gap-2 shadow-neon-red transition-all"
              >
                <span>🚀 THAM GIA KÊNH TELEGRAM NGAY</span>
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

