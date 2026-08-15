export interface ServiceAnnouncementData {
  id: string;
  enabled: boolean;
  badgeText: string;
  badgeCategory: 'HOT' | 'PROMO' | 'SYSTEM' | 'NEW';
  title: string;
  subtitle: string;
  bannerImage?: string;
  highlights: {
    icon: 'zap' | 'gift' | 'shield' | 'sparkles' | 'bell';
    title: string;
    description: string;
    badge?: string;
  }[];
  coupon?: {
    code: string;
    discountText: string;
    expiryText?: string;
  };
  ctaPrimary: {
    text: string;
    link: string;
  };
  ctaSecondary?: {
    text: string;
    link: string;
  };
  autoShowDelayMs?: number;
}

export const defaultAnnouncementData: ServiceAnnouncementData = {
  id: 'announcement_2026_v1',
  enabled: true,
  badgeText: '🔥 THÔNG BÁO HỆ THỐNG & KHUYẾN MÃI DỊCH VỤ',
  badgeCategory: 'HOT',
  title: 'Chào Mừng Đến Với Kho Dịch Vụ Digital Nguyên MMO 🚀',
  subtitle: 'Hệ thống giao dịch tự động 24/7 - Xử lý ngay lập tức - Bảo hành uy tín 100%',
  highlights: [
    {
      icon: 'gift',
      title: 'Sự Kiện Nạp Tiền Khuyến Mãi +10%',
      description: 'Nạp tiền tự động qua Ngân hàng / Momo từ 200.000đ tặng ngay +10% giá trị ví.',
      badge: 'Hot Offer',
    },
    {
      icon: 'zap',
      title: 'Hạ Tầng Tự Động 24/7 Siêu Tốc',
      description: 'Hơn 500+ Dịch vụ Facebook, TikTok, Instagram, YouTube & Telegram khởi chạy sau 1-5 phút.',
      badge: 'Auto 24/7',
    },
    {
      icon: 'sparkles',
      title: 'Mới Cập Nhật: Tài Khoản AI & Proxy IPv4',
      description: 'Cấp tài khoản ChatGPT Plus, Claude 3.5 Sonnet, Midjourney, Proxy tĩnh IPv4 Việt Nam/US giá ưu đãi.',
      badge: 'Mới Update',
    },
    {
      icon: 'shield',
      title: 'Bảo Hành & Hỗ Trợ Kỹ Thuật Trực Tuyến',
      description: 'Đội ngũ hỗ trợ 24/7 sẵn sàng giải đáp và bảo hành 1 đổi 1 nhanh chóng.',
    },
  ],
  coupon: {
    code: 'NGUYENMMO2026',
    discountText: 'Giảm trực tiếp 15% cho tất cả đơn hàng dịch vụ Social & AI',
    expiryText: 'Hạn dùng: Còn 50 lượt sử dụng',
  },
  ctaPrimary: {
    text: 'Khám Phá Dịch Vụ ngay',
    link: '#services-section',
  },
  ctaSecondary: {
    text: 'Nhận Hỗ Trợ Telegram',
    link: 'https://t.me/nguyenmmo07',
  },
  autoShowDelayMs: 600,
};
