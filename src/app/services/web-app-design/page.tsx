'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { sendDirectTelegramNotification } from '@/lib/telegram';
import {
  Code,
  Smartphone,
  Globe,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Rocket,
  Search,
  Layout,
  Layers,
  Server,
  Star,
  Check,
  PhoneCall,
  Send,
  MessageCircle,
  User as UserIcon,
  ArrowRight,
  ChevronDown,
  Lock,
  Cpu,
  TrendingUp,
  Award
} from 'lucide-react';

interface DesignPackage {
  id: string;
  name: string;
  badge?: string;
  description: string;
  target: string;
  time: string;
  features: string[];
  icon: string;
  isPopular?: boolean;
}

const DESIGN_PACKAGES: DesignPackage[] = [
  {
    id: 'pkg-landing',
    name: 'Landing Page Chuẩn SEO',
    badge: 'TIẾT KIỆM',
    description: 'Chuyên biệt cho giới thiệu dịch vụ, chạy Ads, chốt đơn nhanh với giao diện đẹp mắt và tốc độ load siêu cấp.',
    target: 'Cá nhân bán hàng, Spa, BĐS, Quảng cáo sản phẩm',
    time: '2 - 3 Ngày bàn giao',
    icon: '🚀',
    features: [
      'Giao diện UI/UX thiết kế độc quyền',
      'Tối ưu chuẩn SEO Onpage Google 100%',
      'Tốc độ tải trang siêu tốc < 1.0 giây',
      'Tương thích hoàn hảo 100% Mobile / Tablet',
      'Tích hợp Form nhận đơn & Chat Zalo/Telegram',
      'Bảo hành kỹ thuật vĩnh viễn',
      'Tặng 01 năm Hosting tốc độ cao'
    ]
  },
  {
    id: 'pkg-ecommerce',
    name: 'Website Bán Hàng E-Commerce',
    badge: 'PHỔ BIẾN NHẤT',
    isPopular: true,
    description: 'Website bán hàng chuyên nghiệp full chức năng giỏ hàng, quản lý đơn, tích hợp VietQR tự động.',
    target: 'Shop online, Doanh nghiệp bán lẻ, Chuỗi cửa hàng',
    time: '5 - 7 Ngày bàn giao',
    icon: '🛒',
    features: [
      'Tất cả tính năng của gói Landing Page',
      'Hệ thống quản lý Sản phẩm & Kho hàng',
      'Tự động gạch nợ thanh toán qua VietQR / Momo',
      'Tích hợp tính năng Mã giảm giá / Flash Sale',
      'Quản lý Đơn hàng & Xuất báo cáo doanh thu',
      'Tích hợp Chatbot AI tư vấn khách tự động',
      'Tặng Domain .com & Hosting NVMe 1 năm'
    ]
  },
  {
    id: 'pkg-mmo-panel',
    name: 'Website Dịch Vụ MMO / SMM Panel',
    badge: 'CHUYÊN GIA MMO',
    description: 'Hệ thống website kinh doanh dịch vụ MMO, SMM, Tài khoản AI giống Nguyên MMO với xử lý tự động 24/7.',
    target: 'Dân MMO, Agency SMM, Reseller dịch vụ số',
    time: '7 - 10 Ngày bàn giao',
    icon: '⚙️',
    features: [
      'Hệ thống Web như NguyenMMO.com',
      'Tích hợp Full API Provider SMM & MMO',
      'Nạp tiền tự động Bank VietQR 24/7',
      'Phân cấp bậc Thành viên (Cộng tác viên / VIP)',
      'Thông báo đơn mới tức thì qua Telegram Bot',
      'Dashboard Admin quản trị chuyên sâu',
      'Hướng dẫn vận hành & Hỗ trợ kéo Reseller'
    ]
  },
  {
    id: 'pkg-app-mobile',
    name: 'Mobile App (iOS & Android)',
    badge: 'CAO CẤP',
    description: 'Lập trình ứng dụng di động đa nền tảng iOS và Android mượt mà, đẩy app lên App Store & Ch Play.',
    target: 'Doanh nghiệp lớn, Startup, Thương hiệu riêng',
    time: '10 - 15 Ngày bàn giao',
    icon: '📱',
    features: [
      'Lập trình đa nền tảng iOS & Android',
      'Thiết kế giao diện App mượt mà chuẩn Apple/Google',
      'Tính năng Push Notification thông báo tức thì',
      'Đăng nhập qua OTP Phone, Google, Facebook',
      'Tích hợp ví điện tử & Cổng thanh toán',
      'Hỗ trợ duyệt và đẩy App lên App Store / Ch Play',
      'Bảo hành & Nâng cấp tính năng định kỳ'
    ]
  }
];

