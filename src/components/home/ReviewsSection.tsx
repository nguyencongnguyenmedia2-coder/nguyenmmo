'use client';

import React from 'react';
import { Star, CheckCircle, MessageSquareQuote } from 'lucide-react';
import { MOCK_REVIEWS } from '@/data/mockResources';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-16 bg-[#08080C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-red/10 border border-neon-red/30 text-neon-red font-bold text-xs">
            <MessageSquareQuote className="w-4 h-4" />
            <span>ĐÁNH GIÁ THỰC TẾ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            KHÁCH HÀNG NÓI GÌ VỀ <span className="text-neon-red">DIGITAL MMO</span>?
          </h2>
          <p className="text-gray-400 text-sm">
            Hơn 10.000+ cá nhân, doanh nghiệp và người làm MMO tin tưởng sử dụng hệ thống dịch vụ tự động của chúng tôi mỗi ngày.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-6 border-beam-card flex flex-col justify-between transition-all"
            >
              <div className="space-y-3">
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-gold-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-400" />
                  ))}
                </div>

                {/* Comment text */}
                <p className="text-gray-300 text-xs leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* User Bio */}
              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.userAvatar}
                    alt={rev.userName}
                    className="w-9 h-9 rounded-full object-cover border border-white/10"
                  />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span>{rev.userName}</span>
                      {rev.verified && (
                        <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <div className="text-[10px] text-gray-500">{rev.serviceName}</div>
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
