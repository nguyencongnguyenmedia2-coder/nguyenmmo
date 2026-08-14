import { Resource, Review } from '@/types';

export const MOCK_RESOURCES: Resource[] = [
  {
    id: 'res-1',
    title: 'Bộ Kịch Bản AI Prompt Master Copywriting & SEO Marketing',
    slug: 'ai-prompt-master-copywriting',
    category: 'AI Prompt',
    type: 'prompt',
    isVipOnly: false,
    description: 'Tổng hợp 50+ câu lệnh ChatGPT & Claude 3.5 Sonnet chuyên sâu giúp tự động viết bài chuẩn SEO, kịch bản video TikTok và nội dung quảng cáo Facebook chuyển đổi cao.',
    previewContent: `[HƯỚNG DẪN SỬ DỤNG AI PROMPT COPYWRITING]
1. Đóng vai: Chuyên gia Copywriting & Direct Response Marketing với 10 năm kinh nghiệm.
2. Mục tiêu: Viết kịch bản quảng cáo Facebook Ads cho sản phẩm [TÊN SẢN PHẨM].
3. Công thức: Áp dụng cấu trúc AIDA (Attention - Interest - Desire - Action).
4. Tone & Mood: Thúc giục, gây tò mò, cam kết giá trị vượt trội.

[PROMPT MẪU PHẦN MỞ ĐẦU]
"Hãy viết 3 tiêu đề giật gân đánh trúng nỗi đau khách hàng đang muốn tăng doanh số bán hàng online nhưng chưa biết bắt đầu từ đâu..."`,
    downloadCount: 3420,
    fileSize: '1.2 MB',
    fileUrl: 'https://drive.google.com',
    rating: 5.0,
  },
  {
    id: 'res-2',
    title: 'Bộ UI/UX Landing Page SaaS & MMO Marketplace (Figma Source)',
    slug: 'ui-landing-page-saas-mmo',
    category: 'Template UI',
    type: 'template',
    isVipOnly: true,
    description: 'File thiết kế Figma chuẩn Dark Mode mượt mà, đầy đủ các Component, Auto Layout, responsive cho giao diện website cung cấp dịch vụ SMM, AI Tools & MMO.',
    previewContent: `[THÔNG TIN FILE THIẾT KẾ FIGMA]
- Hệ màu: Dark Mode Futuristic (#050507, #FF1E42, #0D0D14)
- Font chữ: Inter & Plus Jakarta Sans
- Số lượng Screen: 18 Trang (Trang chủ, Chi tiết dịch vụ, Dashboard, Ví tiền, Checkout...)
- Định dạng: Figma File (.fig) + Assets PNG/SVG HD`,
    downloadCount: 1890,
    fileSize: '45.8 MB',
    fileUrl: 'https://drive.google.com',
    rating: 4.9,
  },
  {
    id: 'res-3',
    title: 'Ebook Hướng Dẫn Xây Dựng Kênh TikTok Shop Đạt 10.000 Đơn/Tháng',
    slug: 'ebook-tiktok-shop-10k-don',
    category: 'Ebook MMO',
    type: 'ebook',
    isVipOnly: false,
    description: 'Tài liệu độc quyền chia sẻ quy trình xây kênh từ 0 đồng, tối ưu hóa livestream bán hàng, booking KOLs và vận hành kho hàng hiệu quả.',
    previewContent: `[MỤC LỤC EBOOK BẢN QUYỀN NGUYÊN MMO]
Chương 1: Thuật toán đề xuất video TikTok năm 2026.
Chương 2: Quy trình sản xuất 10 video ngắn trong 2 giờ với AI.
Chương 3: Chiến lược chốt đơn Livestream đỉnh cao.
Chương 4: Quản lý chi phí quảng cáo Ads & Affiliate TikTok Shop.`,
    downloadCount: 5120,
    fileSize: '8.4 MB',
    fileUrl: 'https://drive.google.com',
    rating: 5.0,
  },
  {
    id: 'res-4',
    title: 'Tool Python Automation Auto Check & Quản Lý Dàn Proxy/VPS',
    slug: 'tool-python-auto-check-proxy',
    category: 'Tool & Extension',
    type: 'extension',
    isVipOnly: true,
    description: 'Mã nguồn Python độc lập hỗ trợ kiểm tra tốc độ ping, vị trí IP, loại HTTP/SOCKS5 và tự động xoay IP Proxy theo chu kỳ cho dân chạy MMO.',
    previewContent: `# TOOL PYTHON AUTOMATION CHECK PROXY REALTIME
import requests
import time

def check_proxy(proxy_str):
    proxies = {"http": f"http://{proxy_str}", "https": f"http://{proxy_str}"}
    try:
        start = time.time()
        res = requests.get("https://api.ipify.org?format=json", proxies=proxies, timeout=5)
        latency = round((time.time() - start) * 1000, 2)
        print(f"✅ Proxy Live: {res.json()['ip']} | Latency: {latency}ms")
    except Exception as e:
        print(f"❌ Proxy Dead: {proxy_str}")`,
    downloadCount: 2780,
    fileSize: '3.1 MB',
    fileUrl: 'https://drive.google.com',
    rating: 4.8,
  },
  {
    id: 'res-5',
    title: 'Bộ Prompt Midjourney & Stable Diffusion Tạo Banner Sản Phẩm 8K',
    slug: 'prompt-midjourney-banner-8k',
    category: 'AI Prompt',
    type: 'prompt',
    isVipOnly: false,
    description: 'Bộ sưu tập 100+ Prompt tạo ảnh minh họa 3D Cyberpunk, banner sản phẩm thương mại điện tử sang trọng chuẩn nét 8K render Octane.',
    previewContent: `[PROMPT SAMPLE MIDJOURNEY v6]
/imagine prompt: Futuristic 3D digital product display pod, neon glowing red laser outline, dark obsidian glass platform, floating holographic icons, ultra detailed, octane render, 8k resolution, cinematic lighting --ar 16:9 --v 6.0`,
    downloadCount: 4100,
    fileSize: '2.0 MB',
    fileUrl: 'https://drive.google.com',
    rating: 4.9,
  },
  {
    id: 'res-6',
    title: 'Full Source Code Next.js 14 Web Dịch Vụ MMO & SMM Panel',
    slug: 'source-code-nextjs-smm-panel',
    category: 'Template UI',
    type: 'template',
    isVipOnly: true,
    description: 'Mã nguồn đầy đủ giao diện & API tích hợp sẵn Supabase, Telegram Bot Notification, TailwindCSS và Dark Mode chuẩn Pro.',
    previewContent: `[THÔNG TIN MÃ NGUỒN FULLSTACK]
- Framework: Next.js 14 (App Router) + TypeScript
- Styling: TailwindCSS + Glassmorphism Design System
- Database: Supabase Integration & Local File Fallback
- Feature: Dashboard Admin, Phân quyền Roles, Quản lý đơn hàng, Telegram Bot API`,
    downloadCount: 1450,
    fileSize: '18.5 MB',
    fileUrl: 'https://drive.google.com',
    rating: 5.0,
  },
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    userName: 'Nguyễn Văn Hải',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    serviceName: 'Tăng Follow TikTok & Facebook',
    rating: 5,
    comment: 'Hệ thống chạy cực kỳ nhanh và ổn định. Mình buff follow cho shop bán hàng TikTok mà chỉ sau 15 phút là hoàn thành, tỷ lệ tụt rớt gần như bằng 0. Rất yên tâm khi sử dụng!',
    date: '2026-08-10',
    verified: true
  },
  {
    id: 'rev-2',
    userName: 'Trần Minh Hoàng',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    serviceName: 'Proxy Dân Cư IPv4 / IPv6',
    rating: 5,
    comment: 'Mình nuôi dàn tài khoản MMO lớn cần Proxy sạch và tốc độ cao. Dịch vụ ở Digital MMO đáp ứng vượt mong đợi, kết nối mượt mà, hỗ trợ kỹ thuật 24/7 rất tận tình.',
    date: '2026-08-12',
    verified: true
  },
  {
    id: 'rev-3',
    userName: 'Lê Thảo My',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    serviceName: 'Dịch vụ Mắt Livestream & Interaction',
    rating: 5,
    comment: 'Từ ngày biết đến Digital MMO, mỗi buổi livestream bán hàng của mình thu hút hơn hẳn nhờ mắt xem ổn định và seeding bình luận tự nhiên. Tỷ lệ chốt đơn tăng đáng kể!',
    date: '2026-08-13',
    verified: true
  },
  {
    id: 'rev-4',
    userName: 'Phạm Quốc Cường',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    serviceName: 'Tài khoản VIA & BM Facebook Ads',
    rating: 5,
    comment: 'Bên này dịch vụ tự động hóa rất hiện đại, nạp tiền vào là xử lý ngay lập tức. Giá cả cạnh tranh nhất thị trường và đã giới thiệu cho nhiều anh em trong team MMO cùng dùng.',
    date: '2026-08-14',
    verified: true
  }
];
