'use client';

import React, { useState } from 'react';
import { MOCK_RESOURCES } from '@/data/mockResources';
import { Resource } from '@/types';
import { useToast } from '@/context/ToastContext';
import { 
  FolderGit2, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Download, 
  FileText, 
  Sparkles, 
  Search, 
  ExternalLink,
  Eye,
  Lock,
  Code
} from 'lucide-react';

export default function AdminResourcesPage() {
  const [resourcesList, setResourcesList] = useState<Resource[]>(MOCK_RESOURCES);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const [formData, setFormData] = useState({
    title: '',
    category: 'AI Prompt',
    type: 'prompt' as Resource['type'],
    isVipOnly: false,
    description: '',
    previewContent: '',
    downloadCount: 150,
    fileSize: '5.0 MB',
    fileUrl: 'https://drive.google.com/file/d/demo',
    rating: 5.0,
  });

  const handleEdit = (res: Resource) => {
    setEditingResource(res);
    setIsCreating(false);
    setFormData({
      title: res.title,
      category: res.category,
      type: res.type,
      isVipOnly: res.isVipOnly,
      description: res.description,
      previewContent: res.previewContent || '',
      downloadCount: res.downloadCount,
      fileSize: res.fileSize,
      fileUrl: res.fileUrl,
      rating: res.rating,
    });
  };

  const handleCreateNew = () => {
    setEditingResource(null);
    setIsCreating(true);
    setFormData({
      title: '',
      category: 'AI Prompt',
      type: 'prompt',
      isVipOnly: false,
      description: '',
      previewContent: '[NỘI DUNG XEM TRƯỚC VÍ DỤ]\nNhập kịch bản prompt hoặc mã code xem trước...',
      downloadCount: 0,
      fileSize: '3.5 MB',
      fileUrl: 'https://drive.google.com/file/d/demo',
      rating: 5.0,
    });
  };

  const { showToast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Vui lòng nhập tên tài nguyên!', 'error');
      return;
    }

    let updatedList: Resource[] = [];

    if (editingResource) {
      updatedList = resourcesList.map((r) =>
        r.id === editingResource.id
          ? {
              ...r,
              title: formData.title,
              category: formData.category,
              type: formData.type,
              isVipOnly: formData.isVipOnly,
              description: formData.description,
              previewContent: formData.previewContent,
              downloadCount: formData.downloadCount,
              fileSize: formData.fileSize,
              fileUrl: formData.fileUrl,
            }
          : r
      );
      showToast(`Đã cập nhật tài nguyên "${formData.title}" thành công!`, 'success');
    } else {
      const newRes: Resource = {
        id: `res-${Date.now()}`,
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        category: formData.category,
        type: formData.type,
        isVipOnly: formData.isVipOnly,
        description: formData.description,
        previewContent: formData.previewContent,
        downloadCount: formData.downloadCount,
        fileSize: formData.fileSize,
        fileUrl: formData.fileUrl,
        rating: 5.0,
      };
      updatedList = [newRes, ...resourcesList];
      showToast(`Đã thêm mới tài nguyên "${formData.title}" thành công!`, 'success');
    }

    setResourcesList(updatedList);
    // Cache into localStorage for public page sync
    try {
      localStorage.setItem('nguyenmmo_resources', JSON.stringify(updatedList));
    } catch (e) {}

    setEditingResource(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa tài nguyên "${title}"?`)) {
      const updatedList = resourcesList.filter((r) => r.id !== id);
      setResourcesList(updatedList);
      try {
        localStorage.setItem('nguyenmmo_resources', JSON.stringify(updatedList));
      } catch (e) {}
    }
  };

  const filteredResources = resourcesList.filter((r) => {
    const matchesType = selectedType === 'all' || r.type === selectedType;
    const matchesSearch =
      searchQuery === '' ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalDownloads = resourcesList.reduce((acc, r) => acc + r.downloadCount, 0);

  return (
    <div className="space-y-6">
      
      {/* 1. HEADER TITLE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <FolderGit2 className="w-6 h-6 text-neon-red" />
              <span>QUẢN LÝ KHO TÀI NGUYÊN & XEM TRƯỚC</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-neon-red/20 border border-neon-red/40 text-neon-red text-[11px] font-mono font-bold">
              Resource Hub Admin
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Quản lý tài nguyên, cấu hình nội dung xem trước (Preview) và link tải thực tế công khai.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-5 py-2.5 bg-neon-red hover:bg-neon-red-hover text-white text-xs font-bold rounded-xl shadow-neon-red flex items-center gap-2 hover:scale-105 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Tài Nguyên Mới</span>
        </button>
      </div>

      {/* 2. STATS SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-[#0D0D14] border border-white/10 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 font-medium">Tổng tài nguyên</div>
            <div className="text-2xl font-black text-white mt-1">{resourcesList.length} File</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-neon-red/20 border border-neon-red/30 flex items-center justify-center text-neon-red">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-[#0D0D14] border border-white/10 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 font-medium">Tổng lượt tải thành công</div>
            <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">{totalDownloads.toLocaleString()}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Download className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-[#0D0D14] border border-white/10 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 font-medium">Tài nguyên miễn phí</div>
            <div className="text-2xl font-black text-sky-400 mt-1">{resourcesList.filter((r) => !r.isVipOnly).length} Mục</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. MODAL FORM CẤU HÌNH TÀI NGUYÊN */}
      {(editingResource || isCreating) && (
        <div className="bg-[#0C0C14] border-2 border-neon-red/50 rounded-3xl p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 relative">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-neon-red/20 text-neon-red flex items-center justify-center font-bold">
                <FolderGit2 className="w-5 h-5" />
              </span>
              <h2 className="text-base font-black text-white">
                {editingResource ? `Chỉnh sửa: ${editingResource.title}` : 'Thêm mới tài nguyên kho'}
              </h2>
            </div>

            <button
              onClick={() => {
                setEditingResource(null);
                setIsCreating(false);
              }}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-gray-300 font-bold">Tên tiêu đề tài nguyên *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="VD: Bộ 1.000+ Prompt ChatGPT & Claude Chuyên Viết Kịch Bản"
                  className="w-full px-3.5 py-2.5 bg-[#05050A] border border-white/15 rounded-xl text-white outline-none focus:border-neon-red font-medium text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold">Loại phân nhóm *</label>
                <select
                  value={formData.type}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    const catMap: Record<string, string> = {
                      prompt: 'AI Prompt',
                      template: 'Template UI',
                      ebook: 'Ebook MMO',
                      extension: 'Tool & Extension',
                    };
                    setFormData({ ...formData, type: val, category: catMap[val] || 'Khác' });
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#05050A] border border-neon-red/40 rounded-xl text-white font-bold outline-none"
                >
                  <option value="prompt">🤖 AI Prompt</option>
                  <option value="template">🎨 Template UI / Web</option>
                  <option value="ebook">📚 Ebook MMO / Guide</option>
                  <option value="extension">⚙️ Tool & Extension</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold">Dung lượng File</label>
                <input
                  type="text"
                  value={formData.fileSize}
                  onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                  placeholder="2.5 MB"
                  className="w-full px-3.5 py-2 bg-[#05050A] border border-white/15 rounded-xl text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold">Lượt tải giả lập</label>
                <input
                  type="number"
                  value={formData.downloadCount}
                  onChange={(e) => setFormData({ ...formData, downloadCount: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 bg-[#05050A] border border-white/15 rounded-xl text-white font-mono outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold">Yêu cầu quyền hạn</label>
                <select
                  value={formData.isVipOnly ? 'vip' : 'free'}
                  onChange={(e) => setFormData({ ...formData, isVipOnly: e.target.value === 'vip' })}
                  className="w-full px-3.5 py-2 bg-[#05050A] border border-white/15 rounded-xl text-white outline-none font-bold"
                >
                  <option value="free">🟢 Tải Miễn Phí (Free for All)</option>
                  <option value="vip">🔒 Thành Viên Đăng Nhập</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sky-400 font-bold flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Link tải trực tiếp (Google Drive / Direct ZIP Link) *</span>
              </label>
              <input
                type="text"
                required
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                placeholder="https://drive.google.com/file/d/..."
                className="w-full px-3.5 py-2.5 bg-[#05050A] border border-sky-500/40 rounded-xl text-sky-300 font-mono outline-none"
              />
            </div>

            {/* PREVIEW CONTENT EDIT INPUT */}
            <div className="space-y-1.5">
              <label className="text-purple-300 font-bold flex items-center gap-1">
                <Code className="w-3.5 h-3.5" />
                <span>Nội dung xem trước (Preview Prompt / Code Sample / Mục lục PDF)</span>
              </label>
              <textarea
                rows={4}
                value={formData.previewContent}
                onChange={(e) => setFormData({ ...formData, previewContent: e.target.value })}
                placeholder="Nhập đoạn Prompt mẫu hoặc Mục lục Ebook cho khách hàng xem trước..."
                className="w-full px-3.5 py-2.5 bg-[#05050A] border border-purple-500/40 rounded-xl text-purple-200 font-mono outline-none focus:border-purple-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 font-bold">Mô tả ngắn tài nguyên</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả tóm tắt nội dung tài nguyên..."
                className="w-full px-3.5 py-2.5 bg-[#05050A] border border-white/15 rounded-xl text-white outline-none focus:border-neon-red"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setEditingResource(null);
                  setIsCreating(false);
                }}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-gray-300 font-bold rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-neon-red hover:bg-neon-red-hover text-white font-bold rounded-xl shadow-neon-red flex items-center gap-1.5 hover:scale-105 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{editingResource ? 'Lưu cập nhật' : 'Thêm tài nguyên mới'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. FILTER TABS & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {[
            { id: 'all', label: 'Tất cả tài nguyên', count: resourcesList.length },
            { id: 'prompt', label: '🤖 AI Prompt', count: resourcesList.filter((r) => r.type === 'prompt').length },
            { id: 'template', label: '🎨 Template UI', count: resourcesList.filter((r) => r.type === 'template').length },
            { id: 'ebook', label: '📚 Ebook MMO', count: resourcesList.filter((r) => r.type === 'ebook').length },
            { id: 'extension', label: '⚙️ Tool Extension', count: resourcesList.filter((r) => r.type === 'extension').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedType === tab.id
                  ? 'bg-neon-red text-white shadow-neon-red scale-105'
                  : 'bg-[#0E0E16] border border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                selectedType === tab.id ? 'bg-black/30 text-white' : 'bg-white/10 text-gray-300'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tài nguyên..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A10] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-neon-red"
          />
        </div>
      </div>

      {/* 5. TABLE OF RESOURCES */}
      <div className="bg-[#0A0A10] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E0E16] border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6 text-center min-w-[120px]">Thao tác</th>
                <th className="p-4 min-w-[300px]">Tài nguyên</th>
                <th className="p-4 text-center min-w-[120px]">Phân loại</th>
                <th className="p-4 text-center min-w-[110px]">Dung lượng</th>
                <th className="p-4 text-center min-w-[120px]">Lượt tải</th>
                <th className="p-4 pr-6 text-center min-w-[130px]">Quyền tải</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300 font-medium">
              {filteredResources.map((res) => (
                <tr key={res.id} className="hover:bg-white/[0.04] transition-colors group">
                  
                  {/* THAO TÁC CỘT ĐẦU TIÊN (NO SCROLL NEEDED) */}
                  <td className="p-4 pl-6 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleEdit(res)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30 text-blue-300 hover:text-white text-[11px] font-bold transition-all hover:scale-105 flex items-center gap-1"
                        title="Chỉnh sửa tài nguyên"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Sửa</span>
                      </button>
                      <button
                        onClick={() => handleDelete(res.id, res.title)}
                        className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all hover:scale-110"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  <td className="p-4 cursor-pointer" onClick={() => handleEdit(res)}>
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neon-red shrink-0 group-hover:scale-110 transition-transform">
                        <FileText className="w-5 h-5" />
                      </span>
                      <div className="min-w-0">
                        <div className="font-bold text-white text-sm line-clamp-1 group-hover:text-neon-red transition-colors">
                          {res.title}
                        </div>
                        <div className="text-[11px] text-gray-400 truncate max-w-md leading-snug">
                          {res.description}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-center whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-lg bg-neon-red/15 text-neon-red border border-neon-red/30 text-[10px] font-extrabold uppercase">
                      {res.category}
                    </span>
                  </td>

                  <td className="p-4 text-center font-mono whitespace-nowrap text-gray-300">
                    {res.fileSize || 'N/A'}
                  </td>

                  <td className="p-4 text-center font-mono font-bold text-emerald-400 whitespace-nowrap">
                    {res.downloadCount.toLocaleString()}
                  </td>

                  <td className="p-4 text-center whitespace-nowrap">
                    {res.isVipOnly ? (
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                        🔒 Thành viên
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                        🟢 Miễn phí
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
