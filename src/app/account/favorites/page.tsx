'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { MOCK_SERVICES } from '@/data/mockServices';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { Heart } from 'lucide-react';

export default function UserFavoritesPage() {
  const { favorites } = useAuth();
  const favServices = MOCK_SERVICES.filter((s) => favorites.includes(s.id));

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/10">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Heart className="w-6 h-6 text-neon-red" />
          <span>DỊCH VỤ ĐÃ YÊU THÍCH</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Danh sách dịch vụ bạn đã lưu lại để nhanh chóng truy cập và đặt đơn.
        </p>
      </div>

      {favServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-[#0D0D14] border border-white/10 rounded-3xl space-y-3">
          <Heart className="w-12 h-12 text-gray-600 mx-auto" />
          <p className="text-gray-300 font-bold text-sm">Bạn chưa bấm chọn dịch vụ yêu thích nào.</p>
        </div>
      )}
    </div>
  );
}
