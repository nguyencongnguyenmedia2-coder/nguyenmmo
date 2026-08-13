'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MOCK_BLOGS } from '@/data/mockBlog';
import { BlogPost } from '@/types';
import { BookOpen, Search, Clock, ArrowRight, User } from 'lucide-react';

export default function BlogPage() {
  const [blogsList, setBlogsList] = useState<BlogPost[]>([]);
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    try {
      const cached = localStorage.getItem('nguyenmmo_blogs');
      if (cached) {
        setBlogsList(JSON.parse(cached));
      } else {
        setBlogsList(MOCK_BLOGS.map((b) => ({ ...b, published: true })));
      }
    } catch (e) {
      setBlogsList(MOCK_BLOGS.map((b) => ({ ...b, published: true })));
    }
  }, []);

  const categories = ['all', 'Thủ thuật Facebook', 'AI Automation', 'MMO Thực chiến', 'Khóa học', 'Mẹo TikTok', 'Giải pháp Digital'];

  const publishedBlogs = blogsList.filter((b) => b.published !== false);

  const filtered = publishedBlogs.filter((post) => {
    const matchCat = selectedCat === 'all' || post.category === selectedCat;
    const matchSearch =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neon-red/10 border border-neon-red/30 text-neon-red font-bold text-xs mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>KIẾN THỨC, HƯỚNG DẪN & KHÓA HỌC THỰC CHIẾN</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">BLOG & KHÓA HỌC NGUYÊN MMO</h1>
          <p className="text-xs text-gray-400 mt-1">
            Tổng hợp chia sẻ kinh nghiệm MMO, thủ thuật Facebook, TikTok, AI Tools và khóa học Digital thực chiến.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm bài viết hướng dẫn..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#0D0D14] border border-white/15 rounded-2xl text-xs text-white placeholder-gray-500 outline-none focus:border-neon-red"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCat === cat
                ? 'bg-neon-red text-white shadow-neon-red scale-105'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {cat === 'all' ? 'Tất cả bài viết' : cat}
          </button>
        ))}
      </div>

      {/* Blog Cards Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((post) => (
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
                <div className="absolute top-3 left-3 px-3 py-1 bg-neon-red text-white text-[10px] font-black rounded-full uppercase shadow-neon-red">
                  {post.category}
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="text-xs text-gray-400 font-mono flex items-center gap-3">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-neon-red" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-neon-red transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {post.summary}
                </p>

                <div className="pt-2 text-xs font-bold text-neon-red flex items-center gap-1 group-hover:translate-x-1 transition-transform border-t border-white/5">
                  <span>Đọc chi tiết bài viết</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white/5 border border-white/10 rounded-3xl space-y-3">
          <p className="text-gray-300 font-bold text-sm">Chưa có bài viết nào cho chuyên mục này.</p>
          <button
            onClick={() => {
              setSelectedCat('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-neon-red text-white text-xs font-bold rounded-xl"
          >
            Xem tất cả bài viết
          </button>
        </div>
      )}

    </div>
  );
}
