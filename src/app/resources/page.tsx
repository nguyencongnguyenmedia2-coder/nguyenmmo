'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MOCK_RESOURCES } from '@/data/mockResources';
import { Resource } from '@/types';
import { 
  Download, 
  Search, 
  Lock, 
  Sparkles, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  Eye, 
  Copy, 
  Check, 
  X, 
  Star, 
  Code,
  ShieldCheck,
  FolderGit2,
  Cpu,
  Layers,
  BookOpen
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ResourcesPage() {
  const { user } = useAuth();
  const [resourcesList, setResourcesList] = useState<Resource[]>(MOCK_RESOURCES);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Preview Modal States
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Synchronize resources with Admin created/updated resources stored in localStorage if available
  useEffect(() => {
    try {
      const savedAdminResources = localStorage.getItem('nguyenmmo_resources');
      if (savedAdminResources) {
        const parsed = JSON.parse(savedAdminResources);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mergedCodes = new Set(parsed.map((r: any) => r.id));
          const mockExtras = MOCK_RESOURCES.filter((m) => !mergedCodes.has(m.id));
          setResourcesList([...parsed, ...mockExtras]);
          return;
        }
      }
    } catch (e) {}
    setResourcesList(MOCK_RESOURCES);
  }, []);

  const types = [
    { id: 'all', label: 'Tất cả tài nguyên', icon: FolderGit2 },
    { id: 'prompt', label: '🤖 AI Prompt', icon: Sparkles },
    { id: 'template', label: '🎨 UI & Source Code', icon: Layers },
    { id: 'ebook', label: '📚 Ebook MMO', icon: BookOpen },
    { id: 'extension', label: '⚙️ Tool & Automation', icon: Cpu },
  ];

  const filteredResources = resourcesList.filter((res) => {
    const matchType = selectedType === 'all' || res.type === selectedType;
    const matchSearch =
      searchQuery === '' ||
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchType && matchSearch;
  });

  const handleDownload = (res: Resource) => {
    if (res.fileUrl && res.fileUrl !== '#' && res.fileUrl !== '#download') {
      window.open(res.fileUrl, '_blank');
    } else {
      alert(`Đang tiến hành tải xuống tệp thực tế "${res.title}"...`);
    }
  };

  const handleCopyContent = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* 1. PROFESSIONAL BANNER HEADER (VIỀN CHẠY & KHÔNG SHADOW PHÁT SÁNG ĐỎ) */}
      <div className="border-beam-always p-8 text-white space-y-4">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/15 text-gold-400 font-extrabold text-xs tracking-wider uppercase font-mono">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>KHO TÀI NGUYÊN DIGITAL MMO MASTER</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            PROMPT AI, MÃ NGUỒN UI & BỘ CÔNG CỤ TỰ ĐỘNG HÓA
          </h1>

          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Tổng hợp kịch bản AI Prompt, mã nguồn giao diện, tài liệu MMO và công cụ tự động hóa. Đã được kiểm duyệt an toàn, hỗ trợ xem trước mẫu mã code trước khi tải về.
          </p>
        </div>

        {/* Quick Stats Counter Bar */}
        <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="space-y-0.5">
            <div className="text-gray-400">Tổng số tệp:</div>
            <div className="text-white font-black text-base">{resourcesList.length}+ File</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-gray-400">Lượt tải hệ thống:</div>
            <div className="text-emerald-400 font-black text-base">18,500+ lượt</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-gray-400">Bảo mật tệp:</div>
            <div className="text-sky-400 font-black text-base flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Sạch 100%</span>
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-gray-400">Cập nhật mới:</div>
            <div className="text-gold-400 font-black text-base">Hằng ngày</div>
          </div>
        </div>
      </div>

      {/* 2. SEARCH & CATEGORY FILTER BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-[#0D0D14] border border-white/10 rounded-2xl">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên tệp, AI prompt, công cụ..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-white/30"
          />
        </div>

        {/* Category Filter Tabs with Border Beam */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto custom-scrollbar">
          {types.map((t) => {
            const Icon = t.icon;
            const isSelected = selectedType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'border-beam-pill text-white'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-neon-red' : 'text-gray-400'}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. PROFESSIONAL RESOURCES GRID LIST (VIỀN CHẠY ROTATING LIGHT BEAM & BỎ LỚP SHADOW ĐỎ) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="border-beam-card p-6 flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              {/* Category & Badge Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-white/5 border border-white/15 rounded-lg text-[10px] font-bold text-gray-200 uppercase font-mono">
                    {res.category}
                  </span>
                  <span className="text-gold-400 font-bold text-xs flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-gold-400" />
                    <span>{res.rating || 5.0}</span>
                  </span>
                </div>

                {res.isVipOnly ? (
                  <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-[10px] font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3 text-purple-400" /> Thành Viên VIP
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Miễn Phí Tải
                  </span>
                )}
              </div>

              {/* Resource Title */}
              <h3 
                onClick={() => setPreviewResource(res)}
                className="text-base font-bold text-white group-hover:text-neon-red transition-colors line-clamp-2 leading-snug cursor-pointer"
              >
                {res.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                {res.description}
              </p>

              {/* Interactive Preview Button Trigger */}
              <button
                onClick={() => setPreviewResource(res)}
                className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-sky-400 flex items-center justify-center gap-1.5 transition-all"
              >
                <Eye className="w-4 h-4 text-sky-400" />
                <span>👁️ Xem trước kịch bản / mẫu tệp</span>
              </button>
            </div>

            {/* Card Footer info & Download button */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 font-mono">
              <div className="flex items-center gap-2">
                <span>File: <strong className="text-white">{res.fileSize || '2.5 MB'}</strong></span>
                <span>•</span>
                <span>Tải: <strong className="text-emerald-400">{res.downloadCount.toLocaleString()}</strong></span>
              </div>

              <button
                onClick={() => handleDownload(res)}
                className="px-4 py-2 bg-neon-red hover:bg-neon-red-hover text-white font-bold text-xs rounded-xl btn-beam-touch flex items-center gap-1.5 hover:scale-105 transition-transform overflow-hidden"
              >
                <Download className="w-3.5 h-3.5" />
                <span>TẢI VỀ</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 4. RESOURCE PREVIEW MODAL DIALOG (VIỀN CHẠY ROTATING LIGHT BEAM & BỎ LỚP SHADOW ĐỎ) */}
      {previewResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-3xl border-beam-always p-6 text-white max-h-[90vh] overflow-y-auto custom-scrollbar relative space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-white/10 border border-white/15 text-gray-200 font-mono font-bold text-[10px] uppercase">
                    {previewResource.category}
                  </span>
                  <span className="text-gold-400 font-bold text-xs flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-gold-400" />
                    <span>{previewResource.rating || 5.0} / 5.0</span>
                  </span>
                </div>
                <h2 className="text-lg font-black text-white leading-snug">
                  {previewResource.title}
                </h2>
              </div>

              <button
                onClick={() => setPreviewResource(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Resource Description */}
            <div className="space-y-2 text-xs text-gray-300">
              <div className="font-bold text-white">Mô tả tổng quan tài nguyên:</div>
              <p className="leading-relaxed bg-white/5 p-3 rounded-2xl border border-white/10">
                {previewResource.description}
              </p>
            </div>

            {/* INTERACTIVE PREVIEW CONTENT CODE BOX */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="font-bold text-sky-400 flex items-center gap-1.5">
                  <Code className="w-4 h-4" />
                  <span>NỘI DUNG MẪU XEM TRƯỚC (SAMPLE PREVIEW):</span>
                </div>

                {previewResource.previewContent && (
                  <button
                    onClick={() => handleCopyContent(previewResource.previewContent || '')}
                    className="px-3 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[11px] font-bold flex items-center gap-1 hover:bg-sky-500/30 transition-all"
                  >
                    {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText ? 'Đã sao chép!' : 'Sao chép xem trước'}</span>
                  </button>
                )}
              </div>

              <div className="p-4 bg-[#05050A] border border-white/15 rounded-2xl font-mono text-xs text-sky-200 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto custom-scrollbar">
                {previewResource.previewContent || `[NỘI DUNG XEM TRƯỚC DÀNH CHO ${previewResource.title.toUpperCase()}]

1. Định dạng tệp: Tệp nén đầy đủ tài liệu & mã nguồn thực thi.
2. Dung lượng: ${previewResource.fileSize || '2.5 MB'}
3. Kiểm duyệt: Đã được quét sạch virus & kiểm thử tương thích 100%.
4. Hướng dẫn: Tải về và làm theo hướng dẫn đính kèm trong thư mục.`}
              </div>
            </div>

            {/* Bottom Info Bar */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-white/5 rounded-2xl text-center text-xs text-gray-300 font-mono border border-white/10">
              <div>Dung lượng: <strong className="text-white">{previewResource.fileSize || '2.5 MB'}</strong></div>
              <div>Lượt tải: <strong className="text-emerald-400">{previewResource.downloadCount.toLocaleString()}</strong></div>
              <div className="text-emerald-300 flex items-center justify-center gap-1 font-sans font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Kháng virus 100%
              </div>
            </div>

            {/* ACTION CTA BUTTONS */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-white/10">
              <button
                onClick={() => setPreviewResource(null)}
                className="w-full sm:w-auto px-5 py-2.5 bg-white/10 hover:bg-white/20 text-gray-300 font-bold text-xs rounded-xl"
              >
                Đóng màn hình
              </button>

              <button
                onClick={() => handleDownload(previewResource)}
                className="w-full sm:w-auto px-6 py-3 bg-neon-red hover:bg-neon-red-hover text-white font-black text-xs rounded-xl btn-beam-touch flex items-center justify-center gap-2 hover:scale-105 transition-transform overflow-hidden"
              >
                <Download className="w-4 h-4" />
                <span>⚡ TẢI VỀ TỆP THỰC TẾ NGAY</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
