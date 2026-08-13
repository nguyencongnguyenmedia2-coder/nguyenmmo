import { Resource, Review } from '@/types';

export const MOCK_RESOURCES: Resource[] = [
  {
    id: 'res-1',
    title: 'Bộ 1.000+ Prompt ChatGPT & Claude Chuyên Viết Kịch Bản TikTok Shop',
    slug: 'bo-1000-prompt-chatgpt-viet-kich-ban-tiktok',
    category: 'AI Prompt',
    type: 'prompt',
    isVipOnly: false,
    description: 'Tuyển tập Prompt thực chiến đã tạo ra hàng triệu view cho các TikToker nổi tiếng.',
    previewContent: `[PROMPT MAU MONG CUONG TIKTOK]
"Hãy đóng vai một chuyên gia sáng tạo nội dung TikTok Shop triệu view. Tôi muốn tạo một kịch bản video 45 giây giới thiệu sản phẩm [Tên Sản Phẩm]. 

Yêu cầu kịch bản bao gồm:
1. Hook (3 giây đầu): Câu nói gây sốc hoặc tò mò giữ chân người xem.
2. Agitate (15 giây tiếp): Nêu bật 3 nỗi đau lớn nhất mà khách hàng gặp phải.
3. Solution (20 giây): Giới thiệu giải pháp vượt trội của [Tên Sản Phẩm].
4. Call to Action (7 giây): Lời kêu gọi bấm vào giỏ hàng góc trái màn hình.

Viết kịch bản theo định dạng bảng: Thời gian | Màn hình/Hành động | Lời thoại | Âm thanh."`,
    downloadCount: 4520,
    fileSize: '2.5 MB',
    fileUrl: 'https://drive.google.com/file/d/demo-prompt-tiktok',
    rating: 4.9,
  },
  {
    id: 'res-2',
    title: 'Template Landing Page Bán Hàng E-Commerce UI Cyber Dark Premium (Next.js/Tailwind)',
    slug: 'template-landing-page-ecommerce-cyber-dark',
    category: 'Template',
    type: 'template',
    isVipOnly: true,
    description: 'Mẫu giao diện web bán sản phẩm số hiện đại, chuẩn SEO, tối ưu tỷ lệ chuyển đổi.',
    previewContent: `// CODE SAMPLE - HERO SECTION CYBER DARK COMPONENT
import React from 'react';
import { Zap } from 'lucide-react';

export const CyberHero = () => (
  <section className="bg-[#050507] text-white py-20 px-6 text-center border-b border-neon-red/30">
    <span className="px-3 py-1 bg-neon-red/20 text-neon-red text-xs font-bold rounded-full font-mono">
      ⚡ NEXT-GEN E-COMMERCE UI
    </span>
    <h1 className="text-4xl font-black mt-4">DIGITAL MMO SAAS MARKETPLACE</h1>
    <p className="text-gray-400 max-w-xl mx-auto mt-2 text-sm">
      Tối ưu tốc độ tải 100/100 Google PageSpeed, sẵn sàng tích hợp Supabase backend.
    </p>
  </section>
);`,
    downloadCount: 1890,
    fileSize: '18.4 MB',
    fileUrl: 'https://drive.google.com/file/d/demo-template-cyber',
    rating: 5.0,
  },
  {
    id: 'res-3',
    title: 'Ebook Hướng Dẫn Nuôi Dàn Account Facebook & TikTok Không Bị Die Proxy',
    slug: 'ebook-huong-dan-nuoi-account-facebook-tiktok',
    category: 'Ebook MMO',
    type: 'ebook',
    isVipOnly: true,
    description: 'Tài liệu hướng dẫn chọn máy chủ VPS, cấu hình Proxy tĩnh và kịch bản nuôi tự động.',
    previewContent: `📚 MỤC LỤC EBOOK THỰC CHUYÊN NUÔI DAN ACCOUNT MMO (PDF 85 TRANG)

Chương 1: Kiến thức cốt lõi về Fingerprint Browser & Proxy IPv4/IPv6.
Chương 2: Hướng dẫn cấu hình VPS Windows Server treo tool 24/7.
Chương 3: Kịch bản tương tác ngẫu nhiên (Lướt Feeds, Xem Reels, Thả Tim) tránh quét Checkpoint.
Chương 4: Quy trình xử lý khi nick bị khóa kháng 282 / 956 thành công 90%.
Chương 5: Quản lý 500+ nick chỉ với 1 máy vi tính thông qua phần mềm Automation.`,
    downloadCount: 2310,
    fileSize: '8.1 MB',
    fileUrl: 'https://drive.google.com/file/d/demo-ebook-nuoi-nick',
    rating: 4.88,
  },
  {
    id: 'res-4',
    title: 'Extension Auto Seeding Comment & Thả Tim Facebook Đa Luồng',
    slug: 'extension-auto-seeding-comment-facebook',
    category: 'Tool & Extension',
    type: 'extension',
    isVipOnly: true,
    description: 'Tiện ích mở rộng Chrome hỗ trợ Seeding bài viết trực tiếp từ trình duyệt.',
    previewContent: `⚙️ HƯỚNG DẪN CÀI ĐẶT THIẾT BỊ EXTENSION CHROME:

Step 1: Tải file nén .zip từ link bên dưới và giải nén folder.
Step 2: Mở trình duyệt Google Chrome -> Truy cập chrome://extensions/
Step 3: Bật công tắc "Developer Mode" (Chế độ dành cho nhà phát triển) góc trên bên phải.
Step 4: Bấm "Load unpacked" (Tải tiện ích đã giải nén) -> Chọn thư mục vừa giải nén.
Step 5: Mở biểu tượng Extension trên thanh địa chỉ, dán danh sách tài khoản Cookie và bắt đầu Seeding!`,
    downloadCount: 3100,
    fileSize: '5.2 MB',
    fileUrl: 'https://drive.google.com/file/d/demo-extension-seeding',
    rating: 4.95,
  },
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    userName: 'Nguyễn Tiến',
    userAvatar: '/avatars/user-1.jpg',
    serviceName: 'Bộ 1.000+ Prompt ChatGPT',
    rating: 5,
    comment: 'Prompt viết kịch bản quá ngon! Làm video TikTok ra đơn ngay ngày đầu tiên.',
    date: '10/08/2026',
    verified: true,
  },
];
