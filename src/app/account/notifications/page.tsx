'use client';

import React from 'react';
import { Bell, Clock, CheckCircle2, Gift } from 'lucide-react';

export default function UserNotificationsPage() {
  const notificationsList = [
    { id: 1, title: '🔔 Đơn hàng #DH102948 đang được tự động xử lý', text: 'Hệ thống đã nhận link và khởi chạy 3.000 Follower Facebook.', time: '2026-08-13 10:20', type: 'order' },
    { id: 2, title: '🎉 Sự kiện nạp tiền nhận thưởng', text: 'Bạn vừa nhận được 50.000đ khuyến mãi cộng trực tiếp vào ví.', time: '2026-08-12 14:35', type: 'promo' },
    { id: 3, title: '⚡ Dịch vụ TikTok Follow hoàn thành 100%', text: 'Đơn hàng #DH102947 đã tăng đủ 1.000 Follower.', time: '2026-08-12 17:15', type: 'done' },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/10">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Bell className="w-6 h-6 text-neon-red" />
          <span>THÔNG BÁO HỆ THỐNG</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Cập nhật thông tin đơn hàng, số dư ví và khuyến mãi mới nhất.
        </p>
      </div>

      <div className="bg-[#0D0D14] border border-white/10 rounded-3xl p-6 shadow-glass divide-y divide-white/5">
        {notificationsList.map((item) => (
          <div key={item.id} className="py-4 space-y-1 flex items-start justify-between">
            <div className="space-y-1">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{item.title}</span>
              </div>
              <p className="text-xs text-gray-300">{item.text}</p>
              <div className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{item.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
