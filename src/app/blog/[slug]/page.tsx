'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MOCK_BLOGS } from '@/data/mockBlog';
import { BlogPost } from '@/types';
import { 
  Clock, 
  Eye, 
  ArrowLeft, 
  Zap, 
  Share2, 
  CheckCircle2, 
  ChevronRight, 
  ListOrdered, 
  ThumbsUp, 
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { showToast } = useToast();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [allBlogs, setAllBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(142);
  const [isTocOpen, setIsTocOpen] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Calculate reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(currentProgress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      let list: BlogPost[] = [];
      try {
        const res = await fetch('/api/blogs');
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          list = json.data;
        }
      } catch (e) {}

      if (list.length === 0) {
        try {
          const cached = localStorage.getItem('nguyenmmo_blogs');
          if (cached) {
            list = JSON.parse(cached);
          }
        } catch (e) {}
      }

      if (list.length === 0) {
        list = MOCK_BLOGS;
      }

      setAllBlogs(list);
      const found = list.find((b) => b.slug === slug);
      if (found) {
        setPost(found);
      } else {
        const mockFound = MOCK_BLOGS.find((b) => b.slug === slug) || MOCK_BLOGS[0];
        setPost(mockFound);
      }
      setIsLoading(false);
    };

    fetchBlogs();
  }, [slug]);

  // Extract headings for Table of Contents (TOC)
  const tocItems = useMemo(() => {
    if (!post || !post.content) return [];
    const lines = post.content.split('\n');
    const headings: { text: string; id: string }[] = [];
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (
        trimmed.startsWith('📌') ||
        trimmed.startsWith('🤖') ||
        trimmed.startsWith('🎓') ||
        trimmed.startsWith('💰') ||
        trimmed.startsWith('🚀') ||
        trimmed.startsWith('🎵') ||
        trimmed.startsWith('###') ||
        trimmed.startsWith('##')
      ) {
        headings.push({
          text: trimmed.replace(/^[#\s]+/, ''),
          id: `heading-${index}`
        });
      }
    });
    return headings;
  }, [post]);

  // Related articles
  const relatedPosts = useMemo(() => {
    if (!post) return [];
    const pool = allBlogs.length > 0 ? allBlogs : MOCK_BLOGS;
    const sameCategory = pool.filter(b => b.id !== post.id && b.category === post.category);
    if (sameCategory.length >= 3) return sameCategory.slice(0, 3);
    const otherPosts = pool.filter(b => b.id !== post.id);
    return [...sameCategory, ...otherPosts].slice(0, 3);
  }, [post, allBlogs]);

  if (isLoading || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-neon-red border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-400 font-bold text-sm">Đang tải nội dung bài viết...</p>
      </div>
    );
  }

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Đã sao chép liên kết bài viết vào bộ nhớ tạm!', 'success');
    }
  };

  const handleLike = () => {
    if (!isLiked) {
      setLikeCount(prev => prev + 1);
      setIsLiked(true);
      showToast('Cảm ơn bạn đã yêu thích bài viết!', 'success');
    } else {
      setLikeCount(prev => prev - 1);
      setIsLiked(false);
    }
  };

  return (
    <div className="relative">
      {/* 🚀 TOP SCROLL READING PROGRESS BAR */}
      <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-50">
        <div 
          className="h-full bg-gradient-to-r from-neon-red via-pink-500 to-amber-300 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        
        {/* 🧭 BREADCRUMBS & NAVIGATION */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400 font-mono">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-neon-red transition-colors">Trang chủ</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <Link href="/blog" className="hover:text-neon-red transition-colors">Blog</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-gray-200 font-bold">{post.category}</span>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 hover:text-white transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Danh sách bài viết</span>
          </Link>
        </div>

        {/* 📰 ARTICLE HEADER */}
        <div className="space-y-6">
          
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="px-3.5 py-1 bg-neon-red/20 border border-neon-red/40 text-neon-red text-xs font-black rounded-full uppercase font-mono tracking-wider shadow-neon-red">
              {post.category}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                className={`px-3 py-1.5 border rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isLiked 
                    ? 'bg-neon-red text-white border-neon-red shadow-neon-red' 
                    : 'bg-white/5 hover:bg-white/10 border-white/15 text-gray-300'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{likeCount} Hữu ích</span>
              </button>

              <button
                onClick={handleShare}
                className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 text-gray-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Chia sẻ</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight tracking-tight">
            {post.title}
          </h1>

          {/* Highlighted Summary */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#12121F] to-[#0A0A10] border-l-4 border-neon-red border-y border-r border-white/10 text-xs sm:text-sm text-gray-200 leading-relaxed font-medium">
            {post.summary}
          </div>

          {/* Author & Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0D0D14] border border-white/10 text-xs text-gray-300 font-mono">
            <div className="flex items-center gap-3">
              {post.authorAvatar ? (
                <img src={post.authorAvatar} alt={post.author} className="w-10 h-10 rounded-full border-2 border-neon-red/50 object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-neon-red/20 border border-neon-red/40 flex items-center justify-center font-bold text-neon-red text-sm">
                  N
                </div>
              )}
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>{post.author || 'Nguyên MMO'}</span>
                  <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded">✓ VIP Expert</span>
                </div>
                <div className="text-[11px] text-gray-400 font-sans">{post.authorRole || 'Chuyên gia Digital MMO'}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neon-red" />
                <span>{post.date}</span>
              </div>
              <span>•</span>
              <div>Thời gian đọc: <strong className="text-white">{post.readTime}</strong></div>
              <span>•</span>
              <div className="flex items-center gap-1 text-emerald-400 font-bold">
                <Eye className="w-3.5 h-3.5" />
                <span>{(post.views || 1280).toLocaleString()} lượt xem</span>
              </div>
            </div>
          </div>

        </div>

        {/* 🖼️ FEATURED BANNER IMAGE */}
        <div className="rounded-3xl overflow-hidden max-h-[460px] border border-white/15 shadow-2xl relative bg-black/40">
          <img src={post.thumbnail} alt={post.title} loading="eager" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        </div>

        {/* 📋 TABLE OF CONTENTS (TOC) WIDGET */}
        {tocItems.length > 0 && (
          <div className="p-5 bg-[#0F0F1A] border border-white/10 rounded-2xl space-y-3 shadow-glass">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsTocOpen(!isTocOpen)}>
              <div className="flex items-center gap-2 font-bold text-white text-sm font-mono">
                <ListOrdered className="w-4 h-4 text-neon-red" />
                <span>MỤC LỤC BÀI VIẾT</span>
              </div>
              <span className="text-xs text-neon-red font-bold hover:underline">
                [{isTocOpen ? 'Thu gọn' : 'Mở rộng'}]
              </span>
            </div>

            {isTocOpen && (
              <ul className="space-y-2 pt-2 border-t border-white/10 text-xs sm:text-sm text-gray-300">
                {tocItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 hover:text-neon-red transition-colors">
                    <span className="text-neon-red font-mono font-bold shrink-0">0{i + 1}.</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* 📝 ARTICLE FULL CONTENT BOX */}
        <div className="prose prose-invert max-w-none text-gray-200 text-sm sm:text-base leading-relaxed whitespace-pre-line p-6 sm:p-10 bg-[#0D0D14] border border-white/10 rounded-3xl space-y-6 shadow-2xl">
          {post.content}

          {/* Tags Footprint */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-6 border-t border-white/10 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-gray-400 uppercase">Thẻ bài viết:</span>
              {post.tags.map((t) => (
                <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300 font-mono">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 👤 ABOUT AUTHOR BOX */}
        <div className="p-6 bg-[#0F0F1A] border border-white/10 rounded-3xl flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-glass">
          {post.authorAvatar ? (
            <img src={post.authorAvatar} alt={post.author} className="w-16 h-16 rounded-full border-2 border-neon-red/50 object-cover shrink-0" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-neon-red/20 border border-neon-red/40 flex items-center justify-center font-bold text-neon-red text-xl shrink-0">
              N
            </div>
          )}
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h4 className="text-base font-black text-white">{post.author || 'Nguyên MMO'}</h4>
              <span className="px-2 py-0.5 bg-neon-red/20 text-neon-red text-[10px] font-bold rounded-full">Author</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed max-w-xl">
              Chuyên gia huấn luyện MMO & Tự động hóa tiếp thị kỹ thuật số. Hơn 8+ năm kinh nghiệm chinh chiến Facebook Ads, TikTok Shop, xây dựng dàn VIA/BM & phát triển hệ thống kinh doanh số bền vững.
            </p>
            <div className="pt-1 flex items-center justify-center sm:justify-start gap-3 text-xs font-bold text-neon-red">
              <Link href="/blog" className="hover:underline">Xem tất cả bài viết của {post.author}</Link>
            </div>
          </div>
        </div>

        {/* ⚡ EMBEDDED SERVICE CALL-TO-ACTION BANNER */}
        <div className="border-beam-always p-6 sm:p-8 text-white space-y-5 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-neon-red/20 border border-neon-red/40 flex items-center justify-center text-neon-red shrink-0">
                <Zap className="w-7 h-7 fill-neon-red animate-pulse" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white">TỐI ƯU HÓA HỆ THỐNG DIGITAL & MMO CỦA BẠN</h3>
                <p className="text-xs sm:text-sm text-gray-300 mt-1">
                  Khám phá kho 500+ dịch vụ tăng Follow Facebook, TikTok, tài khoản AI ChatGPT Pro & Proxy IPv4 tự động 24/7.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/10">
            <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-400 font-bold">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> <span>Tự động kích hoạt 24/7</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> <span>Bảo hành 1- đổi - 1</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/services"
                className="px-6 py-3 bg-neon-red hover:bg-neon-red-hover text-white text-xs font-black rounded-xl btn-beam-touch flex items-center gap-2 shadow-neon-red hover:scale-105 transition-all"
              >
                <span>⚡ KHÁM PHÁ DỊCH VỤ NGAY</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* 📚 RELATED ARTICLES GRID */}
        {relatedPosts.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-neon-red" />
                <span>BÀI VIẾT LIÊN QUAN</span>
              </h3>
              <Link href="/blog" className="text-xs font-bold text-neon-red hover:underline">
                Xem tất cả →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="group border-beam-card block overflow-hidden transition-all duration-300"
                >
                  <div className="relative h-40 overflow-hidden bg-black/40">
                    <img src={rel.thumbnail} alt={rel.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 left-2 px-2.5 py-0.5 bg-neon-red text-white text-[9px] font-black rounded-full uppercase">
                      {rel.category}
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="text-[10px] text-gray-400 font-mono flex items-center gap-2">
                      <span>{rel.date}</span>
                      <span>•</span>
                      <span>{rel.readTime}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-neon-red transition-colors line-clamp-2 leading-snug">
                      {rel.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
