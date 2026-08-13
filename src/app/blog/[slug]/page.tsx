'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MOCK_BLOGS } from '@/data/mockBlog';
import { BlogPost } from '@/types';
import { Clock, Eye, User, ArrowLeft, Zap, Share2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { showToast } = useToast();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    try {
      const cached = localStorage.getItem('nguyenmmo_blogs');
      if (cached) {
        const blogsList: BlogPost[] = JSON.parse(cached);
        const found = blogsList.find((b) => b.slug === slug);
        if (found) {
          setPost(found);
          return;
        }
      }
    } catch (e) {}

    const mockFound = MOCK_BLOGS.find((b) => b.slug === slug) || MOCK_BLOGS[0];
    setPost(mockFound);
  }, [slug]);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 font-bold">Đang tải bài viết...</p>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Đã sao chép liên kết bài viết!', 'success');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      
      {/* Back Button */}
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs text-neon-red font-bold hover:underline">
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách bài viết
      </Link>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 bg-neon-red/20 border border-neon-red/40 text-neon-red text-xs font-black rounded-full uppercase font-mono">
            {post.category}
          </span>

          <button
            onClick={handleShare}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 text-gray-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Chia sẻ</span>
          </button>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight">
          {post.title}
        </h1>

        <p className="text-sm text-gray-300 leading-relaxed font-medium bg-white/5 p-4 rounded-2xl border border-white/10">
          {post.summary}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400 border-y border-white/10 py-3 font-mono">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-neon-red/20 border border-neon-red/40 flex items-center justify-center font-bold text-neon-red">
              N
            </div>
            <span className="text-white font-bold">{post.author || 'Nguyên MMO'}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-neon-red" />
              <span>{post.date}</span>
            </div>
            <span>•</span>
            <div>Thời gian đọc: <strong>{post.readTime}</strong></div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>{(post.views || 1280).toLocaleString()} lượt xem</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Banner Image */}
      <div className="rounded-3xl overflow-hidden max-h-[420px] border border-white/10 shadow-2xl relative">
        <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
      </div>

      {/* Article Full Content Box */}
      <div className="prose prose-invert max-w-none text-gray-200 text-sm leading-relaxed whitespace-pre-line p-6 sm:p-8 bg-[#0D0D14] border border-white/10 rounded-3xl space-y-4 shadow-glass">
        {post.content}
      </div>

      {/* EMBEDDED SERVICE CALL-TO-ACTION BANNER */}
      <div className="border-beam-always p-6 text-white space-y-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-neon-red/20 border border-neon-red/40 flex items-center justify-center text-neon-red shrink-0">
            <Zap className="w-6 h-6 fill-neon-red animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">TỐI ƯU HÓA HỆ THỐNG DIGITAL & MMO CỦA BẠN</h3>
            <p className="text-xs text-gray-300">
              Trải nghiệm ngay hơn 500+ dịch vụ tăng Follow Facebook, TikTok, tài khoản AI ChatGPT Pro & Proxy IPv4 chất lượng cao.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10">
          <div className="flex items-center gap-3 text-xs text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" /> <span>Xử lý tự động 24/7</span>
            <CheckCircle2 className="w-4 h-4" /> <span>Bảo hành 1- đổi - 1</span>
          </div>

          <Link
            href="/services"
            className="px-6 py-3 bg-neon-red hover:bg-neon-red-hover text-white text-xs font-black rounded-xl btn-beam-touch flex items-center gap-1.5 shadow-neon-red hover:scale-105 transition-all overflow-hidden"
          >
            <span>⚡ KHÁM PHÁ KHO DỊCH VỤ NGAY</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
