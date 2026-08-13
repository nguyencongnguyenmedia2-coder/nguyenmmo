import { VIPPlan } from '@/types';

export const MOCK_VIP_PLANS: VIPPlan[] = [
  {
    id: 'vip-basic',
    name: 'VIP BASIC',
    slug: 'basic',
    priceMonthly: 99000,
    discountRate: 0.05,
    benefits: [
      'Giảm giá 5% toàn bộ dịch vụ SMM & MMO',
      'Hệ thống ưu tiên tự động xử lý đơn hàng',
      'Truy cập kho Prompt AI cơ bản',
      'Kênh hỗ trợ Telegram riêng',
      'Tặng 1 Coupon giảm giá 10% hàng tháng',
    ],
    isPopular: false,
    badge: 'TIẾT KIỆM',
  },
  {
    id: 'vip-pro',
    name: 'VIP PRO',
    slug: 'pro',
    priceMonthly: 199000,
    discountRate: 0.12,
    benefits: [
      'Giảm giá tới 12% toàn bộ hệ thống dịch vụ',
      'Ưu tiên hàng đầu (Priority Queue) tốc độ ⚡',
      'Truy cập Kho Tài Nguyên VIP (Tool + Template)',
      'Công cụ AI Seeding độc quyền',
      'Tặng 2 Coupon giảm giá 20% hàng tháng',
      'Hỗ trợ ưu tiên 24/7 từ kỹ thuật viên',
    ],
    isPopular: true,
    badge: '🔥 PHỔ BIẾN NHẤT',
  },
  {
    id: 'vip-business',
    name: 'VIP BUSINESS',
    slug: 'business',
    priceMonthly: 499000,
    discountRate: 0.20,
    benefits: [
      'Áp dụng bảng giá Đại Lý (Giảm 20% sỉ)',
      'Hỗ trợ riêng 1-1 qua Zalo / Telegram VIP 24/7',
      'Tích hợp API kết nối trực tiếp hệ thống riêng',
      'Mở khóa toàn bộ Kho Tool MMO & Script Pro',
      'Tặng 500.000đ Balance tài khoản khi gia hạn 1 năm',
      'Chính sách hoàn tiền không lý do trong 7 ngày',
    ],
    isPopular: false,
    badge: 'ĐẠI LÝ & AGENCY',
  },
];
