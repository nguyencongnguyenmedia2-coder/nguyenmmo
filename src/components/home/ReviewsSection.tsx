'use client';

import React from 'react';
import { Star, CheckCircle, MessageSquareQuote } from 'lucide-react';
import { MOCK_REVIEWS } from '@/data/mockResources';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-16 bg-[#08080C] relative border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neon-red/10 border border-neon-red/30 text-neon-red font-bold text-xs">
            <MessageSquareQuote className="w-4 h-4" />
            <span>SOCIAL PROOF & REVIEWS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white">
            KHÁCH HÀNG NÓI GÌ VỀ <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-red via-rose-500 to-amber-400">NGUYÊN MMO</span>?
          </h2>

          <div className="flex items-center justify-center gap-2 text-xs font-mono text-gray-300 pt-1">
            <span className="text-amber-400 font-bold flex items-center gap-1 text-sm">
              4.9/5
              <span className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </span>
            </span>
            <span>•</span>
            <span className="text-gray-400 font-medium">+500 khách hàng đã sử dụng dịch vụ</span>
          </div>
        </div>

        {/* 4 SaaS Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_REVIEWS.slice(0, 4).map((rev) => (
            <div
              key={rev.id}
              className="p-6 border-beam-card flex flex-col justify-between transition-all hover:-translate-y-1 hover:border-white/30"
            >
              <div className="space-y-3">
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Comment text */}
                <p className="text-gray-300 text-xs leading-relaxed italic">
                  "{rev.comment || 'Đặt dịch vụ rất nhanh, hệ thống xử lý gần như ngay lập tức. Sẽ tiếp tục sử dụng.'}"
                </p>
              </div>

              {/* User Bio */}
              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={rev.userName}
                    className="w-9 h-9 rounded-full object-cover border border-white/15"
                  />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span>{rev.userName}</span>
                      <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono">{rev.serviceName || 'Dịch vụ đã sử dụng'}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
