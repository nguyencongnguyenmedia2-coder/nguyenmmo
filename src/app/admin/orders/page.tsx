'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MOCK_SERVICE_REQUESTS } from '@/data/mockRequests';
import { ServiceRequest, ServiceRequestStatus } from '@/types';
import { formatVND } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Send, 
  MessageCircle, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  UserCheck, 
  FileText, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Save,
  X,
  Key,
  Server,
  Bot,
  BookOpen,
  Zap,
  Globe
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [requestsList, setRequestsList] = useState<ServiceRequest[]>(MOCK_SERVICE_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');

  // Internal Note & Delivery Edit State
  const [internalNote, setInternalNote] = useState('');
  const [assignedAdmin, setAssignedAdmin] = useState('Admin Nguyễn');
  const [deliveryOutputData, setDeliveryOutputData] = useState('');

  const [isRefreshing, setIsRefreshing] = useState(false);
  const { showToast } = useToast();

  // Fetch Live Service Requests from API, localStorage & Wallet Orders
  const fetchRequests = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    let liveCustomerOrders: ServiceRequest[] = [];

    // 1. Fetch from LocalStorage nguyenmmo_requests
    try {
      const cached = localStorage.getItem('nguyenmmo_requests');
      if (cached) {
        const localReqs: ServiceRequest[] = JSON.parse(cached);
        if (Array.isArray(localReqs)) {
          liveCustomerOrders.push(...localReqs);
        }
      }
    } catch (e) {}

    // 2. Fetch from LocalStorage digital_mmo_orders
    try {
      const cachedOrders = localStorage.getItem('digital_mmo_orders');
      if (cachedOrders) {
        const ordersList: any[] = JSON.parse(cachedOrders);
        if (Array.isArray(ordersList)) {
          const mappedOrders: ServiceRequest[] = ordersList.map((o) => ({
            id: o.id || `ord-${Date.now()}`,
            requestCode: o.orderCode || `REQ-${Math.floor(10000 + Math.random() * 90000)}`,
            guestName: o.customerName || 'Khách Hàng',
            guestPhone: o.phone || '0988 123 456',
            guestEmail: o.email || '',
            serviceId: o.serviceId || 'smm',
            serviceNameSnapshot: o.serviceName || 'Dịch vụ MMO',
            categorySnapshot: (o.category || 'SMM').toUpperCase(),
            serviceTypeSnapshot: 'Social Media',
            platform: (o.category || 'SMM').toUpperCase(),
            targetUrl: o.targetLink || 'N/A',
            quantity: o.quantity || 1000,
            speed: '⚡ Nhanh',
            unitPrice: Math.round((o.finalAmount || 50000) / (o.quantity || 1)),
            estimatedPrice: o.finalAmount || 50000,
            customerNote: o.notes || '',
            status: o.orderStatus === 'completed' ? 'COMPLETED' : o.orderStatus === 'canceled' ? 'CANCELED' : 'NEW',
            createdAt: o.createdAt || new Date().toISOString(),
            updatedAt: o.updatedAt || new Date().toISOString(),
          }));
          
          const existingCodes = new Set(liveCustomerOrders.map((c) => c.requestCode));
          mappedOrders.forEach((m) => {
            if (!existingCodes.has(m.requestCode)) {
              liveCustomerOrders.push(m);
            }
          });
        }
      }
    } catch (e) {}

    // 3. Fetch from Backend API /api/service-requests
    try {
      const res = await fetch('/api/service-requests?t=' + Date.now(), {
        credentials: 'include',
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const apiMapped: ServiceRequest[] = json.data.map((r: any) => ({
          id: r.id || `req-${Date.now()}`,
          requestCode: r.requestCode || r.request_code,
          guestName: r.guestName || r.guest_name,
          guestPhone: r.guestPhone || r.guest_phone,
          guestEmail: r.guestEmail || r.guest_email || '',
          telegramUsername: r.telegramUsername || r.telegram_username || '',
          facebookUsername: r.facebookUsername || r.facebook_username || '',
          serviceId: r.serviceId || r.service_id || 'custom-service',
          serviceNameSnapshot: r.serviceNameSnapshot || r.service_name_snapshot || 'Dịch vụ MMO',
          categorySnapshot: (r.categorySnapshot || r.category_snapshot || 'MMO').toUpperCase(),
          serviceTypeSnapshot: r.serviceTypeSnapshot || r.service_type_snapshot || 'Social Media',
          platform: r.platform || 'Web',
          targetUrl: r.targetUrl || r.target_url || 'Xem ghi chú',
          quantity: Number(r.quantity) || 1,
          speed: r.speed || '⚡ Nhanh',
          unitPrice: Number(r.unitPrice || r.unit_price) || 0,
          estimatedPrice: Number(r.estimatedPrice || r.estimated_price) || 0,
          customerNote: r.customerNote || r.customer_note || '',
          serviceInputs: r.serviceInputs || r.service_inputs || {},
          status: r.status || 'NEW',
          assignedAdmin: r.assignedAdmin || r.assigned_admin || 'Admin Nguyễn',
          adminNote: r.adminNote || r.admin_note || '',
          createdAt: r.createdAt || r.created_at || new Date().toISOString(),
          updatedAt: r.updatedAt || r.updated_at || new Date().toISOString(),
        }));

        const existingCodes = new Set(liveCustomerOrders.map((c) => c.requestCode));
        apiMapped.forEach((m) => {
          if (!existingCodes.has(m.requestCode)) {
            liveCustomerOrders.push(m);
          }
        });
      }
    } catch (e) {}

    // Prepend ALL real customer orders at the top, then add MOCK data
    const existingCodes = new Set(liveCustomerOrders.map((c) => c.requestCode));
    const filteredMocks = MOCK_SERVICE_REQUESTS.filter((m) => !existingCodes.has(m.requestCode));

    const fullList = [...liveCustomerOrders, ...filteredMocks];
    setRequestsList(fullList);
    if (isManual) {
      setIsRefreshing(false);
      showToast('Đã làm mới danh sách đơn hàng thành công!', 'success');
    }
  };

  React.useEffect(() => {
    fetchRequests();
    const interval = setInterval(() => {
      fetchRequests();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenDetail = (req: ServiceRequest) => {
    setSelectedRequest(req);
    setInternalNote(req.adminNote || '');
    setAssignedAdmin(req.assignedAdmin || 'Admin Nguyễn');
    setDeliveryOutputData('');
  };

  const handleUpdateStatus = async (id: string, newStatus: ServiceRequestStatus) => {
    const targetReq = requestsList.find((r) => r.id === id);
    
    const updatedList = requestsList.map((r) =>
      r.id === id
        ? {
            ...r,
            status: newStatus,
            updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          }
        : r
    );

    setRequestsList(updatedList);

    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest({
        ...selectedRequest,
        status: newStatus,
      });
    }

    try {
      localStorage.setItem('nguyenmmo_requests', JSON.stringify(updatedList));
    } catch (e) {}

    // Sync with Server API & Supabase DB
    if (targetReq?.requestCode) {
      try {
        await fetch('/api/service-requests', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            requestCode: targetReq.requestCode,
            status: newStatus,
          }),
        });

        await supabase
          .from('service_requests')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('request_code', targetReq.requestCode);
      } catch (e) {}
    }
  };

  const handleSaveAdminNote = async () => {
    if (!selectedRequest) return;
    setRequestsList(
      requestsList.map((r) =>
        r.id === selectedRequest.id
          ? {
              ...r,
              adminNote: internalNote,
              assignedAdmin: assignedAdmin,
            }
          : r
      )
    );

    try {
      await fetch('/api/service-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          requestCode: selectedRequest.requestCode,
          adminNote: internalNote,
          assignedAdmin: assignedAdmin,
        }),
      });
    } catch (e) {}

    showToast(`Đã lưu ghi chú nội bộ cho mã #${selectedRequest.requestCode} thành công!`, 'success');
  };

  // Helper to categorize requests into category types
  const getCategoryType = (categoryStr: string): 'smm' | 'ai' | 'proxy' | 'digital' => {
    const cat = categoryStr.toLowerCase();
    if (cat.includes('facebook') || cat.includes('tiktok') || cat.includes('instagram') || cat.includes('youtube') || cat.includes('telegram') || cat.includes('zalo') || cat.includes('smm') || cat.includes('social')) return 'smm';
    if (cat.includes('ai')) return 'ai';
    if (cat.includes('proxy') || cat.includes('vps') || cat.includes('mmo')) return 'proxy';
    return 'digital';
  };

  // Filter requests
  const filteredRequests = requestsList.filter((r) => {
    const catType = getCategoryType(r.categorySnapshot);
    const matchesStatus = selectedStatusFilter === 'all' || r.status === selectedStatusFilter;
    const matchesCategoryTab =
      selectedCategoryTab === 'all' ||
      (selectedCategoryTab === 'smm' && catType === 'smm') ||
      (selectedCategoryTab === 'ai' && catType === 'ai') ||
      (selectedCategoryTab === 'proxy' && catType === 'proxy') ||
      (selectedCategoryTab === 'digital' && catType === 'digital');

    const matchesSearch =
      searchQuery === '' ||
      r.requestCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.guestPhone.includes(searchQuery) ||
      r.serviceNameSnapshot.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesCategoryTab && matchesSearch;
  });

  const getCustomerHistory = (phone: string) => {
    return requestsList.filter((r) => r.guestPhone === phone);
  };

  const getStatusBadge = (status: ServiceRequestStatus) => {
    switch (status) {
      case 'NEW':
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">🟡 CHỜ XỬ LÝ</span>;
      case 'CONTACTING':
        return <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-bold">💬 ĐANG LIÊN HỆ</span>;
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold">💜 ĐÃ XÁC NHẬN</span>;
      case 'PROCESSING':
        return <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-bold">⚡ ĐANG XỬ LÝ</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">🟢 HOÀN THÀNH</span>;
      case 'CANCELED':
        return <span className="px-2.5 py-1 rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/40 text-[10px] font-bold">⚪ ĐÃ HỦY</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-bold">🔴 TỪ CHỐI</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-gray-500/20 text-gray-400 text-[10px] font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. HEADER TITLE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-neon-red" />
              <span>QUẢN LÝ YÊU CẦU DỊCH VỤ ADAPTIVE</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-neon-red/20 border border-neon-red/40 text-neon-red text-[11px] font-mono font-bold">
              Adaptive Lead Hub 2.0
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Tiếp nhận và xử lý thông số yêu cầu đồng bộ linh hoạt theo từng loại dịch vụ (SMM, AI Tools, Proxy/VPS, Digital). Tự động cập nhật mỗi 5 giây.
          </p>
        </div>

        <button
          onClick={() => fetchRequests(true)}
          disabled={isRefreshing}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-bold text-gray-200 hover:text-white flex items-center gap-2 transition-all active:scale-95 shrink-0"
        >
          <Sparkles className={`w-4 h-4 text-gold-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Đang làm mới...' : '🔄 Tải đơn mới'}</span>
        </button>
      </div>

      {/* 2. CATEGORY TABS & STATUS FILTERS */}
      <div className="space-y-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {[
            { id: 'all', label: 'Tất cả yêu cầu', count: requestsList.length },
            { id: 'smm', label: '🚀 Mạng Xã Hội (SMM)', count: requestsList.filter((r) => getCategoryType(r.categorySnapshot) === 'smm').length },
            { id: 'ai', label: '🤖 AI Tools & Accounts', count: requestsList.filter((r) => getCategoryType(r.categorySnapshot) === 'ai').length },
            { id: 'proxy', label: '⚙️ Proxy & VPS MMO', count: requestsList.filter((r) => getCategoryType(r.categorySnapshot) === 'proxy').length },
            { id: 'digital', label: '🎓 Digital & Khóa học', count: requestsList.filter((r) => getCategoryType(r.categorySnapshot) === 'digital').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategoryTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategoryTab === tab.id
                  ? 'bg-neon-red text-white shadow-neon-red scale-105'
                  : 'bg-[#0E0E16] border border-white/10 text-gray-400 hover:text-white'
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

        {/* Status Filters & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {[
              { id: 'all', label: 'Tất cả trạng thái' },
              { id: 'NEW', label: '🟡 Chờ xử lý' },
              { id: 'CONTACTING', label: '💬 Đang liên hệ' },
              { id: 'PROCESSING', label: '⚡ Đang xử lý' },
              { id: 'COMPLETED', label: '🟢 Hoàn thành' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStatusFilter(st.id)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                  selectedStatusFilter === st.id
                    ? 'bg-white/15 text-white border border-white/30'
                    : 'bg-white/5 border border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo Mã REQ, SĐT, Tên..."
              className="w-full pl-10 pr-4 py-2 bg-[#0A0A10] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-neon-red"
            />
          </div>
        </div>
      </div>

      {/* 3. SERVICE REQUESTS TABLE */}
      <div className="bg-[#0A0A10] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E0E16] border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6 text-center min-w-[120px]">Thao tác</th>
                <th className="p-4 min-w-[120px]">Mã yêu cầu</th>
                <th className="p-4 min-w-[180px]">Khách hàng</th>
                <th className="p-4 min-w-[240px]">Dịch vụ yêu cầu</th>
                <th className="p-4 text-center min-w-[130px]">Loại dịch vụ</th>
                <th className="p-4 text-right min-w-[120px]">Giá dự kiến</th>
                <th className="p-4 pr-6 text-center min-w-[140px]">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300 font-medium">
              {filteredRequests.map((req) => {
                const reqCatType = getCategoryType(req.categorySnapshot);
                return (
                  <tr key={req.id} className="hover:bg-white/[0.04] transition-colors group">
                    
                    {/* THAO TÁC CỘT ĐẦU TIÊN (NO SCROLL NEEDED) */}
                    <td className="p-4 pl-6 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleOpenDetail(req)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30 text-blue-300 hover:text-white text-[11px] font-bold transition-all hover:scale-105 flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem chi tiết</span>
                      </button>
                    </td>

                    <td className="p-4 font-bold text-sky-400 font-mono whitespace-nowrap cursor-pointer" onClick={() => handleOpenDetail(req)}>
                      #{req.requestCode}
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-white text-sm leading-snug">{req.guestName}</div>
                      <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span>{req.guestPhone}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-white text-xs line-clamp-1 group-hover:text-neon-red transition-colors">
                        {req.serviceNameSnapshot}
                      </div>
                      <div className="text-[10px] text-gray-400 truncate max-w-xs mt-0.5">
                        🔗 {req.targetUrl || 'Không có link'}
                      </div>
                    </td>

                    <td className="p-4 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase ${
                        reqCatType === 'smm' ? 'bg-neon-red/15 text-neon-red border border-neon-red/30' :
                        reqCatType === 'ai' ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30' :
                        reqCatType === 'proxy' ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30' :
                        'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {req.categorySnapshot}
                      </span>
                    </td>

                    <td className="p-4 text-right font-mono font-extrabold text-neon-red text-sm whitespace-nowrap">
                      {formatVND(req.estimatedPrice)}
                    </td>

                    <td className="p-4 pr-6 text-center whitespace-nowrap">
                      {getStatusBadge(req.status)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. ADAPTIVE REQUEST DETAIL MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className={`w-full max-w-3xl bg-[#0D0D15] border-2 rounded-3xl p-6 shadow-2xl space-y-6 text-white max-h-[90vh] overflow-y-auto custom-scrollbar relative ${
            getCategoryType(selectedRequest.categorySnapshot) === 'smm' ? 'border-neon-red/50 shadow-neon-red/20' :
            getCategoryType(selectedRequest.categorySnapshot) === 'ai' ? 'border-purple-500/50 shadow-purple-500/20' :
            getCategoryType(selectedRequest.categorySnapshot) === 'proxy' ? 'border-sky-500/50 shadow-sky-500/20' :
            'border-emerald-500/50 shadow-emerald-500/20'
          }`}>
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-xl bg-neon-red/20 border border-neon-red/40 text-neon-red font-mono font-bold text-sm">
                  #{selectedRequest.requestCode}
                </span>
                <div>
                  <h2 className="text-base font-black text-white flex items-center gap-2">
                    <span>CHI TIẾT YÊU CẦU DỊCH VỤ</span>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] uppercase font-bold">
                      {selectedRequest.categorySnapshot}
                    </span>
                  </h2>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Thời gian tạo: {selectedRequest.createdAt}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              
              {/* LEFT COLUMN: CUSTOMER & CATEGORY-SPECIFIC SERVICE DATA */}
              <div className="space-y-4">
                
                {/* Customer Box */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                  <div className="font-bold text-neon-red text-sm uppercase flex items-center gap-1.5 pb-2 border-b border-white/10">
                    👤 THÔNG TIN KHÁCH HÀNG
                  </div>
                  <div className="space-y-1.5 text-gray-300">
                    <div><b>Tên:</b> <span className="text-white font-bold">{selectedRequest.guestName}</span></div>
                    <div><b>Số điện thoại:</b> <span className="text-emerald-400 font-mono font-bold">{selectedRequest.guestPhone}</span></div>
                    <div><b>Email:</b> <span className="text-gray-300">{selectedRequest.guestEmail || 'Chưa cung cấp'}</span></div>
                    <div><b>Telegram:</b> <span className="text-sky-400 font-mono">{selectedRequest.telegramUsername || 'Chưa cung cấp'}</span></div>
                    <div><b>Facebook:</b> <span className="text-blue-400">{selectedRequest.facebookUsername || 'Chưa cung cấp'}</span></div>
                  </div>
                </div>

                {/* CATEGORY-ADAPTIVE SERVICE DATA BOX */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                  <div className="font-bold text-sky-400 text-sm uppercase flex items-center justify-between pb-2 border-b border-white/10">
                    <span>🛒 THÔNG SỐ CẤU HÌNH DỊCH VỤ</span>
                    <span className="text-[10px] font-mono text-gray-400">TYPE: {getCategoryType(selectedRequest.categorySnapshot).toUpperCase()}</span>
                  </div>

                  <div className="space-y-2 text-gray-300">
                    <div><b>Tên dịch vụ:</b> <span className="text-white font-bold block mt-0.5">{selectedRequest.serviceNameSnapshot}</span></div>

                    {/* SMM Specific inputs display */}
                    {getCategoryType(selectedRequest.categorySnapshot) === 'smm' && (
                      <>
                        <div><b>🔗 Link Target:</b> <a href={selectedRequest.targetUrl} target="_blank" rel="noreferrer" className="text-sky-300 font-mono underline block truncate hover:text-white mt-0.5">{selectedRequest.targetUrl}</a></div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div><b>Số lượng:</b> <span className="text-white font-mono font-bold block">{selectedRequest.quantity.toLocaleString()}</span></div>
                          <div><b>Gói Server:</b> <span className="text-amber-300 font-bold block">{selectedRequest.speed}</span></div>
                        </div>
                      </>
                    )}

                    {/* AI Specific inputs display */}
                    {getCategoryType(selectedRequest.categorySnapshot) === 'ai' && (
                      <>
                        <div><b>📧 Target Email Nâng Cấp:</b> <span className="text-purple-300 font-mono font-bold block">{selectedRequest.targetUrl || 'Nhận kho tài khoản sẵn'}</span></div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div><b>Số lượng tài khoản:</b> <span className="text-white font-mono font-bold block">{selectedRequest.quantity}</span></div>
                          <div><b>Thời hạn:</b> <span className="text-purple-300 font-bold block">{selectedRequest.serviceInputs?.duration || '1 Tháng'}</span></div>
                        </div>
                      </>
                    )}

                    {/* Proxy Specific inputs display */}
                    {getCategoryType(selectedRequest.categorySnapshot) === 'proxy' && (
                      <>
                        <div><b>⚙️ Location / IP:</b> <span className="text-sky-300 font-bold block">{selectedRequest.targetUrl || 'Datacenter VN'}</span></div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div><b>Số lượng IP/VPS:</b> <span className="text-white font-mono font-bold block">{selectedRequest.quantity} Node</span></div>
                          <div><b>Giao thức:</b> <span className="text-sky-300 font-bold block">{selectedRequest.serviceInputs?.proxyProtocol || 'HTTP/SOCKS5'}</span></div>
                        </div>
                      </>
                    )}

                    {/* Digital / Course inputs display */}
                    {getCategoryType(selectedRequest.categorySnapshot) === 'digital' && (
                      <>
                        <div><b>📧 Email nhận khóa học:</b> <span className="text-emerald-300 font-mono font-bold block">{selectedRequest.targetUrl}</span></div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div><b>Số lượng Slot:</b> <span className="text-white font-mono font-bold block">{selectedRequest.quantity} Slot</span></div>
                          <div><b>Hình thức bàn giao:</b> <span className="text-emerald-300 font-bold block">Drive HD + File</span></div>
                        </div>
                      </>
                    )}

                    <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                      <span className="text-gray-400 font-bold">GIÁ DỰ KIẾN:</span>
                      <span className="text-lg font-black text-neon-red font-mono">{formatVND(selectedRequest.estimatedPrice)}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Note */}
                {selectedRequest.customerNote && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 space-y-1">
                    <div className="font-bold">📝 Ghi chú từ khách hàng:</div>
                    <p className="italic">"{selectedRequest.customerNote}"</p>
                  </div>
                )}

              </div>

              {/* RIGHT COLUMN: ACTIONS, DELIVERY INPUT & HISTORY */}
              <div className="space-y-4">
                
                {/* QUICK ACTION BUTTONS */}
                <div className="p-4 bg-neon-red/10 border border-neon-red/30 rounded-2xl space-y-3">
                  <div className="font-bold text-neon-red text-sm uppercase">
                    ⚡ HÀNH ĐỘNG XỬ LÝ LIÊN HỆ
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${selectedRequest.guestPhone}`}
                      className="p-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Gọi điện</span>
                    </a>

                    <a
                      href={`https://zalo.me/${selectedRequest.guestPhone.replace(/\s+/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-300 font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat Zalo</span>
                    </a>
                  </div>

                  {/* Status Dropdown selector */}
                  <div className="space-y-1 pt-2">
                    <label className="text-gray-300 font-bold">Cập nhật trạng thái xử lý:</label>
                    <select
                      value={selectedRequest.status}
                      onChange={(e) => handleUpdateStatus(selectedRequest.id, e.target.value as ServiceRequestStatus)}
                      className="w-full px-3 py-2 bg-[#05050A] border border-neon-red/40 rounded-xl text-white font-bold outline-none"
                    >
                      <option value="NEW">🟡 NEW (Chờ xử lý)</option>
                      <option value="CONTACTING">💬 CONTACTING (Đang liên hệ)</option>
                      <option value="CONFIRMED">💜 CONFIRMED (Đã xác nhận chốt đơn)</option>
                      <option value="PROCESSING">⚡ PROCESSING (Đang xử lý chạy dịch vụ)</option>
                      <option value="WAITING_CUSTOMER">⏳ WAITING_CUSTOMER (Chờ phản hồi từ khách)</option>
                      <option value="COMPLETED">🟢 COMPLETED (Đã hoàn thành bàn giao)</option>
                      <option value="CANCELED">⚪ CANCELED (Khách đã hủy)</option>
                      <option value="REJECTED">🔴 REJECTED (Từ chối đơn)</option>
                    </select>
                  </div>
                </div>

                {/* DELIVERY DATA PASTE BOX FOR ADMIN (AI Pass / Proxy IP / Drive link) */}
                <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-2xl space-y-2">
                  <div className="font-bold text-purple-300 text-xs uppercase flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5" />
                    <span>DỮ LIỆU BÀN GIAO CHO KHÁCH (EMAIL|PASS / IP PROXY)</span>
                  </div>
                  <textarea
                    rows={2}
                    value={deliveryOutputData}
                    onChange={(e) => setDeliveryOutputData(e.target.value)}
                    placeholder="Dán Email|Password tài khoản hoặc IP:Port Proxy để gửi cho khách..."
                    className="w-full px-3 py-2 bg-[#05050A] border border-purple-500/40 rounded-xl text-purple-200 font-mono text-xs outline-none"
                  />
                </div>

                {/* INTERNAL ADMIN NOTES */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                  <div className="font-bold text-gray-300 text-xs uppercase flex items-center justify-between">
                    <span>📌 GHI CHÚ NỘI BỘ (KHÔNG HIỆN CHO KHÁCH)</span>
                  </div>

                  <textarea
                    rows={2}
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    placeholder="VD: Đã báo khách giá 1.200k, khách hẹn 14h hôm nay chuyển khoản..."
                    className="w-full px-3.5 py-2 bg-[#05050A] border border-white/15 rounded-xl text-white outline-none focus:border-purple-500"
                  />

                  <button
                    onClick={handleSaveAdminNote}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Lưu ghi chú nội bộ</span>
                  </button>
                </div>

                {/* CUSTOMER REQUEST HISTORY */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                  <div className="font-bold text-gray-300 text-xs uppercase flex items-center justify-between pb-1 border-b border-white/10">
                    <span>📜 LỊCH SỬ YÊU CẦU CỦA KHÁCH</span>
                    <span className="text-neon-red font-mono">
                      {getCustomerHistory(selectedRequest.guestPhone).length} Yêu cầu
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar pt-1">
                    {getCustomerHistory(selectedRequest.guestPhone).map((h) => (
                      <div key={h.id} className="flex items-center justify-between p-2 bg-black/30 rounded-xl text-[11px]">
                        <div>
                          <span className="font-bold text-neon-red font-mono">#{h.requestCode}</span>
                          <span className="text-gray-400 ml-2">{h.serviceNameSnapshot}</span>
                        </div>
                        <span className="font-bold text-emerald-400 font-mono">{formatVND(h.estimatedPrice)}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