export default function WebAppDesignServicesPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [selectedPkg, setSelectedPkg] = useState<DesignPackage>(DESIGN_PACKAGES[1]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Form Registration State
  const [fullname, setFullname] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [telegram, setTelegram] = useState('');
  const [note, setNote] = useState('');
  const [serviceType, setServiceType] = useState(DESIGN_PACKAGES[1].name);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmitConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullname.trim()) {
      setSubmitError('Vui lòng nhập Họ tên của bạn!');
      return;
    }
    if (!phone.trim()) {
      setSubmitError('Vui lòng nhập Số điện thoại liên hệ!');
      return;
    }

    setSubmitError('');
    setIsSubmitting(true);

    const requestCode = `WEB-${Math.floor(10000 + Math.random() * 90000)}`;

    const payload = {
      requestCode,
      userId: user?.id || null,
      guestName: fullname.trim(),
      guestPhone: phone.trim(),
      guestEmail: email.trim() || user?.email || '',
      telegramUsername: telegram.trim(),
      serviceId: selectedPkg.id,
      serviceNameSnapshot: serviceType,
      categorySnapshot: 'WEB-APP-DESIGN',
      serviceTypeSnapshot: 'Thiết Kế Web & App',
      platform: 'Web & App Mobile',
      targetUrl: 'Tư vấn Thiết kế mới',
      quantity: 1,
      speed: '⚡ 24h Liên hệ tư vấn',
      unitPrice: 0,
      estimatedPrice: 0,
      customerNote: note.trim() || `Yêu cầu tư vấn báo giá gói: ${serviceType}`,
      serviceInputs: {
        packageId: selectedPkg.id,
        packageName: selectedPkg.name,
      }
    };

    try {
      const res = await fetch('/api/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const code = data?.requestCode || requestCode;

      if (!res.ok || !data?.success) {
        sendDirectTelegramNotification({
          requestCode: code,
          guestName: fullname.trim(),
          guestPhone: phone.trim(),
          guestEmail: email.trim(),
          telegramUsername: telegram.trim(),
          facebookUsername: '',
          categorySnapshot: 'WEB-APP-DESIGN',
          serviceNameSnapshot: serviceType,
          serviceTypeSnapshot: 'Thiết Kế Website & App Chuẩn SEO',
          targetUrl: 'Tư vấn Thiết kế Website / App',
          speed: '⚡ 24h Khảo sát & Báo giá',
          quantity: 1,
          unitPrice: 0,
          estimatedPrice: 0,
          customerNote: note.trim() || `Tư vấn gói: ${serviceType}`,
        }).catch(() => {});
      }

      setIsSubmitting(false);
      router.push(`/order-success?code=${code}&service=${encodeURIComponent(serviceType)}&qty=1&price=0&name=${encodeURIComponent(fullname)}&phone=${encodeURIComponent(phone)}`);
    } catch (err) {
      sendDirectTelegramNotification({
        requestCode,
        guestName: fullname.trim(),
        guestPhone: phone.trim(),
        guestEmail: email.trim(),
        telegramUsername: telegram.trim(),
        facebookUsername: '',
        categorySnapshot: 'WEB-APP-DESIGN',
        serviceNameSnapshot: serviceType,
        serviceTypeSnapshot: 'Thiết Kế Website & App Chuẩn SEO',
        targetUrl: 'Tư vấn Thiết kế Website / App',
        speed: '⚡ 24h Khảo sát & Báo giá',
        quantity: 1,
        unitPrice: 0,
        estimatedPrice: 0,
        customerNote: note.trim() || `Tư vấn gói: ${serviceType}`,
      }).catch(() => {});

      setIsSubmitting(false);
      router.push(`/order-success?code=${requestCode}&service=${encodeURIComponent(serviceType)}&qty=1&price=0&name=${encodeURIComponent(fullname)}&phone=${encodeURIComponent(phone)}`);
    }
  };

  const faqs = [
    {
      q: 'Website / App có chuẩn SEO Google và mượt mà trên Mobile không?',
      a: 'Tất cả các sản phẩm do Nguyên MMO thiết kế 100% đạt chuẩn Google PageSpeed từ 90+ điểm, tối ưu thẻ Meta, Schema Markup, Sitemap tự động và responsive hoàn hảo trên mọi thiết bị di động.'
    },
    {
      q: 'Sau khi hoàn thành tôi có được bàn giao toàn bộ mã nguồn (Source Code) không?',
      a: 'Có! Nguyên MMO bàn giao đầy đủ 100% Source code, tài khoản quản trị Admin, tài khoản Hosting/Server và hướng dẫn bạn tự quản trị dễ dàng.'
    },
    {
      q: 'Tôi có được bảo hành và hỗ trợ sau khi nghiệm thu không?',
      a: 'Chúng tôi bảo hành kỹ thuật vĩnh viễn cho tất cả các website/app. Đội ngũ kỹ thuật hỗ trợ 24/7 qua Zalo/Telegram bất cứ khi nào bạn cần nâng cấp hay sửa lỗi.'
    },
    {
      q: 'Website dịch vụ MMO / SMM Panel có tích hợp sẵn gạch nợ ngân hàng tự động không?',
      a: 'Có! Hệ thống tích hợp sẵn cổng nạp tiền tự động qua VietQR (MBBank, Techcombank, VCB, MoMo) tự động cộng tiền cho khách hàng trong 3-5 giây mà không tốn phí trung gian.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* 🧭 BREADCRUMB NAVIGATION */}
      <div className="flex items-center gap-2 text-xs text-gray-400 font-mono overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-neon-red transition-colors">Trang chủ</Link>
        <span>/</span>
        <Link href="/services" className="hover:text-neon-red transition-colors">Dịch vụ</Link>
        <span>/</span>
        <span className="text-neon-red font-bold uppercase">Thiết Kế Web & App Chuẩn SEO</span>
      </div>

      {/* 🚀 HERO SECTION */}
      <div className="border-beam-always p-8 sm:p-12 relative overflow-hidden text-white rounded-[36px] bg-[#0A0A12]/95 backdrop-blur-2xl">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-neon-red/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-red/10 border border-neon-red/30 text-neon-red font-black text-xs font-mono uppercase tracking-wider shadow-neon-red">
            <Sparkles className="w-4 h-4 text-neon-red fill-neon-red animate-pulse" />
            <span>DỊCH VỤ CÔNG NGHỆ CHUYÊN NGHIỆP NGUYÊN MMO</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            THIẾT KẾ WEBSITE & APP MOBILE <span className="text-neon-red border-b-4 border-neon-red">CHUẨN SEO</span> CHUYÊN NGHIỆP
          </h1>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Giải pháp xây dựng Website bán hàng, Landing Page chuyển đổi cao, Hệ thống Web MMO / SMM Panel tự động & App Mobile iOS / Android độc quyền. Giao diện sang trọng, tốc độ tải trang &lt; 1s, chuẩn SEO Top 1 Google.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 font-mono text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-gray-400">Dự án hoàn thành:</div>
              <div className="text-xl font-black text-white">500+ Web/App</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-gray-400">Điểm Google Speed:</div>
              <div className="text-xl font-black text-emerald-400">95 - 100/100</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-gray-400">Bảo hành kỹ thuật:</div>
              <div className="text-xl font-black text-sky-400">Vĩnh Viễn</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-gray-400">Tích hợp thanh toán:</div>
              <div className="text-xl font-black text-amber-400">Auto VietQR</div>
            </div>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="#pricing-section"
              className="px-6 py-4 bg-neon-red hover:bg-neon-red-hover text-white text-sm font-black rounded-2xl btn-beam-touch transition-all flex items-center gap-2 shadow-neon-red"
            >
              <Zap className="w-5 h-5 fill-white" />
              <span>XEM CÁC GÓI THIẾT KẾ</span>
            </a>
            <a
              href="#consult-form"
              className="px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/15 text-white text-sm font-bold rounded-2xl transition-all flex items-center gap-2"
            >
              <PhoneCall className="w-5 h-5 text-emerald-400" />
              <span>ĐĂNG KÝ TƯ VẤN BÁO GIÁ</span>
            </a>
          </div>
        </div>
      </div>

      {/* 🌟 6 LÝ DO CHỌN NGUYÊN MMO */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            TẠI SAO 500+ KHÁCH HÀNG CHỌN NGUYÊN MMO?
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
            Chúng tôi không chỉ làm website, chúng tôi tạo ra cỗ máy bán hàng & tự động hóa doanh thu cho bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#0D0D14] border border-white/10 space-y-3 hover:border-neon-red/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-neon-red/20 border border-neon-red/40 flex items-center justify-center text-neon-red font-bold">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Tối Ưu Chuẩn SEO Google 100%</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Cấu trúc HTML5 chuẩn Schema.org, tối ưu thẻ Heading H1-H6, sitemap tự động giúp bài viết và sản phẩm của bạn dễ dàng lên Top 1 Google.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0D0D14] border border-white/10 space-y-3 hover:border-neon-red/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Tốc Độ Tải Trang Siêu Tốc &lt; 1s</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Sử dụng công nghệ Next.js / React hiện đại nhất, nén ảnh WebP tự động, lưu Cache Server giúp khách hàng truy cập ngay lập tức không đợi chờ.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0D0D14] border border-white/10 space-y-3 hover:border-neon-red/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Bảo Mật Cao & Chống DDoS</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Tích hợp chứng chỉ SSL miễn phí, cấu hình mã hóa mật khẩu 2 lớp, Firewall Cloudflare bảo vệ website an toàn tuyệt đối khỏi hacker.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0D0D14] border border-white/10 space-y-3 hover:border-neon-red/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Nạp Tiền Auto VietQR 24/7</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Tích hợp hệ thống gạch nợ ngân hàng tự động. Khách chuyển khoản đúng nội dung là hệ thống tự duyệt đơn trong 3 giây.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0D0D14] border border-white/10 space-y-3 hover:border-neon-red/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 font-bold">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Giao Diện Độc Quyền UI/UX</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Thiết kế giao diện riêng biệt theo phong cách thương hiệu của bạn, tối ưu trải nghiệm thao tác trên điện thoại thông minh.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0D0D14] border border-white/10 space-y-3 hover:border-neon-red/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Hỗ Trợ & Bảo Hành Vĩnh Viễn</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Cam kết đồng hành 24/7. Hướng dẫn quản trị 1-1 qua UltraViewer/Zalo và khắc phục mọi sự cố kỹ thuật hoàn toàn miễn phí.
            </p>
          </div>
        </div>
      </div>

      {/* 💰 CÁC GÓI DỊCH VỤ SECTION */}
      <div id="pricing-section" className="space-y-6 pt-4">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-red/10 border border-neon-red/30 text-neon-red font-mono text-xs font-bold uppercase">
            ● DANH MỤC THIẾT KẾ CHUYÊN NGHIỆP
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            GÓI THIẾT KẾ WEBSITE & APP THEO YÊU CẦU
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
            Liên hệ báo giá theo quy mô & tính năng thực tế – Không phát sinh phụ phí – Bàn giao đúng hạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {DESIGN_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`p-6 rounded-[32px] flex flex-col justify-between space-y-6 transition-all relative ${
                pkg.isPopular
                  ? 'bg-gradient-to-b from-[#141424] to-[#0A0A12] border-2 border-neon-red shadow-[0_0_30px_rgba(255,30,66,0.3)]'
                  : 'bg-[#0D0D14] border border-white/10 hover:border-white/20'
              }`}
            >
              {pkg.badge && (
                <span className="absolute -top-3.5 right-6 px-3 py-1 bg-neon-red text-white text-[10px] font-black uppercase tracking-wider rounded-full font-mono shadow-neon-red">
                  {pkg.badge}
                </span>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2.5 rounded-2xl bg-white/5 border border-white/10">{pkg.icon}</span>
                  <div>
                    <h3 className="text-base font-black text-white leading-tight">{pkg.name}</h3>
                    <div className="text-[11px] text-emerald-400 font-mono font-bold mt-0.5">{pkg.time}</div>
                  </div>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed">{pkg.description}</p>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[10px] text-gray-400 uppercase font-bold font-mono">Đối tượng phù hợp:</div>
                  <div className="text-xs font-semibold text-gray-200">{pkg.target}</div>
                </div>

                {/* Consultation Badge (Removed fixed prices) */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-bold uppercase font-mono">Báo Giá Chi Tiết:</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black font-mono">
                    TƯ VẤN 24/7 ⚡
                  </span>
                </div>

                {/* Features list */}
                <ul className="space-y-2 text-xs text-gray-300 pt-2">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  setSelectedPkg(pkg);
                  setServiceType(pkg.name);
                  const el = document.getElementById('consult-form');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-full py-3.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  pkg.isPopular
                    ? 'bg-neon-red hover:bg-neon-red-hover text-white shadow-neon-red btn-beam-touch'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>LIÊN HỆ BÁO GIÁ GÓI NÀY</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 🔄 QUY TRÌNH TRIỂN KHAI 5 BƯỚC */}
      <div className="p-8 sm:p-10 rounded-[36px] bg-[#0D0D15] border border-white/10 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            QUY TRÌNH TRIỂN KHAI NGHỆ THUẬT 5 BƯỚC
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Đảm bảo dự án bàn giao đúng hạn 100% với chất lượng vượt mong đợi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 pt-4">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 relative">
            <span className="text-2xl font-black text-neon-red font-mono">01.</span>
            <h4 className="text-sm font-bold text-white">Khảo Sát & Tư Vấn</h4>
            <p className="text-[11px] text-gray-400">Tiếp nhận yêu cầu, phân tích đối thủ & tư vấn cấu trúc Web/App tối ưu.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 relative">
            <span className="text-2xl font-black text-purple-400 font-mono">02.</span>
            <h4 className="text-sm font-bold text-white">Thiết Kế UI/UX</h4>
            <p className="text-[11px] text-gray-400">Dựng bản vẽ demo giao diện thương hiệu độc quyền cho khách duyệt.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 relative">
            <span className="text-2xl font-black text-sky-400 font-mono">03.</span>
            <h4 className="text-sm font-bold text-white">Lập Trình & SEO</h4>
            <p className="text-[11px] text-gray-400">Viết code chuẩn SEO, tối ưu tốc độ & tích hợp tính năng tự động.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 relative">
            <span className="text-2xl font-black text-amber-400 font-mono">04.</span>
            <h4 className="text-sm font-bold text-white">Kiểm Thử & Test</h4>
            <p className="text-[11px] text-gray-400">Test chạy thử trên Mobile, kiểm tra tốc độ, bảo mật SSL & thanh toán.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 relative">
            <span className="text-2xl font-black text-emerald-400 font-mono">05.</span>
            <h4 className="text-sm font-bold text-white">Bàn Giao & Bảo Hành</h4>
            <p className="text-[11px] text-gray-400">Bàn giao Full Source Code, hướng dẫn quản trị & bảo hành vĩnh viễn.</p>
          </div>
        </div>
      </div>

      {/* 📝 FORM ĐĂNG KÝ TƯ VẤN SECTION (FORM LIÊN HỆ) */}
      <div id="consult-form" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
        
        {/* LEFT INFO (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-[36px] bg-gradient-to-br from-neon-red/15 via-[#0D0D15] to-[#0A0A12] border border-neon-red/30 space-y-6 shadow-2xl">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-neon-red/20 text-neon-red text-[11px] font-mono font-bold uppercase">
                HOTLINE KĨ THUẬT 24/7
              </span>
              <h3 className="text-2xl font-black text-white">BẠN CẦN TƯ VẤN BÁO GIÁ RIÊNG?</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Đội ngũ lập trình viên kinh nghiệm từ Nguyên MMO sẵn sàng lắng nghe ý tưởng và báo giá chi tiết trong vòng 15 phút.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href="https://t.me/nguyenmmo07"
                target="_blank"
                rel="noreferrer"
                className="p-4 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 rounded-2xl text-xs font-bold text-sky-300 flex items-center gap-3 transition-all"
              >
                <Send className="w-5 h-5 text-sky-400 shrink-0" />
                <div>
                  <div>Telegram Kĩ Thuật Viên</div>
                  <div className="text-[11px] text-gray-400 font-mono">@nguyenmmo07 (Online 24/7)</div>
                </div>
              </a>

              <a
                href="https://zalo.me/0934811307"
                target="_blank"
                rel="noreferrer"
                className="p-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 rounded-2xl text-xs font-bold text-blue-300 flex items-center gap-3 transition-all"
              >
                <MessageCircle className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <div>Zalo Trực Tuyến</div>
                  <div className="text-[11px] text-gray-400 font-mono">0934811307 (Tư vấn nhanh)</div>
                </div>
              </a>

              <a
                href="https://www.facebook.com/nguyenads7"
                target="_blank"
                rel="noreferrer"
                className="p-4 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 rounded-2xl text-xs font-bold text-indigo-300 flex items-center gap-3 transition-all"
              >
                <UserIcon className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <div>Facebook Cá Nhân</div>
                  <div className="text-[11px] text-gray-400 font-mono">nguyenads7</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT FORM (7 COLS) */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmitConsultation}
            className="border-beam-always p-8 rounded-[36px] bg-[#0D0D15]/95 backdrop-blur-xl space-y-5 shadow-2xl text-white"
          >
            <div className="pb-3 border-b border-white/10 space-y-1">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Rocket className="w-5 h-5 text-neon-red" />
                <span>FORM ĐĂNG KÝ TƯ VẤN & BÁO GIÁ</span>
              </h3>
              <p className="text-xs text-gray-400">Vui lòng điền thông tin bên dưới, nhân viên hỗ trợ sẽ liên hệ báo giá chi tiết ngay.</p>
            </div>

            {submitError && (
              <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold">
                {submitError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-200">Gói Dịch Vụ Muốn Tư Vấn:</label>
              <select
                value={serviceType}
                onChange={(e) => {
                  setServiceType(e.target.value);
                  const found = DESIGN_PACKAGES.find(p => p.name === e.target.value);
                  if (found) setSelectedPkg(found);
                }}
                className="w-full px-4 py-3 bg-[#050508] border border-white/15 rounded-2xl text-xs text-white outline-none focus:border-neon-red font-bold"
              >
                {DESIGN_PACKAGES.map((pkg) => (
                  <option key={pkg.id} value={pkg.name}>
                    {pkg.name} (Tư vấn báo giá)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-200">Họ và tên của bạn: *</label>
                <input
                  type="text"
                  required
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full px-4 py-3 bg-[#050508] border border-white/15 rounded-2xl text-xs text-white outline-none focus:border-neon-red"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-200">Số điện thoại / Zalo: *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0934811307"
                  className="w-full px-4 py-3 bg-[#050508] border border-white/15 rounded-2xl text-xs text-white outline-none focus:border-neon-red font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-200">Địa chỉ Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@gmail.com"
                  className="w-full px-4 py-3 bg-[#050508] border border-white/15 rounded-2xl text-xs text-white outline-none focus:border-neon-red"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-200">Username Telegram (nếu có):</label>
                <input
                  type="text"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  placeholder="@username"
                  className="w-full px-4 py-3 bg-[#050508] border border-white/15 rounded-2xl text-xs text-white outline-none focus:border-neon-red font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-200">Ghi chú thêm yêu cầu của bạn:</label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: Tôi muốn làm web bán khóa học tích hợp nạp tiền tự động giống NguyenMMO..."
                className="w-full px-4 py-3 bg-[#050508] border border-white/15 rounded-2xl text-xs text-white outline-none focus:border-neon-red"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-neon-red hover:bg-neon-red-hover text-white text-base font-black rounded-2xl btn-beam-touch hover:scale-[1.01] transition-all flex items-center justify-center gap-2 shadow-neon-red overflow-hidden disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>ĐANG GỬI YÊU CẦU...</span>
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-white animate-pulse" />
                  <span>⚡ GỬI YÊU CẦU BÁO GIÁ NGAY</span>
                </>
              )}
            </button>

            <div className="text-center text-[11px] text-gray-400 font-medium">
              * Chúng tôi cam kết bảo mật 100% thông tin cá nhân của bạn.
            </div>
          </form>
        </div>

      </div>

      {/* ❓ HỎI ĐÁP FAQ SECTION */}
      <div className="p-8 sm:p-10 rounded-[36px] bg-[#0D0D15] border border-white/10 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            CÂU HỎI THƯỜNG GẶP (FAQ)
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">Giải đáp các thắc mắc phổ biến của khách hàng khi làm Web/App tại Nguyên MMO.</p>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-white/10 rounded-2xl overflow-hidden bg-white/5">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-white flex items-center justify-between hover:bg-white/5 transition-all"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openFaqIndex === idx ? 'rotate-180 text-neon-red' : 'text-gray-400'}`} />
              </button>
              {openFaqIndex === idx && (
                <div className="p-4 pt-0 text-xs text-gray-300 border-t border-white/5 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
