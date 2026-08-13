'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ShieldCheck, Zap, ArrowRight, Check } from 'lucide-react';
import { MOCK_VIP_PLANS } from '@/data/mockVipPlans';
import { formatVND } from '@/lib/utils';

export const VipBanner: React.FC = () => {
  return (
    <section className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#141208] via-[#1A180C] to-[#0D0D14] border border-gold-500/30 p-8 sm:p-12 shadow-neon-gold overflow-hidden">
          
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left intro */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-400 font-bold text-xs">
                <Star className="w-4 h-4 fill-gold-400" />
                <span>CHƯƠNG TRÌNH VIP MEMBER</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                ƯU ĐÃI ĐẶC QUYỀN <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-amber-300">
                  DÀNH CHO NGƯỜI LÀM MMO
                </span>
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Nâng cấp VIP Member để tận hưởng mức giá ưu đãi cực sâu lên tới 20%, ưu tiên tốc độ xử lý đơn hàng hàng đầu và mở khóa toàn bộ kho tài nguyên công cụ độc quyền.
              </p>
              <div className="pt-2">
                <Link
                  href="/vip"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-gold-500 to-amber-500 text-black font-extrabold text-sm shadow-neon-gold hover:scale-105 transition-all"
                >
                  <span>Khám phá quyền lợi VIP</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Plans Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {MOCK_VIP_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    plan.isPopular
                      ? 'bg-[#18160B] border-gold-500 shadow-neon-gold scale-105 relative'
                      : 'bg-white/5 border-white/10 hover:border-gold-500/40'
                  }`}
                >
                  {plan.badge && (
                    <div className="text-[10px] font-extrabold text-gold-400 bg-gold-500/20 px-2.5 py-0.5 rounded-full w-max mb-2">
                      {plan.badge}
                    </div>
                  )}

                  <div>
                    <h3 className="text-base font-bold text-white mb-1">{plan.name}</h3>
                    <div className="text-xl font-black text-gold-400 mb-3 font-mono">
                      {formatVND(plan.priceMonthly)}
                      <span className="text-xs text-gray-400 font-normal">/tháng</span>
                    </div>

                    <ul className="space-y-2 text-xs text-gray-300 mb-4">
                      {plan.benefits.slice(0, 3).map((b, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href="/vip"
                    className={`w-full py-2.5 rounded-xl text-xs font-bold text-center transition-all ${
                      plan.isPopular
                        ? 'bg-gold-500 text-black shadow-neon-gold hover:bg-gold-400'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Đăng Ký Ngay
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
