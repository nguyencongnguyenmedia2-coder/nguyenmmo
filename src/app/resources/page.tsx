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
  ShieldCheck
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
        setResourcesList(JSON.parse(savedAdminResources));
      }
    } catch (e) {
      console.warn('Could not read admin resources cache:', e);
    }
  }, []);

  const types = [
    { id: 'all', label: 'Tất cả tài nguyên' },
    { id: 'prompt', label: '🤖 AI Prompt' },
    { id: 'template', label: '🎨 Template UI' },
    { id: 'ebook', label: '📚 Ebook MMO' },
    { id: 'extension', label: '⚙️ Tool & Extension' },
  ];

  const filteredResources = resourcesList.filter((res) => {
    const matchType = selectedType === 'all' || res.type === selectedType;
    const matchSearch =
      searchQuery === '' ||
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchType && matchSearch;
  });

  const handleDownload = (res: Resource) => {
    if (res.fileUrl && res.fileUrl !== '#download') {
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
      
      {/* Banner Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-neon-red/20 via-purple-900/20 to-[#0D0D14] border border-neon-red/30 shadow-neon-red">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-red/20 text-neon-red text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KHO TÀI NGUYÊN DIGITAL MMO</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            PROMPT AI, EBOOK MMO & CÔNG CỤ TỰ ĐỘNG
          </h1>
          <p className="text-gray-300 text-sm leading-relaxed">
            Xem trước nội dung kịch bản, cấu trúc mã code & tài liệu thực chiến trước khi tiến hành tải xuống.
          </p>
        </div>
      </div>

      {/* Search & Category Filter Tabs */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-[#0D0D14] border border-white/10 rounded-2xl shadow-glass">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên file, chủ đề tài nguyên..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-neon-red"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto custom-scrollbar">
          {types.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedType === t.id
                  ? 'bg-neon-red text-white shadow-neon-red scale-105'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="p-6 bg-[#0D0D12] border border-white/10 hover:border-neon-red/50 rounded-3xl space-y-4 shadow-glass transition-all hover:-translate-y-1 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-neon-red/15 border border-neon-red/30 rounded-lg text-[10px] font-bold text-neon-red uppercase font-mono">
                  {res.category}
                </span>

                {res.isVipOnly ? (
                  <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-[10px] font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> THÀNH VIÊN
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> MIỄN PHÍ TẢI
                  </span>
                )}
              </div>

              <h3 
                onClick={() => setPreviewResource(res)}
                className="text-base font-bold text-white group-hover:text-neon-red transition-colors line-clamp-2 leading-snug cursor-pointer"
              >
                {res.title}
              </h3>

              <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                {res.description}
              </p>

              {/* Preview Button Badge */}
              <button
                onClick={() => setPreviewResource(res)}
                className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-sky-400 flex items-center justify-center gap-1.5 transition-all"
              >
                <Eye className="w-4 h-4 text-sky-400" />
                <span>👁️ Kích vào xem trước mẫu file</span>
              </button>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400 font-mono">
              <div className="flex items-center gap-3">
                <span>Dung lượng: <strong className="text-white">{res.fileSize || 'N/A'}</strong></span>
                <span>•</span>
                <span>Lượt tải: <strong className="text-emerald-400">{res.downloadCount.toLocaleString()}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(res)}
                  className="px-4 py-2 bg-neon-red hover:bg-neon-red-hover text-white font-bold text-xs rounded-xl btn-beam-touch flex items-center gap-1.5 hover:scale-105 transition-all relative overflow-hidden"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>TẢI VỀ</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RESOURCE PREVIEW MODAL POPUP */}
      {previewResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-3xl bg-[#0D0D15] border-2 border-neon-red/50 rounded-3xl p-6 shadow-2xl space-y-6 text-white max-h-[90vh] overflow-y-auto custom-scrollbar relative">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-neon-red/20 border border-neon-red/40 text-neon-red font-mono font-bold text-[10px] uppercase">
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
              <div className="font-bold text-white">Mô tả tổng quan:</div>
              <p className="leading-relaxed bg-white/5 p-3 rounded-2xl border border-white/10">
                {previewResource.description}
              </p>
            </div>

            {/* INTERACTIVE PREVIEW CONTENT BOX */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="font-bold text-sky-400 flex items-center gap-1.5">
                  <Code className="w-4 h-4" />
                  <span>NỘI DUNG XEM TRƯỚC (SAMPLE PREVIEW):</span>
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

              <div className="p-4 bg-[#05050A] border border-sky-500/30 rounded-2xl font-mono text-xs text-sky-200 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto custom-scrollbar">
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
                <ShieldCheck className="w-3.5 h-3.5" /> Kháng virus 100%
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
                className="w-full sm:w-auto px-6 py-3 bg-neon-red hover:bg-neon-red-hover text-white font-black text-xs rounded-xl btn-beam-touch flex items-center justify-center gap-2 hover:scale-105 transition-all relative overflow-hidden"
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
