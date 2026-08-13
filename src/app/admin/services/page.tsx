'use client';

import React, { useState, useEffect } from 'react';
import { MOCK_SERVICES } from '@/data/mockServices';
import { Service, CategorySlug } from '@/types';
import { formatVND } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { 
  Layers, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Zap, 
  Bot, 
  Server, 
  BookOpen, 
  CheckCircle2, 
  Key, 
  Sparkles,
  Search,
  Clock,
  ShieldCheck,
  Tag
} from 'lucide-react';

export default function AdminServicesPage() {
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Load services from localStorage on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem('nguyenmmo_services');
      if (cached) {
        setServicesList(JSON.parse(cached));
      } else {
        setServicesList(MOCK_SERVICES);
      }
    } catch (e) {
      setServicesList(MOCK_SERVICES);
    }
  }, []);

  // Helper to persist list into localStorage
  const persistServices = (list: Service[]) => {
    setServicesList(list);
    try {
      localStorage.setItem('nguyenmmo_services', JSON.stringify(list));
    } catch (err) {
      console.error('Error saving services to localStorage:', err);
    }
  };

  // Category type filter tab for admin
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Category-adaptive Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'facebook' as CategorySlug,
    subCategory: 'Dịch vụ chính',
    description: '',
    price: 50,
    salePrice: 0,
    min: 1000,
    max: 100000,
    eta: '⚡ 5 - 30 phút',
    warranty: 'Bảo hành 30 ngày',
    icon: '🚀',
    inStock: true,
    // SMM specific
    providerId: 'Main SMM Provider API',
    providerServiceId: '1029',
    targetHint: 'https://facebook.com/profile',
    // AI Tools specific
    accountDeliveryType: 'auto_stock' as 'auto_stock' | 'upgrade_email',
    accountDuration: '1 Tháng',
    accountFormat: 'Email|Password',
    stockCount: 150,
    // Proxy/VPS specific
    ipType: 'IPv4 Datacenter',
    location: 'Việt Nam 🇻🇳',
    bandwidth: 'Unlimited GB',
    // Digital & Course specific
    deliveryFormat: 'Link Drive HD + Tài liệu',
    supportChannel: 'Group Zalo Hỗ trợ 1-1',
  });

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsCreating(false);

    let defaultDelivery: 'auto_stock' | 'upgrade_email' = 'auto_stock';
    let defaultIpType = 'IPv4 Datacenter';
    let defaultFormat = 'Link Drive HD + Tài liệu';

    if (service.category === 'ai') {
      defaultDelivery = service.name.includes('Chính Chủ') ? 'upgrade_email' : 'auto_stock';
    } else if (service.category === 'mmo') {
      defaultIpType = service.name.includes('IPv6') ? 'IPv6 Static' : 'IPv4 Datacenter';
    } else if (service.category === 'courses' || service.category === 'digital') {
      defaultFormat = service.name.includes('Key') ? 'Mã kích hoạt Key License' : 'Link Drive HD + Tài liệu';
    }

    setFormData({
      name: service.name,
      category: service.category as CategorySlug,
      subCategory: service.subCategory || 'Dịch vụ chính',
      description: service.description,
      price: service.price,
      salePrice: service.salePrice || 0,
      min: service.min || 100,
      max: service.max || 100000,
      eta: service.eta || '⚡ 5 - 30 phút',
      warranty: service.warranty || 'Bảo hành 30 ngày',
      icon: service.icon || getCategoryIcon(service.category as CategorySlug),
      inStock: service.inStock,
      providerId: service.providerId || 'Main SMM Provider API',
      providerServiceId: service.providerServiceId || '1029',
      targetHint: getTargetHint(service.category as CategorySlug),
      accountDeliveryType: defaultDelivery,
      accountDuration: '1 Tháng',
      accountFormat: 'Email|Password',
      stockCount: 150,
      ipType: defaultIpType,
      location: 'Việt Nam 🇻🇳',
      bandwidth: 'Unlimited GB',
      deliveryFormat: defaultFormat,
      supportChannel: 'Group Zalo Hỗ trợ 1-1',
    });
  };

  const handleCreateNew = () => {
    setEditingService(null);
    setIsCreating(true);
    setFormData({
      name: '',
      category: 'facebook',
      subCategory: 'Dịch vụ chính',
      description: '',
      price: 150,
      salePrice: 120,
      min: 1000,
      max: 500000,
      eta: '⚡ 5 - 30 phút',
      warranty: 'Bảo hành 30 ngày',
      icon: '🚀',
      inStock: true,
      providerId: 'Main SMM Provider API',
      providerServiceId: '1029',
      targetHint: 'https://facebook.com/profile',
      accountDeliveryType: 'auto_stock',
      accountDuration: '1 Tháng',
      accountFormat: 'Email|Password',
      stockCount: 100,
      ipType: 'IPv4 Datacenter',
      location: 'Việt Nam 🇻🇳',
      bandwidth: 'Unlimited GB',
      deliveryFormat: 'Link Drive HD + Tài liệu',
      supportChannel: 'Group Zalo Hỗ trợ 1-1',
    });
  };

  const getCategoryType = (category: CategorySlug): 'smm' | 'ai' | 'proxy' | 'digital' => {
    if (['facebook', 'tiktok', 'instagram', 'youtube', 'telegram', 'zalo', 'shopee'].includes(category)) return 'smm';
    if (category === 'ai') return 'ai';
    if (category === 'mmo') return 'proxy';
    return 'digital';
  };

  function getCategoryIcon(cat: CategorySlug): string {
    switch (cat) {
      case 'facebook': return '🚀';
      case 'tiktok': return '🎵';
      case 'instagram': return '📸';
      case 'youtube': return '▶️';
      case 'telegram': return '✈️';
      case 'zalo': return '💬';
      case 'shopee': return '🛒';
      case 'ai': return '🤖';
      case 'mmo': return '⚙️';
      case 'digital': return '📦';
      case 'courses': return '🎓';
      default: return '⚡';
    }
  }

  function getTargetHint(cat: CategorySlug): string {
    switch (cat) {
      case 'facebook': return 'Link trang cá nhân / Fanpage / Bài viết Facebook';
      case 'tiktok': return 'Link video / User @username TikTok';
      case 'instagram': return 'Link bài viết / Profile Instagram';
      case 'youtube': return 'Link video / Channel YouTube';
      case 'telegram': return 'Link Group / Channel / Post Telegram';
      case 'zalo': return 'Link Group Zalo / Số điện thoại Zalo';
      case 'shopee': return 'Link Shop / Sản phẩm Shopee';
      case 'ai': return 'Nhập Email chính chủ nâng cấp hoặc để trống nhận tài khoản';
      case 'mmo': return 'Chọn Hệ Điều Hành / Whitelist IP';
      default: return 'Link / Ghi chú yêu cầu đơn hàng';
    }
  }

  const handleCategoryChange = (cat: CategorySlug) => {
    setFormData((prev) => ({
      ...prev,
      category: cat,
      icon: getCategoryIcon(cat),
      targetHint: getTargetHint(cat),
    }));
  };

  const { showToast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Vui lòng nhập tên dịch vụ!', 'error');
      return;
    }

    let updatedList: Service[] = [];

    if (editingService) {
      updatedList = servicesList.map((s) =>
        s.id === editingService.id
          ? {
              ...s,
              name: formData.name,
              category: formData.category,
              subCategory: formData.subCategory,
              description: formData.description,
              price: formData.price,
              salePrice: formData.salePrice > 0 ? formData.salePrice : undefined,
              vipPrice: formData.salePrice || formData.price,
              min: formData.min,
              max: formData.max,
              eta: formData.eta,
              warranty: formData.warranty,
              icon: formData.icon,
              inStock: formData.inStock,
              providerId: formData.providerId,
              providerServiceId: formData.providerServiceId,
            }
          : s
      );
      showToast(`Đã cập nhật dịch vụ "${formData.name}" thành công!`, 'success');
    } else {
      const newSrv: Service = {
        id: `srv-${Date.now()}`,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: formData.name,
        category: formData.category,
        subCategory: formData.subCategory,
        description: formData.description,
        price: formData.price,
        salePrice: formData.salePrice > 0 ? formData.salePrice : undefined,
        vipPrice: formData.salePrice || formData.price,
        min: formData.min,
        max: formData.max,
        eta: formData.eta,
        rating: 5.0,
        reviewCount: 1,
        sold: 0,
        warranty: formData.warranty,
        icon: formData.icon,
        inStock: formData.inStock,
        providerId: formData.providerId,
        providerServiceId: formData.providerServiceId,
      };
      updatedList = [newSrv, ...servicesList];
      showToast(`Đã tạo mới dịch vụ "${formData.name}" thành công!`, 'success');
    }

    persistServices(updatedList);
    setEditingService(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa dịch vụ "${name}"?`)) {
      const updatedList = servicesList.filter((s) => s.id !== id);
      persistServices(updatedList);
      showToast(`Đã xóa dịch vụ "${name}"!`, 'info');
    }
  };

  const handleToggleStock = (id: string) => {
    const updatedList = servicesList.map((s) => (s.id === id ? { ...s, inStock: !s.inStock } : s));
    persistServices(updatedList);
    showToast('Đã cập nhật trạng thái mở bán!', 'success');
  };

  // Filter services list
  const filteredServices = servicesList.filter((s) => {
    const matchesTab =
      selectedCategoryTab === 'all' ||
      (selectedCategoryTab === 'smm' && ['facebook', 'tiktok', 'instagram', 'youtube', 'telegram', 'zalo', 'shopee'].includes(s.category)) ||
      (selectedCategoryTab === 'ai' && s.category === 'ai') ||
      (selectedCategoryTab === 'mmo' && s.category === 'mmo') ||
      (selectedCategoryTab === 'digital' && ['digital', 'services', 'courses'].includes(s.category));

    const matchesSearch =
      searchQuery === '' ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const currentCategoryType = getCategoryType(formData.category);

  return (
    <div className="space-y-6">
      
      {/* 1. ELEGANT ADMIN PAGE TITLE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Layers className="w-6 h-6 text-neon-red" />
              <span>QUẢN LÝ DỊCH VỤ & API</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-gray-300 text-[11px] font-mono font-bold">
              Adaptive Form 2.0
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Quản lý thông số cấu hình linh hoạt theo từng loại hình dịch vụ SMM, AI Tools, Proxy/VPS và Digital.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => {
              if (confirm("⚠️ CẢNH BÁO: Bạn có chắc chắn muốn xóa SẠCH TOÀN BỘ danh sách dịch vụ trên hệ thống?")) {
                persistServices([]);
                try {
                  import('@/lib/supabase').then(({ supabase }) => {
                    supabase.from('services').delete().neq('id', '00000000-0000-0000-0000-000000000000');
                  });
                } catch (e) {}
                showToast('🧹 Đã xóa sạch toàn bộ danh sách dịch vụ! Bạn có thể bắt đầu tạo dịch vụ thực tế của mình.', 'success');
              }
            }}
            className="px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xóa Sạch Dịch Vụ</span>
          </button>

          <button
            onClick={handleCreateNew}
            className="px-5 py-2.5 bg-neon-red hover:bg-neon-red-hover text-white text-xs font-bold rounded-xl btn-beam-touch flex items-center gap-2 hover:scale-105 transition-all overflow-hidden"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Dịch Vụ Mới</span>
          </button>
        </div>
      </div>

      {/* 2. ADAPTIVE CONFIG FORM MODAL */}
      {(editingService || isCreating) && (
        <div className={`bg-[#0C0C14] border-2 rounded-3xl p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 relative ${
          currentCategoryType === 'smm' ? 'border-blue-500/50 shadow-blue-500/20' :
          currentCategoryType === 'ai' ? 'border-purple-500/50 shadow-purple-500/20' :
          currentCategoryType === 'proxy' ? 'border-sky-500/50 shadow-sky-500/20' :
          'border-emerald-500/50 shadow-emerald-500/20'
        }`}>
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-xl shadow">
                {formData.icon}
              </span>
              <div>
                <h2 className="text-base font-black text-white">
                  {editingService ? `Cấu hình dịch vụ: ${editingService.name}` : 'Tạo dịch vụ mới'}
                </h2>
                <div className="text-xs font-bold text-gray-400 flex items-center gap-1.5 mt-0.5">
                  <span>Chế độ cấu hình:</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    currentCategoryType === 'smm' ? 'bg-neon-red/20 text-neon-red border border-neon-red/30' :
                    currentCategoryType === 'ai' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                    currentCategoryType === 'proxy' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' :
                    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {currentCategoryType === 'smm' && '🚀 SMM Automation API'}
                    {currentCategoryType === 'ai' && '🤖 Tài khoản & Công cụ AI'}
                    {currentCategoryType === 'proxy' && '⚙️ Proxy & VPS Treo Tool'}
                    {currentCategoryType === 'digital' && '🎓 Digital Products & Khóa học'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setEditingService(null);
                setIsCreating(false);
              }}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            
            {/* STEP 1: THÔNG TIN CƠ BẢN */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-neon-red" />
                <span>1. Thông tin hiển thị & Phân loại</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-gray-300 font-bold">Tên dịch vụ hiển thị *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: Tăng Follow Facebook Việt Nam Nick Thật"
                    className="w-full px-3.5 py-2.5 bg-[#05050A] border border-white/15 rounded-xl text-white outline-none focus:border-neon-red font-medium text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-300 font-bold">Danh mục sản phẩm *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleCategoryChange(e.target.value as CategorySlug)}
                    className="w-full px-3.5 py-2.5 bg-[#05050A] border border-neon-red/40 rounded-xl text-white font-bold outline-none text-xs"
                  >
                    <optgroup label="🌐 Mạng Xã Hội (SMM)">
                      <option value="facebook">🚀 Facebook Services</option>
                      <option value="tiktok">🎵 TikTok Services</option>
                      <option value="instagram">📸 Instagram Services</option>
                      <option value="youtube">▶️ YouTube Services</option>
                      <option value="telegram">✈️ Telegram Services</option>
                      <option value="zalo">💬 Zalo Services</option>
                      <option value="shopee">🛒 Shopee Services</option>
                    </optgroup>
                    <optgroup label="🤖 AI & MMO Tools">
                      <option value="ai">🤖 AI Tools & Accounts</option>
                      <option value="mmo">⚙️ Proxy & VPS MMO</option>
                    </optgroup>
                    <optgroup label="🎓 Digital & Courses">
                      <option value="digital">📦 Sản phẩm Digital</option>
                      <option value="services">📈 Marketing Services</option>
                      <option value="courses">🎓 Khóa học MMO</option>
                    </optgroup>
                  </select>
                </div>
              </div>
            </div>

            {/* STEP 2: ĐƠN GIÁ BÁN VÀ ƯU ĐÃI KHUYẾN MÃI */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>2. Giá bán & Thời gian phục vụ</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-bold">
                    {currentCategoryType === 'smm' ? 'Đơn giá niêm yết / 1.000 (VND)' : 'Đơn giá niêm yết (VND)'}
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-[#05050A] border border-white/15 rounded-xl text-white font-mono outline-none font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-emerald-400 font-bold flex items-center gap-1">
                    <span>Đơn giá khuyến mãi (VND)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                    placeholder="0 = Không giảm"
                    className="w-full px-3.5 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-mono outline-none font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-300 font-bold">Tốc độ xử lý (ETA)</label>
                  <input
                    type="text"
                    value={formData.eta}
                    onChange={(e) => setFormData({ ...formData, eta: e.target.value })}
                    placeholder="⚡ 5 - 30 phút"
                    className="w-full px-3.5 py-2 bg-[#05050A] border border-white/15 rounded-xl text-white outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-300 font-bold">Chế độ bảo hành</label>
                  <input
                    type="text"
                    value={formData.warranty}
                    onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                    placeholder="Bảo hành 30 ngày"
                    className="w-full px-3.5 py-2 bg-[#05050A] border border-white/15 rounded-xl text-white outline-none"
                  />
                </div>
              </div>
            </div>

            {/* STEP 3: CẤU HÌNH ĐẶC THÙ LOẠI DỊCH VỤ */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-sky-400" />
                <span>3. Cấu hình đặc thù loại dịch vụ</span>
              </div>

              {/* SMM Fields */}
              {currentCategoryType === 'smm' && (
                <div className="p-4 bg-neon-red/10 border border-neon-red/30 rounded-2xl space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-gray-300 font-bold">Số lượng Min *</label>
                      <input
                        type="number"
                        value={formData.min}
                        onChange={(e) => setFormData({ ...formData, min: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 bg-[#05050A] border border-white/15 rounded-xl text-white font-mono outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-300 font-bold">Số lượng Max *</label>
                      <input
                        type="number"
                        value={formData.max}
                        onChange={(e) => setFormData({ ...formData, max: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 bg-[#05050A] border border-white/15 rounded-xl text-white font-mono outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sky-400 font-bold">Nhà cung cấp (Provider) *</label>
                      <input
                        type="text"
                        value={formData.providerId}
                        onChange={(e) => setFormData({ ...formData, providerId: e.target.value })}
                        className="w-full px-3.5 py-2 bg-[#05050A] border border-sky-500/40 rounded-xl text-sky-300 font-mono outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sky-400 font-bold">Provider Service ID *</label>
                      <input
                        type="text"
                        value={formData.providerServiceId}
                        onChange={(e) => setFormData({ ...formData, providerServiceId: e.target.value })}
                        placeholder="1029"
                        className="w-full px-3.5 py-2 bg-[#05050A] border border-sky-500/40 rounded-xl text-sky-300 font-mono outline-none font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* AI Fields */}
              {currentCategoryType === 'ai' && (
                <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-2xl space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-gray-300 font-bold">Phương thức bàn giao *</label>
                      <select
                        value={formData.accountDeliveryType}
                        onChange={(e) => setFormData({ ...formData, accountDeliveryType: e.target.value as any })}
                        className="w-full px-3.5 py-2 bg-[#05050A] border border-white/15 rounded-xl text-white outline-none"
                      >
                        <option value="auto_stock">📦 Giao tài khoản tự động (Kho hàng sẵn)</option>
                        <option value="upgrade_email">📧 Nâng cấp trực tiếp trên Email chính chủ</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-300 font-bold">Thời hạn tài khoản *</label>
                      <select
                        value={formData.accountDuration}
                        onChange={(e) => setFormData({ ...formData, accountDuration: e.target.value })}
                        className="w-full px-3.5 py-2 bg-[#05050A] border border-white/15 rounded-xl text-white outline-none"
                      >
                        <option value="1 Tháng">1 Tháng (30 Ngày)</option>
                        <option value="3 Tháng">3 Tháng</option>
                        <option value="6 Tháng">6 Tháng</option>
                        <option value="1 Năm">1 Năm (12 Tháng)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-300 font-bold">Tồn kho sẵn có (Stock)</label>
                      <input
                        type="number"
                        value={formData.stockCount}
                        onChange={(e) => setFormData({ ...formData, stockCount: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 bg-[#05050A] border border-white/15 rounded-xl text-white font-mono outline-none font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="text-purple-300 font-bold flex items-center gap-1">
                      <Key className="w-3.5 h-3.5" />
                      <span>Định dạng mẫu tài khoản kho</span>
                    </label>
                    <input
                      type="text"
                      value={formData.accountFormat}
                      onChange={(e) => setFormData({ ...formData, accountFormat: e.target.value })}
                      placeholder="VD: Email|Password|SessionKey"
                      className="w-full px-3.5 py-2 bg-[#05050A] border border-purple-500/30 rounded-xl text-purple-200 font-mono text-xs outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Proxy / VPS Fields */}
              {currentCategoryType === 'proxy' && (
                <div className="p-4 bg-sky-900/20 border border-sky-500/30 rounded-2xl space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-gray-300 font-bold">Loại IP / Gói Server *</label>
                      <select
                        value={formData.ipType}
                        onChange={(e) => setFormData({ ...formData, ipType: e.target.value })}
                        className="w-full px-3.5 py-2 bg-[#05050A] border border-white/15 rounded-xl text-white outline-none"
                      >
                        <option value="IPv4 Datacenter">IPv4 Datacenter Tốc độ cao</option>
                        <option value="IPv4 Residential Rotating">IPv4 Dân cư Xoay IP</option>
                        <option value="IPv6 Static">IPv6 Tĩnh Treo Tool Nuôi Account</option>
                        <option value="VPS Windows Server">VPS Windows Server Treo Tool 24/7</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-300 font-bold">Quốc gia (Location) *</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Việt Nam 🇻🇳"
                        className="w-full px-3.5 py-2 bg-[#05050A] border border-white/15 rounded-xl text-white outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-300 font-bold">Băng thông / Hệ điều hành</label>
                      <input
                        type="text"
                        value={formData.bandwidth}
                        onChange={(e) => setFormData({ ...formData, bandwidth: e.target.value })}
                        placeholder="Unlimited GB"
                        className="w-full px-3.5 py-2 bg-[#05050A] border border-white/15 rounded-xl text-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Digital & Course Fields */}
              {currentCategoryType === 'digital' && (
                <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-2xl space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-gray-300 font-bold">Hình thức bàn giao *</label>
                      <input
                        type="text"
                        value={formData.deliveryFormat}
                        onChange={(e) => setFormData({ ...formData, deliveryFormat: e.target.value })}
                        placeholder="VD: Link Google Drive HD + Tài liệu"
                        className="w-full px-3.5 py-2 bg-[#05050A] border border-white/15 rounded-xl text-white outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-300 font-bold">Kênh hỗ trợ học viên / người dùng</label>
                      <input
                        type="text"
                        value={formData.supportChannel}
                        onChange={(e) => setFormData({ ...formData, supportChannel: e.target.value })}
                        placeholder="Group Zalo Hỗ trợ 1-1"
                        className="w-full px-3.5 py-2 bg-[#05050A] border border-white/15 rounded-xl text-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MÔ TẢ CHI TIẾT */}
            <div className="space-y-1.5 text-xs">
              <label className="text-gray-300 font-bold">Mô tả tính năng & lưu ý sử dụng</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả ngắn tính năng dịch vụ..."
                className="w-full px-3.5 py-2.5 bg-[#05050A] border border-white/15 rounded-xl text-white outline-none focus:border-neon-red"
              />
            </div>

            {/* FORM ACTION BUTTONS */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setEditingService(null);
                  setIsCreating(false);
                }}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-gray-300 text-xs font-bold rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-neon-red hover:bg-neon-red-hover text-white text-xs font-bold rounded-xl shadow-neon-red flex items-center gap-1.5 hover:scale-105 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{editingService ? 'Lưu cập nhật' : 'Tạo dịch vụ mới'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. FILTER TABS & SEARCH BAR FOR SERVICES LIST */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {[
            { id: 'all', label: 'Tất cả dịch vụ', count: servicesList.length },
            { id: 'smm', label: '🚀 Mạng Xã Hội', count: servicesList.filter((s) => ['facebook', 'tiktok', 'instagram', 'youtube', 'telegram', 'zalo', 'shopee'].includes(s.category)).length },
            { id: 'ai', label: '🤖 AI Tools', count: servicesList.filter((s) => s.category === 'ai').length },
            { id: 'mmo', label: '⚙️ Proxy & VPS', count: servicesList.filter((s) => s.category === 'mmo').length },
            { id: 'digital', label: '🎓 Digital & Khóa học', count: servicesList.filter((s) => ['digital', 'services', 'courses'].includes(s.category)).length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategoryTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedCategoryTab === tab.id
                  ? 'bg-neon-red text-white shadow-neon-red scale-105'
                  : 'bg-[#0E0E16] border border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                selectedCategoryTab === tab.id ? 'bg-black/30 text-white' : 'bg-white/10 text-gray-300'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên dịch vụ..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A10] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-neon-red transition-all"
          />
        </div>
      </div>

      {/* 4. HIGH-END DASHBOARD TABLE DESIGN */}
      <div className="bg-[#0A0A10] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E0E16] border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6 text-center min-w-[120px]">Thao tác</th>
                <th className="p-4 min-w-[280px]">Dịch vụ</th>
                <th className="p-4 text-center min-w-[120px]">Phân loại</th>
                <th className="p-4 text-right min-w-[120px]">Đơn giá</th>
                <th className="p-4 text-left min-w-[180px]">Tốc độ & Bảo hành</th>
                <th className="p-4 text-center min-w-[130px]">API / Delivery</th>
                <th className="p-4 text-center min-w-[110px]">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300 font-medium">
              {filteredServices.map((service) => {
                const categoryType = getCategoryType(service.category as CategorySlug);
                return (
                  <tr key={service.id} className="hover:bg-white/[0.04] transition-colors group">
                    
                    {/* THAO TÁC CỘT ĐẦU TIÊN (NO SCROLL NEEDED) */}
                    <td className="p-4 pl-6 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleEdit(service)}
                          className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30 text-blue-300 hover:text-white text-[11px] font-bold transition-all hover:scale-105 flex items-center gap-1"
                          title="Chỉnh sửa dịch vụ"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Sửa</span>
                        </button>
                        <button
                          onClick={() => handleDelete(service.id, service.name)}
                          className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all hover:scale-110"
                          title="Xóa dịch vụ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* DỊCH VỤ */}
                    <td className="p-4 cursor-pointer" onClick={() => handleEdit(service)}>
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                          {service.icon || getCategoryIcon(service.category as CategorySlug)}
                        </span>
                        <div className="min-w-0">
                          <div className="font-bold text-white text-sm line-clamp-1 group-hover:text-neon-red transition-colors">
                            {service.name}
                          </div>
                          <div className="text-[11px] text-gray-400 truncate max-w-xs leading-snug">
                            {service.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* PHÂN LOẠI */}
                    <td className="p-4 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider inline-block ${
                        categoryType === 'smm' ? 'bg-neon-red/15 text-neon-red border border-neon-red/30' :
                        categoryType === 'ai' ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30' :
                        categoryType === 'proxy' ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30' :
                        'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {service.category}
                      </span>
                    </td>

                    {/* ĐƠN GIÁ BÁN */}
                    <td className="p-4 text-right font-mono whitespace-nowrap">
                      {service.salePrice ? (
                        <div>
                          <div className="font-bold text-emerald-400 text-sm">{formatVND(service.salePrice)}</div>
                          <div className="text-[10px] text-gray-500 line-through">{formatVND(service.price)}</div>
                        </div>
                      ) : (
                        <div className="font-bold text-white text-sm">{formatVND(service.price)}</div>
                      )}
                    </td>

                    {/* TỐC ĐỘ & BẢO HÀNH (CLEAN NON-WRAPPING LAYOUT) */}
                    <td className="p-4 text-left whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold text-[11px]">
                          <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{service.eta || '⚡ Tự động'}</span>
                        </div>
                        <div className="text-[10px] text-gray-400 flex items-center gap-1 font-medium truncate max-w-[160px]">
                          <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{service.warranty || 'Bảo hành 30 ngày'}</span>
                        </div>
                      </div>
                    </td>

                    {/* API / BÀN GIAO */}
                    <td className="p-4 text-center font-mono whitespace-nowrap">
                      {categoryType === 'smm' ? (
                        <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 text-[10px] font-bold border border-sky-500/20 inline-block">
                          ID: {service.providerServiceId || '1029'}
                        </span>
                      ) : categoryType === 'ai' ? (
                        <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 text-[10px] font-bold border border-purple-500/20 inline-block">
                          Stock Kho ⚡
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 inline-block">
                          Auto Delivery
                        </span>
                      )}
                    </td>

                    {/* TRẠNG THÁI */}
                    <td className="p-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStock(service.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all hover:scale-105 ${
                          service.inStock
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-emerald-500/20'
                            : 'bg-red-500/20 text-red-400 border border-red-500/40'
                        }`}
                      >
                        {service.inStock ? '🟢 Mở bán' : '🔴 Tạm ẩn'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
