'use client';

import React, { useState, useEffect } from 'react';
import { MOCK_CATEGORIES } from '@/data/mockCategories';
import { Category, CategorySlug } from '@/types';
import { useToast } from '@/context/ToastContext';
import { 
  Grid, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  Flame, 
  Tag, 
  ExternalLink,
  Layers
} from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categoriesList, setCategoriesList] = useState<Category[]>(MOCK_CATEGORIES);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeTab, setSelectedTypeTab] = useState<string>('all');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: '🚀',
    description: '',
    count: 25,
    badge: '',
    isHot: false,
  });

  const handleEdit = (cat: Category) => {
    setEditingCategory(cat);
    setIsCreating(false);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || '🚀',
      description: cat.description,
      count: cat.count || 20,
      badge: cat.badge || '',
      isHot: cat.isHot || false,
    });
  };

  const handleCreateNew = () => {
    setEditingCategory(null);
    setIsCreating(true);
    setFormData({
      name: '',
      slug: '',
      icon: '🚀',
      description: '',
      count: 0,
      badge: 'NEW',
      isHot: false,
    });
  };

  const { showToast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      showToast('Vui lòng nhập Tên danh mục và Slug đường dẫn!', 'error');
      return;
    }

    let updatedList: Category[] = [];

    if (editingCategory) {
      updatedList = categoriesList.map((c) =>
        c.id === editingCategory.id
          ? {
              ...c,
              name: formData.name,
              slug: (formData.slug.toLowerCase().replace(/[^a-z0-9]/g, '-') as CategorySlug),
              icon: formData.icon,
              description: formData.description,
              count: formData.count,
              badge: formData.badge ? formData.badge.toUpperCase() : undefined,
              isHot: formData.isHot,
            }
          : c
      );
      showToast(`Đã cập nhật danh mục "${formData.name}" thành công!`, 'success');
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: formData.name,
        slug: (formData.slug.toLowerCase().replace(/[^a-z0-9]/g, '-') as CategorySlug),
        icon: formData.icon,
        description: formData.description,
        count: formData.count || 0,
        badge: formData.badge ? formData.badge.toUpperCase() : undefined,
        isHot: formData.isHot,
      };
      updatedList = [newCat, ...categoriesList];
      showToast(`Đã thêm mới danh mục "${formData.name}" thành công!`, 'success');
    }

    setCategoriesList(updatedList);
    try {
      localStorage.setItem('nguyenmmo_categories', JSON.stringify(updatedList));
    } catch (e) {}

    setEditingCategory(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}"?`)) {
      const updatedList = categoriesList.filter((c) => c.id !== id);
      setCategoriesList(updatedList);
      try {
        localStorage.setItem('nguyenmmo_categories', JSON.stringify(updatedList));
      } catch (e) {}
    }
  };

  const filteredCategories = categoriesList.filter((c) => {
    const matchesSearch =
      searchQuery === '' ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* 1. ELEGANT HEADER TITLE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Grid className="w-6 h-6 text-neon-red" />
              <span>QUẢN LÝ DANH MỤC DỊCH VỤ</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-neon-red/20 border border-neon-red/40 text-neon-red text-[11px] font-mono font-bold">
              Category Sync 2.0
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Thêm, sửa và thiết lập huy hiệu nổi bật (HOT, TOP 1, VIP) cho danh mục hiển thị trên toàn hệ thống.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-5 py-2.5 bg-neon-red hover:bg-neon-red-hover text-white text-xs font-bold rounded-xl shadow-neon-red flex items-center gap-2 hover:scale-105 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Danh Mục Mới</span>
        </button>
      </div>

      {/* 2. STATS SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-[#0D0D14] border border-white/10 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 font-medium">Tổng danh mục dịch vụ</div>
            <div className="text-2xl font-black text-white mt-1">{categoriesList.length} Danh mục</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-neon-red/20 border border-neon-red/30 flex items-center justify-center text-neon-red">
            <Grid className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-[#0D0D14] border border-white/10 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 font-medium">Danh mục HOT / Nổi bật</div>
            <div className="text-2xl font-black text-amber-400 mt-1 font-mono">{categoriesList.filter((c) => c.isHot).length} Danh mục</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-[#0D0D14] border border-white/10 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 font-medium">Tổng dịch vụ khả dụng</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{categoriesList.reduce((acc, c) => acc + (c.count || 0), 0)} Dịch vụ</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. MODAL FORM CẤU HÌNH DANH MỤC */}
      {(editingCategory || isCreating) && (
        <div className="bg-[#0C0C14] border-2 border-neon-red/50 rounded-3xl p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 relative">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-neon-red/20 text-neon-red flex items-center justify-center font-bold text-lg">
                {formData.icon || '🚀'}
              </span>
              <h2 className="text-base font-black text-white">
                {editingCategory ? `Chỉnh sửa danh mục: ${editingCategory.name}` : 'Tạo danh mục dịch vụ mới'}
              </h2>
            </div>

            <button
              onClick={() => {
                setEditingCategory(null);
                setIsCreating(false);
              }}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold">Tên danh mục *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    name: e.target.value,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-')
                  })}
                  placeholder="VD: Facebook, TikTok, AI Tools"
                  className="w-full px-3.5 py-2.5 bg-[#05050A] border border-white/15 rounded-xl text-white outline-none focus:border-neon-red font-medium text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold">Slug URL (Đường dẫn) *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="facebook"
                  className="w-full px-3.5 py-2.5 bg-[#05050A] border border-neon-red/40 rounded-xl text-neon-red font-mono font-bold outline-none text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold">Biểu tượng Emoji Icon</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="🚀, 🤖, ⚙️, 🎓"
                  className="w-full px-3.5 py-2.5 bg-[#05050A] border border-white/15 rounded-xl text-white text-center text-lg outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold">Huy hiệu Badge (nếu có)</label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="HOT, TOP 1, VIP"
                  className="w-full px-3.5 py-2 bg-[#05050A] border border-white/15 rounded-xl text-gold-400 font-bold font-mono outline-none uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold">Số lượng dịch vụ con</label>
                <input
                  type="number"
                  value={formData.count}
                  onChange={(e) => setFormData({ ...formData, count: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 bg-[#05050A] border border-white/15 rounded-xl text-white font-mono outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold">Hiển thị nổi bật</label>
                <label className="flex items-center gap-2 p-2.5 bg-[#05050A] border border-white/15 rounded-xl text-white font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isHot}
                    onChange={(e) => setFormData({ ...formData, isHot: e.target.checked })}
                    className="w-4 h-4 accent-neon-red rounded"
                  />
                  <span className="text-amber-400 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-amber-400" />
                    Bật huy hiệu Nổi Bật (HOT)
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 font-bold">Mô tả chi tiết danh mục</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả các dịch vụ thuộc danh mục này..."
                className="w-full px-3.5 py-2.5 bg-[#05050A] border border-white/15 rounded-xl text-white outline-none focus:border-neon-red"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setEditingCategory(null);
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
                <span>{editingCategory ? 'Lưu cập nhật' : 'Tạo danh mục mới'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. SEARCH BAR */}
      <div className="flex justify-end">
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên danh mục..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A10] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-neon-red"
          />
        </div>
      </div>

      {/* 5. TABLE OF CATEGORIES */}
      <div className="bg-[#0A0A10] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E0E16] border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6 text-center min-w-[120px]">Thao tác</th>
                <th className="p-4 min-w-[220px]">Danh mục</th>
                <th className="p-4 text-center min-w-[120px]">Slug URL</th>
                <th className="p-4 min-w-[280px]">Mô tả danh mục</th>
                <th className="p-4 text-center min-w-[110px]">Huy hiệu</th>
                <th className="p-4 pr-6 text-center min-w-[110px]">Số dịch vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300 font-medium">
              {filteredCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-white/[0.04] transition-colors group">
                  
                  {/* THAO TÁC CỘT ĐẦU TIÊN (NO SCROLL NEEDED) */}
                  <td className="p-4 pl-6 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30 text-blue-300 hover:text-white text-[11px] font-bold transition-all hover:scale-105 flex items-center gap-1"
                        title="Chỉnh sửa danh mục"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Sửa</span>
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all hover:scale-110"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  <td className="p-4 cursor-pointer" onClick={() => handleEdit(cat)}>
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                        {cat.icon || '🚀'}
                      </span>
                      <div>
                        <div className="font-bold text-white text-sm group-hover:text-neon-red transition-colors flex items-center gap-1.5">
                          <span>{cat.name}</span>
                          {cat.isHot && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">HOT</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-center font-mono whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-lg bg-white/5 text-gray-300 text-[11px] font-bold border border-white/10 inline-block">
                      /{cat.slug}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </div>
                  </td>

                  <td className="p-4 text-center whitespace-nowrap">
                    {cat.badge ? (
                      <span className="px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-400 text-[10px] font-bold border border-gold-500/30">
                        {cat.badge}
                      </span>
                    ) : (
                      <span className="text-gray-600 font-italic text-[10px]">—</span>
                    )}
                  </td>

                  <td className="p-4 pr-6 text-center font-mono font-bold text-emerald-400 whitespace-nowrap">
                    {cat.count || 0} Dịch vụ
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
