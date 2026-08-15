'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MOCK_BLOGS } from '@/data/mockBlog';
import { BlogPost } from '@/types';
import { 
  Clock, Eye, User, ArrowLeft, Zap, Share2, Sparkles, CheckCircle2, 
  ThumbsUp, Bookmark, MessageSquare, ChevronRight, ListOrdered, Share,
  Facebook, Send, ShieldCheck, Heart, Award, ArrowUpRight, Flame
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { showToast } = useToast();
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(142);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    try {
      const cached = localStorage.getItem('nguyenmmo_blogs');
      if (cached) {
        const blogsList: BlogPost[] = JSON.parse(cached);
        const found = blogsList.find((b) => b.slug === slug);
        if (found) {
          setPost(found);
        } else {
          setPost(MOCK_BLOGS.find((b) => b.slug === slug) || MOCK_BLOGS[0]);
        }
      } else {
        setPost(MOCK_BLOGS.find((b) => b.slug === slug) || MOCK_BLOGS[0]);
      }

      // Check bookmark status
      const savedBookmarks = localStorage.getItem('nguyenmmo_blog_bookmarks');
      if (savedBookmarks) {
        const ids: string[] = JSON.parse(savedBookmarks);
        const currentPost = MOCK_BLOGS.find((b) => b.slug === slug);
        if (currentPost && ids.includes(currentPost.id)) {
          setIsBookmarked(true);
        }
      }
    } catch (e) {
      setPost(MOCK_BLOGS.find((b) => b.slug === slug) || MOCK_BLOGS[0]);
    }
  }, [slug]);

  // Scroll Progress & Active Table of Contents section tracker
  useEffect(() => {
    const handleScroll = () => {
      // 1. Calculate reading scroll percentage
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, currentProgress)));
      }

      // 2. Active Section Heading Tracker
      const sections = document.querySelectorAll<HTMLElement>('[id^="section-"]');
      let currentSection = '';
      sections.forEach((sec) => {
        const top = sec.getBoundingClientRect().top;
        if (top <= 140) {
          currentSection = sec.id;
        }
      });
      if (currentSection) {
        setActiveSectionId(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parse Table of Contents items from article content
  const tableOfContents = useMemo(() => {
    if (!post?.content) return [];
    const lines = post.content.split('\n');
    const toc: { id: string; title: string }[] = [];
    let secIndex = 1;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (
        trimmed.startsWith('📌') ||
        trimmed.startsWith('🤖') ||
        trimmed.startsWith('💰') ||
        trimmed.startsWith('🎓') ||
        trimmed.startsWith('🎵') ||
        trimmed.startsWith('🚀')
      ) {
        toc.push({
          id: `section-${secIndex}`,
          title: trimmed.replace(/^[📌🤖💰🎓🎵🚀]\s*/, ''),
        });
        secIndex++;
      }
    });
    return toc;
  }, [post?.content]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-neon-red border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 font-bold text-sm">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Đã sao chép liên kết bài viết!', 'success');
    }
  };

  const handleToggleBookmark = () => {
    try {
      const savedBookmarks = localStorage.getItem('nguyenmmo_blog_bookmarks');
      let ids: string[] = savedBookmarks ? JSON.parse(savedBookmarks) : [];
      if (isBookmarked) {
        ids = ids.filter((id) => id !== post.id);
        setIsBookmarked(false);
        showToast('Đã xóa khỏi mục bài viết đã lưu', 'info');
      } else {
        ids.push(post.id);
        setIsBookmarked(true);
        showToast('Đã lưu bài viết thành công!', 'success');
      }
      localStorage.setItem('nguyenmmo_blog_bookmarks', JSON.stringify(ids));
    } catch (e) {}
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikeCount((prev) => prev + 1);
      setHasLiked(true);
      showToast('Cảm ơn bạn đã yêu thích bài viết!', 'success');
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Related posts
  const relatedPosts = MOCK_BLOGS.filter(
    (b) => b.id !== post.id && (b.category === post.category || b.featured)
  ).slice(0, 2);

  // Render article content with formatted sections & callouts
  const renderFormattedContent = () => {
    const lines = post.content.split('\n');
    let sectionCounter = 0;

    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-3" />;

      // Header Section (📌, 🤖, 💰, 🎓, 🎵, 🚀)
      if (
        trimmed.startsWith('📌') ||
        trimmed.startsWith('🤖') ||
        trimmed.startsWith('💰') ||
        trimmed.startsWith('🎓') ||
        trimmed.startsWith('🎵') ||
        trimmed.startsWith('🚀')
      ) {
        sectionCounter++;
        const secId = `section-${sectionCounter}`;
        return (
          <div key={idx} id={secId} className="pt-6 pb-2 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="px-3 py-1 bg-neon-red/20 border border-neon-red/40 text-neon-red text-xs font-mono font-bold rounded-lg shrink-0">
                Mục {sectionCounter}
              </span>
              <span>{trimmed}</span>
            </h2>
          </div>
        );
      }

      // Tip / Callout Box (Mẹo, Lưu ý, Bước, Quy trình)
      if (
        trimmed.startsWith('Mẹo') ||
        trimmed.startsWith('Bước') ||
        trimmed.startsWith('Lưu ý') ||
        trimmed.startsWith('Bí quyết')
      ) {
        return (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-neon-red/10 border-l-4 border-neon-red text-gray-200 text-xs sm:text-sm font-medium my-3 leading-relaxed"
          >
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-neon-red shrink-0 mt-0.5" />
              <div>{trimmed}</div>
            </div>
          </div>
        );
      }

      // Bullet Point list items
      if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        return (
          <div key={idx} className="flex items-start gap-2.5 text-gray-300 text-sm leading-relaxed my-1.5 pl-2">
            <CheckCircle2 className="w-4 h-4 text-neon-red shrink-0 mt-0.5" />
            <span>{trimmed.replace(/^[-•]\s*/, '')}</span>
          </div>
        );
      }

      // Numbered list items
      if (/^\d+\./.test(trimmed)) {
        return (
          <div key={idx} className="flex items-start gap-2.5 text-gray-200 text-sm font-medium leading-relaxed my-2 pl-2">
            <span className="w-5 h-5 rounded-full bg-white/10 text-neon-red font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              {trimmed.match(/^\d+/)?.[0]}
            </span>
            <span>{trimmed.replace(/^\d+\.\s*/, '')}</span>
          </div>
        );
      }

      // Standard paragraph text
      return (
        <p key={idx} className="text-gray-300 text-sm sm:text-base leading-relaxed my-2">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      
      {/* ⚡ SCROLL READING PROGRESS BAR */}
      <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-neon-red via-rose-500 to-amber-400 transition-all duration-150 shadow-[0_0_10px_#FF1E42]"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* BREADCRUMBS & NAVIGATION */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-gray-400 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-neon-red transition-colors">Trang chủ</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <Link href="/blog" className="hover:text-neon-red transition-colors">Blog</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-neon-red font-bold">{post.category}</span>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs text-neon-red font-bold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> quay lại danh sách
          </Link>
        </div>

        {/* HEADER TITLE & METADATA BAR */}
        <div className="space-y-5 max-w-4xl">
          <div className="flex items-center justify-between">
            <span className="px-3.5 py-1.5 bg-neon-red/15 border border-neon-red/30 text-neon-red text-xs font-black rounded-full uppercase tracking-wider font-mono">
              {post.category}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleBookmark}
                title={isBookmarked ? 'Xóa khỏi danh sách lưu' : 'Lưu bài viết'}
                className={`px-3 py-1.5 border rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isBookmarked
                    ? 'bg-neon-red border-neon-red text-white shadow-neon-red'
                    : 'bg-white/5 hover:bg-white/10 border-white/15 text-gray-300'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">{isBookmarked ? 'Đã lưu' : 'Lưu bài'}</span>
              </button>

              <button
                onClick={handleShare}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 text-gray-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Share2 className="w-3.5 h-3.5 text-neon-red" />
                <span>Chia sẻ</span>
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
            {post.title}
          </h1>

          {/* Lead Summary Highlight Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-neon-red/10 via-[#0D0D14] to-[#0D0D14] border-l-4 border-neon-red border-y border-r border-white/10">
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-medium">
              "{post.summary}"
            </p>
          </div>

          {/* Author Profile & Article Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400 border-y border-white/10 py-3.5 font-mono">
            <div className="flex items-center gap-3">
              <img
                src={post.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop'}
                alt={post.author || 'Nguyên MMO'}
                className="w-9 h-9 rounded-full object-cover border-2 border-neon-red/50 shadow-md"
              />
              <div>
                <div className="flex items-center gap-1.5 text-white font-bold text-sm">
                  <span>{post.author || 'Nguyên MMO'}</span>
                  <span title="Verified Author">
                    <ShieldCheck className="w-4 h-4 text-neon-red" />
                  </span>
                </div>
                <span className="text-[10px] text-gray-400">Founder & Master Coach</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neon-red" />
                <span>{post.date}</span>
              </div>
              <span>•</span>
              <div>Thời gian đọc: <strong className="text-white">{post.readTime}</strong></div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>{(post.views || 1280).toLocaleString()} lượt xem</span>
              </div>
            </div>
          </div>
        </div>

        {/* COVER IMAGE */}
        <div className="rounded-3xl overflow-hidden max-h-[460px] border border-white/15 shadow-2xl relative group">
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* TWO-COLUMN ARTICLE BODY & SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          
          {/* LEFT MAIN ARTICLE CONTENT (8 COLS) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Article Full Content Container */}
            <div className="p-6 sm:p-10 bg-[#0D0D14] border border-white/10 rounded-3xl space-y-4 shadow-glass text-gray-200">
              {renderFormattedContent()}
            </div>

            {/* HELPFUL REACTION BUTTONS */}
            <div className="p-6 bg-gradient-to-r from-[#0D0D14] to-[#14141F] border border-white/10 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div>
                <h3 className="text-sm font-bold text-white">Bài viết này có hữu ích với bạn không?</h3>
                <p className="text-xs text-gray-400 mt-0.5">Hãy để lại phản hồi để giúp Nguyên MMO cải thiện nội dung tốt hơn.</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                    hasLiked
                      ? 'bg-neon-red border-neon-red text-white shadow-neon-red'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Hữu ích ({likeCount})</span>
                </button>

                <button
                  onClick={handleShare}
                  className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <Share2 className="w-4 h-4 text-neon-red" />
                  <span>Chia sẻ</span>
                </button>
              </div>
            </div>

            {/* AUTHOR BIO CARD */}
            <div className="p-6 bg-[#0D0D14] border border-white/10 rounded-3xl flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-xl">
              <img
                src={post.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop'}
                alt={post.author}
                className="w-16 h-16 rounded-full object-cover border-2 border-neon-red shrink-0"
              />
              <div className="space-y-2 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-base font-black text-white">{post.author || 'Nguyên MMO'}</h3>
                  <span className="px-2 py-0.5 bg-neon-red/20 border border-neon-red/40 text-neon-red text-[10px] font-bold rounded-md">
                    VERIFIED AUTHOR
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Chuyên gia với hơn 8 năm kinh nghiệm trong lĩnh vực Facebook Ads, TikTok Shop, AI Automation và Xây dựng hệ thống kinh doanh số thực chiến.
                </p>
                <div className="pt-1 flex items-center justify-center sm:justify-start gap-3">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-white/5 hover:bg-neon-red/20 hover:text-neon-red border border-white/10 rounded-xl text-xs transition-all"
                    title="Facebook Page"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href="https://t.me"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-white/5 hover:bg-neon-red/20 hover:text-neon-red border border-white/10 rounded-xl text-xs transition-all"
                    title="Telegram Community"
                  >
                    <Send className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* RELATED ARTICLES */}
            {relatedPosts.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-base font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-neon-red" />
                  <span>BÀI VIẾT BẠN CÓ THỂ QUAN TÂM</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {relatedPosts.map((rPost) => (
                    <Link
                      key={rPost.id}
                      href={`/blog/${rPost.slug}`}
                      className="group border-beam-card block overflow-hidden transition-all"
                    >
                      <div className="relative h-36 overflow-hidden">
                        <img
                          src={rPost.thumbnail}
                          alt={rPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-black/60 backdrop-blur-md border border-white/15 text-neon-red text-[10px] font-black rounded-full uppercase">
                          {rPost.category}
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="text-[10px] text-gray-400 font-mono flex items-center gap-2">
                          <span>{rPost.date}</span>
                          <span>•</span>
                          <span>{rPost.readTime}</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-neon-red transition-colors line-clamp-2 leading-snug">
                          {rPost.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT STICKY SIDEBAR (4 COLS) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">
              
              {/* TABLE OF CONTENTS WIDGET */}
              {tableOfContents.length > 0 && (
                <div className="p-6 bg-[#0D0D14] border border-white/10 rounded-3xl space-y-4 shadow-xl">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                    <ListOrdered className="w-4 h-4 text-neon-red" />
                    <h3 className="text-xs font-black text-white uppercase font-mono tracking-wider">
                      MỤC LỤC BÀI VIẾT
                    </h3>
                  </div>

                  <nav className="space-y-1.5 max-h-[320px] overflow-y-auto custom-scrollbar pr-1">
                    {tableOfContents.map((item, idx) => {
                      const isActive = activeSectionId === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className={`w-full text-left text-xs p-2 rounded-xl transition-all flex items-start gap-2 leading-snug ${
                            isActive
                              ? 'bg-neon-red/15 border border-neon-red/40 text-neon-red font-bold'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <span className="font-mono text-[10px] opacity-75 mt-0.5">0{idx + 1}.</span>
                          <span className="line-clamp-2">{item.title}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              )}

              {/* EMBEDDED SERVICE CALL-TO-ACTION BANNER */}
              <div className="border-beam-always p-6 text-white space-y-4 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-neon-red/20 border border-neon-red/40 flex items-center justify-center text-neon-red shrink-0">
                    <Zap className="w-6 h-6 fill-neon-red animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white uppercase">TỐI ƯU HÓA HỆ THỐNG DIGITAL</h3>
                    <p className="text-[11px] text-gray-300">
                      Tài khoản VIA/BM, Proxy IPv4 & 500+ dịch vụ tăng tương tác tự động.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10 text-[11px] text-emerald-400 font-bold">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Xử lý tự động 24/7</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Bảo hành 1- đổi - 1 uy tín</span>
                  </div>
                </div>

                <Link
                  href="/services"
                  className="w-full py-3 bg-neon-red hover:bg-neon-red-hover text-white text-xs font-black rounded-xl btn-beam-touch flex items-center justify-center gap-1.5 shadow-neon-red transition-all"
                >
                  <span>⚡ KHÁM PHÁ KHO DỊCH VỤ</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

