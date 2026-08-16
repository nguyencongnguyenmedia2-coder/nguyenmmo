'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MOCK_SERVICES } from '@/data/mockServices';
import { formatVND } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { CategorySlug, Service } from '@/types';
import { sendDirectTelegramNotification } from '@/lib/telegram';
import { 
  Zap, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Minus, 
  Plus, 
  Heart, 
  Info, 
  ChevronDown,
  Lock,
  Bot,
  Server,
  BookOpen,
  User as UserIcon,
  PhoneCall,
  Mail,
  Send,
  MessageCircle,
  X,
  ArrowRight,
  Sparkles,
  Check,
  Package,
  Layers,
  Award
} from 'lucide-react';

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [service, setService] = useState<Service>(() => {
    try {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('nguyenmmo_services');
        if (cached) {
          const parsed: Service[] = JSON.parse(cached);
          const found = parsed.find((s) => s.slug === slug || s.id === slug);
          if (found) return found;
        }
      }
    } catch (e) {}
    return MOCK_SERVICES.find((s) => s.slug === slug || s.id === slug) || MOCK_SERVICES[0];
  });

  useEffect(() => {
    try {
      const cached = localStorage.getItem('nguyenmmo_services');
      if (cached) {
        const parsed: Service[] = JSON.parse(cached);
        const found = parsed.find((s) => s.slug === slug || s.id === slug);
        if (found) {
          setService(found);
          return;
        }
      }
    } catch (e) {}

    const foundMock = MOCK_SERVICES.find((s) => s.slug === slug || s.id === slug);
    if (foundMock) setService(foundMock);
  }, [slug]);

  const categoryType = getCategoryType(service.category as CategorySlug);

  const { user, favorites, toggleFavorite } = useAuth();
  const isFav = favorites.includes(service.id);

  // General Form States
  const [targetLink, setTargetLink] = useState('');
  const [quantity, setQuantity] = useState(
    categoryType === 'smm' ? Math.max(100, service.min || 100) : 1
  );
  const [activeTab, setActiveTab] = useState<'desc' | 'terms' | 'faq'>('desc');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [inputError, setInputError] = useState('');

  // SMM Specific Option
  const [smmServerOption, setSmmServerOption] = useState<'fast' | 'vip' | 'natural'>('fast');

  // AI Specific Options
  const [aiDeliveryType, setAiDeliveryType] = useState<'auto_stock' | 'upgrade_email'>('auto_stock');
  const [aiCustomerEmail, setAiCustomerEmail] = useState(user?.email || '');
  const [aiDuration, setAiDuration] = useState<number>(1);

  // Proxy / VPS Specific Options
  const [proxyLocation, setProxyLocation] = useState('Việt Nam 🇻🇳');
  const [proxyProtocol, setProxyProtocol] = useState<'HTTP' | 'SOCKS5'>('HTTP');
  const [proxyAuthMode, setProxyAuthMode] = useState<'user_pass' | 'whitelist'>('user_pass');
  const [whitelistIp, setWhitelistIp] = useState('');

  // Digital / Course Specific Options
  const [courseCustomerEmail, setCourseCustomerEmail] = useState(user?.email || '');

  // REQUEST MODAL STATES
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestStep, setRequestStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Customer Contact Form State
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestPhone, setGuestPhone] = useState(user?.phone || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [facebookUsername, setFacebookUsername] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [modalError, setModalError] = useState('');

  function getCategoryType(category: CategorySlug): 'smm' | 'ai' | 'proxy' | 'digital' {
    if (['facebook', 'tiktok', 'instagram', 'youtube', 'telegram', 'zalo', 'shopee'].includes(category)) return 'smm';
    if (category === 'ai') return 'ai';
    if (category === 'mmo') return 'proxy';
    return 'digital';
  }

  // Price Calculation Logic
  const baseUnitPrice = service.salePrice || service.price;

  let unitPrice = baseUnitPrice;
  if (categoryType === 'smm' && smmServerOption === 'vip') unitPrice = Math.round(baseUnitPrice * 1.25);
  if (categoryType === 'ai' && aiDuration === 3) unitPrice = Math.round(baseUnitPrice * 2.7);
  if (categoryType === 'ai' && aiDuration === 12) unitPrice = Math.round(baseUnitPrice * 9.5);

  let estimatedPrice = 0;
  if (categoryType === 'smm') {
    estimatedPrice = Math.round((unitPrice / 1000) * quantity);
  } else {
    estimatedPrice = unitPrice * quantity;
  }
  estimatedPrice = Math.max(250000, estimatedPrice);

  const handleDecrease = () => {
    const step = categoryType === 'smm' ? 100 : 1;
    const minLimit = categoryType === 'smm' ? (service.min || 100) : 1;
    const nextVal = quantity - step;
    if (nextVal >= minLimit) setQuantity(nextVal);
  };

  const handleIncrease = () => {
    const step = categoryType === 'smm' ? 100 : 1;
    const maxLimit = categoryType === 'smm' ? (service.max || 500000) : 50;
    const nextVal = quantity + step;
    if (nextVal <= maxLimit) setQuantity(nextVal);
  };

  // Open Request Modal Validation
  const handleOpenRequestModal = () => {
    if (categoryType === 'smm' && !targetLink.trim()) {
      setInputError('Vui lòng dán đường dẫn (Link/ID) bài viết/trang cá nhân cần chạy!');
      return;
    }
    if (categoryType === 'ai' && aiDeliveryType === 'upgrade_email' && !aiCustomerEmail.trim()) {
      setInputError('Vui lòng nhập Email chính chủ để hệ thống thực hiện nâng cấp!');
      return;
    }
    if (categoryType === 'proxy' && proxyAuthMode === 'whitelist' && !whitelistIp.trim()) {
      setInputError('Vui lòng nhập địa chỉ IP Whitelist của bạn!');
      return;
    }
    if (categoryType === 'digital' && !courseCustomerEmail.trim()) {
      setInputError('Vui lòng nhập Email nhận thông tin mở khóa học / tài nguyên!');
      return;
    }

    setInputError('');
    setIsRequestModalOpen(true);
    setRequestStep(1);
  };

  // Submit Final Service Request
  const handleSubmitServiceRequest = async () => {
    if (!guestName.trim()) {
      setModalError('Vui lòng nhập Họ và tên!');
      return;
    }
    if (!guestPhone.trim()) {
      setModalError('Vui lòng nhập Số điện thoại liên hệ!');
      return;
    }
    setModalError('');
    setIsSubmitting(true);

    let finalTargetUrl = '';
    if (categoryType === 'smm') finalTargetUrl = targetLink.trim();
    else if (categoryType === 'ai') finalTargetUrl = aiDeliveryType === 'upgrade_email' ? aiCustomerEmail : 'Bàn giao kho sẵn';
    else if (categoryType === 'proxy') finalTargetUrl = proxyAuthMode === 'whitelist' ? `Whitelist IP: ${whitelistIp}` : `Location: ${proxyLocation}`;
    else finalTargetUrl = courseCustomerEmail;

    const requestPayload = {
      userId: user?.id || null,
      guestName: guestName.trim(),
      guestPhone: guestPhone.trim(),
      guestEmail: guestEmail.trim() || user?.email || '',
      telegramUsername: telegramUsername.trim(),
      facebookUsername: facebookUsername.trim(),
      serviceId: service.id,
      serviceNameSnapshot: service.name,
      categorySnapshot: service.category.toUpperCase(),
      serviceTypeSnapshot: categoryType === 'smm' ? 'Social Media' : categoryType === 'ai' ? 'AI Account' : categoryType === 'proxy' ? 'Proxy/VPS' : 'Digital/Course',
      platform: service.category.toUpperCase(),
      targetUrl: finalTargetUrl,
      quantity,
      speed: smmServerOption === 'vip' ? '💎 VIP High' : smmServerOption === 'natural' ? '🌿 Tự nhiên' : '⚡ Nhanh',
      unitPrice,
      estimatedPrice,
      customerNote: customerNote.trim(),
      serviceInputs: {
        categoryType,
        smmServerOption,
        aiDeliveryType,
        proxyLocation,
        proxyProtocol,
        proxyAuthMode,
      },
    };

    try {
      const res = await fetch('/api/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload),
      });

      const data = await res.json();
      const code = data?.requestCode || `REQ-${Math.floor(10000 + Math.random() * 90000)}`;

      if (!res.ok || !data?.success) {
        sendDirectTelegramNotification({
          requestCode: code,
          guestName: guestName.trim(),
          guestPhone: guestPhone.trim(),
          guestEmail: guestEmail.trim() || user?.email || '',
          telegramUsername: telegramUsername.trim(),
          facebookUsername: facebookUsername.trim(),
          categorySnapshot: service.category.toUpperCase(),
          serviceNameSnapshot: service.name,
          serviceTypeSnapshot: categoryType === 'smm' ? 'Social Media' : categoryType === 'ai' ? 'AI Account' : categoryType === 'proxy' ? 'Proxy/VPS' : 'Digital/Course',
          targetUrl: finalTargetUrl,
          speed: smmServerOption === 'vip' ? '💎 VIP High' : smmServerOption === 'natural' ? '🌿 Tự nhiên' : '⚡ Nhanh',
          quantity,
          unitPrice,
          estimatedPrice,
          customerNote: customerNote.trim(),
        }).catch(() => {});
      }

      setIsSubmitting(false);
      setIsRequestModalOpen(false);

      router.push(`/order-success?code=${code}&service=${encodeURIComponent(service.name)}&qty=${quantity}&price=${estimatedPrice}&name=${encodeURIComponent(guestName)}&phone=${encodeURIComponent(guestPhone)}`);
    } catch (err) {
      const fallbackCode = `REQ-${Math.floor(10000 + Math.random() * 90000)}`;
      sendDirectTelegramNotification({
        requestCode: fallbackCode,
        guestName: guestName.trim(),
        guestPhone: guestPhone.trim(),
        guestEmail: guestEmail.trim() || user?.email || '',
        telegramUsername: telegramUsername.trim(),
        facebookUsername: facebookUsername.trim(),
        categorySnapshot: service.category.toUpperCase(),
        serviceNameSnapshot: service.name,
        serviceTypeSnapshot: categoryType === 'smm' ? 'Social Media' : categoryType === 'ai' ? 'AI Account' : categoryType === 'proxy' ? 'Proxy/VPS' : 'Digital/Course',
        targetUrl: finalTargetUrl,
        speed: smmServerOption === 'vip' ? '💎 VIP High' : smmServerOption === 'natural' ? '🌿 Tự nhiên' : '⚡ Nhanh',
        quantity,
        unitPrice,
        estimatedPrice,
        customerNote: customerNote.trim(),
      }).catch(() => {});

      setIsSubmitting(false);
      setIsRequestModalOpen(false);
      router.push(`/order-success?code=${fallbackCode}&service=${encodeURIComponent(service.name)}&qty=${quantity}&price=${estimatedPrice}&name=${encodeURIComponent(guestName)}&phone=${encodeURIComponent(guestPhone)}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      
      {/* 🧭 BREADCRUMB NAVIGATION */}
      <div className="flex items-center gap-2 text-xs text-gray-400 overflow-x-auto whitespace-nowrap py-1 custom-scrollbar font-mono">
        <Link href="/" className="hover:text-neon-red transition-colors shrink-0">Trang chủ</Link>
        <span className="text-gray-600">/</span>
        <Link href="/services" className="hover:text-neon-red transition-colors shrink-0">Dịch vụ</Link>
        <span className="text-gray-600">/</span>
        <Link href={`/services/${service.category}`} className="hover:text-neon-red uppercase font-bold text-gray-300 shrink-0">{service.category}</Link>
        <span className="text-gray-600">/</span>
        <span className="text-neon-red font-bold truncate max-w-[200px] sm:max-w-xs">{service.name}</span>
      </div>

      {/* 🚀 MAIN SERVICE DETAIL GRID (12 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Service Specs & Description (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Specs Glass Card */}
          <div className="border-beam-always p-6 sm:p-8 space-y-6 bg-[#0B0B12]/90 backdrop-blur-xl shadow-2xl relative overflow-hidden rounded-[32px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-red/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

            {/* Header Title & Badge */}
            <div className="flex items-start justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-neon-red/20 via-pink-500/20 to-amber-500/20 border border-neon-red/40 flex items-center justify-center text-3xl shadow-neon-red shrink-0">
                  {service.icon || '⚡'}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-0.5 rounded-full bg-neon-red/10 border border-neon-red/30 text-neon-red font-black text-[10px] sm:text-xs uppercase font-mono tracking-wider shadow-neon-red">
                      ● {service.category}
                    </span>
                    {service.warranty && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px] sm:text-xs font-mono flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{service.warranty}</span>
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                    {service.name}
                  </h1>
                </div>
              </div>

              <button
                onClick={() => toggleFavorite(service.id)}
                className={`p-3 rounded-2xl border transition-all shrink-0 ${
                  isFav
                    ? 'bg-neon-red/20 border-neon-red text-neon-red shadow-neon-red'
                    : 'bg-white/5 border-white/15 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
                title="Thêm vào danh sách yêu thích"
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-neon-red' : ''}`} />
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-mono">
              <div className="space-y-0.5">
                <div className="text-gray-400 text-[10px] uppercase font-bold">Đánh giá:</div>
                <div className="font-extrabold text-amber-400 flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-amber-400 shrink-0 text-amber-400" />
                  <span>{service.rating || 5.0}</span>
                  <span className="text-gray-400 text-[11px] font-normal">({service.reviewCount || 890})</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="text-gray-400 text-[10px] uppercase font-bold">Đã bán:</div>
                <div className="font-extrabold text-emerald-400 flex items-center gap-1 text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{(service.sold || 9800).toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="text-gray-400 text-[10px] uppercase font-bold">Tốc độ bàn giao:</div>
                <div className="font-extrabold text-neon-red flex items-center gap-1 text-xs sm:text-sm">
                  <Clock className="w-4 h-4 shrink-0 text-neon-red" />
                  <span className="truncate">{service.eta || '⚡ Bàn giao 5 phút'}</span>
                </div>
              </div>
            </div>

            {/* Price & Warranty Hero Box */}
            <div className="p-5 bg-gradient-to-r from-neon-red/15 via-rose-500/10 to-amber-500/10 border border-neon-red/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
              <div>
                <div className="text-xs text-gray-300 font-bold uppercase tracking-wider font-mono">Đơn giá tham khảo:</div>
                <div className="text-2xl sm:text-3xl font-black text-neon-red tracking-tight font-mono drop-shadow-[0_0_12px_rgba(255,30,66,0.5)]">
                  {formatVND(unitPrice)}
                  <span className="text-xs text-gray-400 font-normal ml-1">
                    / {categoryType === 'smm' ? '1.000 lượt' : categoryType === 'ai' ? 'tài khoản' : categoryType === 'proxy' ? 'IP' : 'gói'}
                  </span>
                </div>
              </div>

              <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-white/10">
                <div className="text-xs text-emerald-400 font-black uppercase font-mono">Chính sách bảo hành:</div>
                <div className="text-xs text-emerald-300 font-bold mt-1 flex items-center sm:justify-end gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{service.warranty || 'Bảo hành 1 đổi 1 trong 30 ngày'}</span>
                </div>
              </div>
            </div>

            {/* Segmented Tab Bar */}
            <div className="flex border-b border-white/10 gap-2 sm:gap-6 text-xs sm:text-sm font-bold pt-2">
              <button
                onClick={() => setActiveTab('desc')}
                className={`pb-3.5 transition-all flex items-center gap-1.5 border-b-2 ${
                  activeTab === 'desc' ? 'text-neon-red border-neon-red font-black' : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Mô Tả & Điểm Nổi Bật</span>
              </button>

              <button
                onClick={() => setActiveTab('terms')}
                className={`pb-3.5 transition-all flex items-center gap-1.5 border-b-2 ${
                  activeTab === 'terms' ? 'text-neon-red border-neon-red font-black' : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                <Info className="w-4 h-4" />
                <span>Lưu Ý & Điều Khoản</span>
              </button>

              <button
                onClick={() => setActiveTab('faq')}
                className={`pb-3.5 transition-all flex items-center gap-1.5 border-b-2 ${
                  activeTab === 'faq' ? 'text-neon-red border-neon-red font-black' : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Hỏi Đáp (FAQ)</span>
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'desc' && (
              <div className="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed pt-1">
                <p className="font-medium text-gray-200">{service.description}</p>
                {service.features && service.features.length > 0 && (
                  <div className="space-y-2.5 pt-2 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="font-bold text-white flex items-center gap-2 text-xs uppercase font-mono">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Tính năng nổi bật dịch vụ:</span>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {service.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'terms' && (
              <div className="space-y-3 text-xs text-gray-300 pt-1">
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-300 font-semibold flex items-start gap-2.5">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <span>{service.terms || 'Vui lòng điền chính xác thông tin và dán đường dẫn link trước khi gửi đơn đặt.'}</span>
                </div>
                <ul className="space-y-2 list-disc list-inside text-gray-400 font-sans">
                  <li>Không đổi tên người dùng hoặc đổi quyền riêng tư trong khi hệ thống đang khởi chạy.</li>
                  <li>Kĩ thuật viên sẽ liên hệ lại xác nhận và báo giá tốt nhất trong 1-5 phút.</li>
                  <li>Cam kết bảo mật tuyệt đối 100% thông tin tài khoản của khách hàng.</li>
                </ul>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="space-y-3 pt-1">
                {service.faq && service.faq.length > 0 ? (
                  service.faq.map((item, index) => (
                    <div
                      key={index}
                      className="border border-white/10 rounded-2xl overflow-hidden bg-white/5"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                        className="w-full p-4 text-left font-bold text-xs text-white flex items-center justify-between hover:bg-white/5"
                      >
                        <span>{item.question}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${openFaqIndex === index ? 'rotate-180 text-neon-red' : 'text-gray-400'}`} />
                      </button>
                      {openFaqIndex === index && (
                        <div className="p-4 pt-0 text-xs text-gray-300 border-t border-white/5">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">Chưa có câu hỏi FAQ cụ thể cho dịch vụ này.</p>
                )}
              </div>
            )}

          </div>

          {/* HỖ TRỢ TRỰC TIẾP TỪ KĨ THUẬT VIÊN BOX */}
          <div className="p-6 bg-[#0D0D14] border border-sky-500/30 rounded-[32px] space-y-4 shadow-glass">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sky-400 font-black text-xs uppercase tracking-wider">
                <Send className="w-4 h-4 text-sky-400" />
                <span>HỖ TRỢ TRỰC TIẾP TỪ KĨ THUẬT VIÊN</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono text-[10px] font-bold">
                ONLINE 24/7
              </span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Website hoạt động theo mô hình tư vấn & báo giá trực tiếp. Khi bạn đặt dịch vụ, nhân viên hỗ trợ sẽ liên hệ với bạn qua Telegram / Zalo / Facebook trong giây lát để xác nhận yêu cầu và khởi chạy hệ thống.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <a
                href="https://t.me/nguyenmmo07"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-3 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Chat Telegram (@nguyenmmo07)</span>
              </a>

              <a
                href="https://zalo.me/0934811307"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Zalo (0934811307)</span>
              </a>

              <a
                href="https://www.facebook.com/nguyenads7"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-3 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-md"
              >
                <UserIcon className="w-4 h-4" />
                <span>Facebook (nguyenads7)</span>
              </a>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Configuration & Order Form (5 cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="border-beam-always p-6 sm:p-7 space-y-6 rounded-[32px] bg-[#0D0D14]/95 backdrop-blur-xl shadow-2xl">
            
            {/* Form Title */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                {categoryType === 'smm' && <Zap className="w-5 h-5 text-neon-red" />}
                {categoryType === 'ai' && <Bot className="w-5 h-5 text-purple-400" />}
                {categoryType === 'proxy' && <Server className="w-5 h-5 text-sky-400" />}
                {categoryType === 'digital' && <BookOpen className="w-5 h-5 text-emerald-400" />}
                <span>THÔNG TIN CẤU HÌNH</span>
              </h2>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold shadow-sm">
                TƯ VẤN 24/7 ⚡
              </span>
            </div>

            {/* DYNAMIC FORM INPUTS */}
            {categoryType === 'smm' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-200">
                    Đường dẫn (Link / ID) cần chạy: <span className="text-neon-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={targetLink}
                    onChange={(e) => {
                      setTargetLink(e.target.value);
                      if (inputError) setInputError('');
                    }}
                    placeholder={`Dán link ${service.category.toUpperCase()} cần tăng vào đây...`}
                    className={`w-full px-4 py-3.5 bg-[#050508] border rounded-2xl text-xs text-white placeholder-gray-500 outline-none transition-all ${
                      inputError ? 'border-red-500 bg-red-500/10' : 'border-white/15 focus:border-neon-red'
                    }`}
                  />
                  {inputError && <p className="text-[11px] text-red-400 font-semibold">{inputError}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-200">Tốc độ xử lý:</label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setSmmServerOption('fast')}
                      className={`p-2.5 rounded-2xl border text-center font-bold transition-all ${
                        smmServerOption === 'fast' ? 'bg-neon-red text-white border-neon-red shadow-neon-red' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      ⚡ Nhanh
                    </button>
                    <button
                      type="button"
                      onClick={() => setSmmServerOption('vip')}
                      className={`p-2.5 rounded-2xl border text-center font-bold transition-all ${
                        smmServerOption === 'vip' ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-black' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      💎 VIP High
                    </button>
                    <button
                      type="button"
                      onClick={() => setSmmServerOption('natural')}
                      className={`p-2.5 rounded-2xl border text-center font-bold transition-all ${
                        smmServerOption === 'natural' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-black' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      🌿 Tự nhiên
                    </button>
                  </div>
                </div>
              </div>
            )}

            {categoryType === 'ai' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-200">Phương Thức Bàn Giao:</label>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setAiDeliveryType('auto_stock')}
                      className={`p-3.5 rounded-2xl border text-left font-bold transition-all flex items-center justify-between ${
                        aiDeliveryType === 'auto_stock' ? 'bg-purple-500/20 border-purple-500/60 text-purple-200 shadow-md' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-purple-400" />
                        <span>Nhận tài khoản kho sẵn</span>
                      </div>
                      <CheckCircle2 className={`w-4.5 h-4.5 ${aiDeliveryType === 'auto_stock' ? 'text-purple-400' : 'text-gray-600'}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setAiDeliveryType('upgrade_email')}
                      className={`p-3.5 rounded-2xl border text-left font-bold transition-all flex items-center justify-between ${
                        aiDeliveryType === 'upgrade_email' ? 'bg-purple-500/20 border-purple-500/60 text-purple-200 shadow-md' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-purple-400" />
                        <span>Nâng cấp Email chính chủ</span>
                      </div>
                      <CheckCircle2 className={`w-4.5 h-4.5 ${aiDeliveryType === 'upgrade_email' ? 'text-purple-400' : 'text-gray-600'}`} />
                    </button>
                  </div>
                </div>

                {aiDeliveryType === 'upgrade_email' && (
                  <div className="space-y-2 pt-1 animate-in fade-in">
                    <label className="block text-xs font-bold text-gray-200">Email chính chủ nâng cấp: *</label>
                    <input
                      type="email"
                      value={aiCustomerEmail}
                      onChange={(e) => setAiCustomerEmail(e.target.value)}
                      placeholder="nhap.email.cua.ban@gmail.com"
                      className="w-full px-4 py-3.5 bg-[#050508] border border-white/15 focus:border-purple-500 rounded-2xl text-xs text-white outline-none"
                    />
                  </div>
                )}
              </div>
            )}

            {categoryType === 'proxy' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sky-300 font-bold">Location:</label>
                    <select
                      value={proxyLocation}
                      onChange={(e) => setProxyLocation(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#050508] border border-white/15 rounded-xl text-white outline-none"
                    >
                      <option value="Việt Nam 🇻🇳">🇻🇳 Việt Nam</option>
                      <option value="Mỹ (US) 🇺🇸">🇺🇸 Mỹ (US)</option>
                      <option value="Singapore 🇸🇬">🇸🇬 Singapore</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sky-300 font-bold">Protocol:</label>
                    <select
                      value={proxyProtocol}
                      onChange={(e) => setProxyProtocol(e.target.value as any)}
                      className="w-full px-3 py-2.5 bg-[#050508] border border-white/15 rounded-xl text-white outline-none"
                    >
                      <option value="HTTP">HTTP / HTTPS</option>
                      <option value="SOCKS5">SOCKS5</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {categoryType === 'digital' && (
              <div className="space-y-3 text-xs">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-200">Email nhận thông tin: *</label>
                  <input
                    type="email"
                    value={courseCustomerEmail}
                    onChange={(e) => setCourseCustomerEmail(e.target.value)}
                    placeholder="email.nhan@gmail.com"
                    className="w-full px-4 py-3.5 bg-[#050508] border border-white/15 focus:border-emerald-500 rounded-2xl text-xs text-white outline-none"
                  />
                </div>
              </div>
            )}

            {/* QUANTITY COUNTER */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-gray-200">
                <span>Số lượng:</span>
                {categoryType === 'smm' && (
                  <span className="text-gray-400 text-[11px]">
                    (Min: {service.min || 100} - Max: {(service.max || 500000).toLocaleString()})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDecrease}
                  className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all active:scale-90"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full text-center py-3 bg-[#050508] border border-white/15 rounded-2xl text-base font-extrabold text-white outline-none focus:border-neon-red font-mono"
                />

                <button
                  type="button"
                  onClick={handleIncrease}
                  className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all active:scale-90"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ESTIMATED PRICE BOX */}
            <div className="pt-3 border-t border-white/10 space-y-1.5 bg-gradient-to-br from-white/5 to-white/0 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                <span>Đơn giá tính toán:</span>
                <span className="font-mono text-gray-200">{formatVND(unitPrice)}</span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-sm font-black text-white uppercase">GIÁ DỰ KIẾN:</span>
                <span className="text-2xl sm:text-3xl font-black text-neon-red tracking-tight font-mono drop-shadow-[0_0_15px_rgba(255,30,66,0.6)]">
                  {formatVND(estimatedPrice)}
                </span>
              </div>
              <div className="text-[10px] text-gray-400 pt-1 leading-tight font-sans italic">
                * Giá cuối cùng sẽ được xác nhận với bạn qua Telegram/Messenger.
              </div>
            </div>

            {/* MAIN CTA BUTTON: ⚡ ĐẶT DỊCH VỤ */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleOpenRequestModal}
                className="w-full py-4 bg-neon-red hover:bg-neon-red-hover text-white text-base font-black rounded-2xl btn-beam-touch hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-neon-red overflow-hidden"
              >
                <Zap className="w-5 h-5 text-white fill-white animate-pulse" />
                <span>⚡ ĐẶT DỊCH VỤ</span>
              </button>

              <div className="text-center text-[11px] text-gray-400 font-medium leading-tight">
                Không thanh toán trực tuyến – Nhân viên sẽ liên hệ xác nhận.
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* REQUEST MODAL POPUP */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in">
          <div className="w-full max-w-xl bg-[#0D0D15] border-t-2 sm:border-2 border-neon-red/50 rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-6 text-white max-h-[88vh] sm:max-h-[90vh] overflow-y-auto custom-scrollbar relative">
            
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10">
              <div>
                <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <span>THÔNG TIN ĐẶT DỊCH VỤ</span>
                  <span className="px-2 py-0.5 rounded-full bg-neon-red/20 border border-neon-red/40 text-neon-red font-mono font-bold text-[10px] sm:text-xs">
                    TƯ VẤN TRỰC TIẾP
                  </span>
                </h2>
                <div className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                  Đơn hàng của bạn sẽ được gửi tới Admin xử lý và liên hệ chốt giá qua Telegram/Messenger.
                </div>
              </div>

              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-red-500/20 border border-red-500/40 text-red-300 rounded-xl text-xs font-bold">
                ⚠️ {modalError}
              </div>
            )}

            {/* STEP 1: CUSTOMER CONTACT FORM */}
            {requestStep === 1 && (
              <div className="space-y-3.5 sm:space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-gray-300 font-bold">Họ và tên của bạn: *</label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3.5 py-2.5 bg-[#05050A] border border-white/15 rounded-xl text-white outline-none focus:border-neon-red"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-gray-300 font-bold">Số điện thoại (Zalo): *</label>
                    <input
                      type="text"
                      required
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="0988 123 456"
                      className="w-full px-3.5 py-2.5 bg-[#05050A] border border-white/15 rounded-xl text-white font-mono outline-none focus:border-neon-red"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 font-bold">Email nhận xác nhận:</label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="email@domain.com"
                      className="w-full px-3.5 py-2.5 bg-[#05050A] border border-white/15 rounded-xl text-white outline-none focus:border-neon-red"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-gray-300 font-bold">Telegram (@username):</label>
                    <input
                      type="text"
                      value={telegramUsername}
                      onChange={(e) => setTelegramUsername(e.target.value)}
                      placeholder="@username_telegram"
                      className="w-full px-3.5 py-2.5 bg-[#05050A] border border-white/15 rounded-xl text-sky-300 font-mono outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 font-bold">Facebook Profile / Link:</label>
                    <input
                      type="text"
                      value={facebookUsername}
                      onChange={(e) => setFacebookUsername(e.target.value)}
                      placeholder="fb.com/username"
                      className="w-full px-3.5 py-2.5 bg-[#05050A] border border-white/15 rounded-xl text-blue-300 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-bold">Ghi chú bổ sung cho Admin:</label>
                  <textarea
                    rows={2}
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    placeholder="VD: Cần chạy xong trước 20h tối nay..."
                    className="w-full px-3.5 py-2.5 bg-[#05050A] border border-white/15 rounded-xl text-white outline-none focus:border-neon-red"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10 sticky bottom-0 bg-[#0D0D15] py-2">
                  <button
                    type="button"
                    onClick={() => setIsRequestModalOpen(false)}
                    className="px-4 sm:px-5 py-2.5 bg-white/10 hover:bg-white/20 text-gray-300 font-bold rounded-xl text-xs"
                  >
                    Hủy bỏ
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!guestName.trim() || !guestPhone.trim()) {
                        setModalError('Vui lòng nhập Họ tên và Số điện thoại!');
                        return;
                      }
                      setModalError('');
                      setRequestStep(2);
                    }}
                    className="px-5 sm:px-6 py-2.5 bg-neon-red hover:bg-neon-red-hover text-white font-bold rounded-xl btn-beam-touch flex items-center gap-1.5 overflow-hidden text-xs"
                  >
                    <span>Tiếp tục xác nhận</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

            {/* STEP 2: CONFIRMATION SCREEN */}
            {requestStep === 2 && (
              <div className="space-y-4 sm:space-y-5 text-xs">
                <div className="p-3.5 sm:p-4 bg-neon-red/10 border border-neon-red/30 rounded-2xl space-y-3">
                  <div className="font-extrabold text-neon-red text-xs sm:text-sm uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>XÁC NHẬN TỔNG QUAN YÊU CẦU DỊCH VỤ</span>
                  </div>

                  <div className="space-y-1.5 text-gray-300 border-t border-white/10 pt-2.5">
                    <div><b>Tên dịch vụ:</b> <span className="text-white font-bold">{service.name}</span></div>
                    <div><b>Họ tên khách:</b> <span className="text-white font-bold">{guestName}</span></div>
                    <div><b>SĐT / Zalo:</b> <span className="text-emerald-400 font-mono font-bold">{guestPhone}</span></div>
                    {telegramUsername && <div><b>Telegram:</b> <span className="text-sky-300 font-mono">{telegramUsername}</span></div>}
                    <div><b>Số lượng:</b> <span className="text-white font-mono font-bold">{quantity.toLocaleString()}</span></div>
                    <div><b>Target URL / Link:</b> <span className="text-sky-300 font-mono truncate block">{targetLink || 'Khác'}</span></div>
                    <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                      <span className="text-gray-400 font-bold uppercase text-[11px]">GIÁ DỰ KIẾN:</span>
                      <span className="text-lg sm:text-xl font-black text-neon-red font-mono">{formatVND(estimatedPrice)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-[11px] text-gray-400 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Yêu cầu sẽ được tạo mã #REQ-XXXXX và gửi tự động tới Telegram Admin xử lý ngay lập tức.</span>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-white/10 sticky bottom-0 bg-[#0D0D15] py-2">
                  <button
                    type="button"
                    onClick={() => setRequestStep(1)}
                    className="px-3.5 sm:px-4 py-2.5 bg-white/10 text-gray-300 font-bold rounded-xl text-xs"
                  >
                    ← Quay lại
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmitServiceRequest}
                    className="px-5 sm:px-6 py-2.5 sm:py-3 bg-neon-red hover:bg-neon-red-hover text-white font-black text-xs sm:text-sm rounded-xl btn-beam-touch flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50 overflow-hidden"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>{isSubmitting ? 'Đang gửi...' : '⚡ GỬI YÊU CẦU ĐẶT DỊCH VỤ'}</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* MOBILE STICKY BOTTOM PURCHASE BAR */}
      <div className="md:hidden fixed bottom-[56px] left-0 right-0 z-30 bg-[#0B0B14]/95 backdrop-blur-2xl border-t border-neon-red/30 px-4 py-2.5 flex items-center justify-between gap-3 shadow-[0_-12px_30px_rgba(0,0,0,0.95)] pb-[calc(0.6rem+env(safe-area-inset-bottom))]">
        <div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">GIÁ DỰ KIẾN:</div>
          <div className="text-lg font-black text-neon-red font-mono leading-none">
            {formatVND(estimatedPrice)}
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenRequestModal}
          className="px-5 py-2.5 bg-neon-red hover:bg-neon-red-hover text-white text-xs font-black rounded-xl btn-beam-touch flex items-center gap-1.5 shadow-neon-red active:scale-95 transition-all"
        >
          <Zap className="w-4 h-4 fill-white animate-pulse" />
          <span>⚡ ĐẶT DỊCH VỤ</span>
        </button>
      </div>

    </div>
  );
}
