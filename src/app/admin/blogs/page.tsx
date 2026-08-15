'use client';

import React, { useState, useEffect } from 'react';
import { MOCK_BLOGS } from '@/data/mockBlog';
import { BlogPost } from '@/types';
import { useToast } from '@/context/ToastContext';
import { 
  BookOpen, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Eye, 
  Sparkles, 
  Search, 
  Star,
  FileText,
  User,
  Clock,
  ExternalLink,
  Upload,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function AdminBlogsPage() {
  const { showToast } = useToast();
  const [blogsList, setBlogsList] = useState<BlogPost[]>([]);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');
  const [isUploadingR2, setIsUploadingR2] = useState(false);

  const handleUploadImageToR2 = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingR2(true);
    showToast('Đang tải ảnh lên Cloudflare R2 Storage...', 'info');

    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/upload/r2', {
        method: 'POST',
        body: data,
      });
      const json = await res.json();

      if (json.success && json.url) {
        setFormData((prev) => ({ ...prev, thumbnail: json.url }));
        showToast(json.message || 'Đã tải ảnh lên Cloudflare R2 Storage thành công!', 'success');
      } else {
        showToast(json.error || 'Tải ảnh thất bại!', 'error');
      }
    } catch (err: any) {
      showToast('Lỗi kết nối khi tải ảnh lên Cloudflare R2!', 'error');
    } finally {
      setIsUploadingR2(false);
    }
  };

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    category: string;
    summary: string;
    content: string;
    author: string;
    readTime: string;
    thumbnail: string;
    published: boolean;
    featured: boolean;
  }>({
    title: '',
    slug: '',
    category: 'Thủ thuật Facebook',
    summary: '',
    content: '',
    author: 'Nguyên MMO',
    readTime: '5 phút đọc',
    thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80',
    published: true,
    featured: false,
  });

  // Load from Server API with localStorage cache fallback
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blogs');
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setBlogsList(json.data);
          try {
            localStorage.setItem('nguyenmmo_blogs', JSON.stringify(json.data));
          } catch (e) {}
          return;
        }
      } catch (e) {}

      // Fallback to localStorage or mockBlog
      try {
        const cached = localStorage.getItem('nguyenmmo_blogs');
        if (cached) {
          setBlogsList(JSON.parse(cached));
        } else {
          setBlogsList(MOCK_BLOGS.map((b) => ({ ...b, published: true, featured: true })));
        }
      } catch (e) {
        setBlogsList(MOCK_BLOGS.map((b) => ({ ...b, published: true, featured: true })));
      }
    };

    fetchBlogs();
  }, []);

  const syncBlogsToServer = async (newList: BlogPost[]) => {
    try {
      setBlogsList(newList);
      try {
        localStorage.setItem('nguyenmmo_blogs', JSON.stringify(newList));
      } catch (err) {}

      await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newList),
      });
    } catch (err) {
      console.error('Lỗi đồng bộ bài viết lên Server:', err);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Thủ thuật Facebook',
      summary: '',
      content: '',
      author: 'Nguyên MMO',
      readTime: '5 phút đọc',
      thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80',
      published: true,
      featured: false,
    });
    setIsCreating(true);
  };

  const handleOpenEditModal = (blog: BlogPost) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      category: blog.category,
      summary: blog.summary,
      content: blog.content || '',
      author: blog.author || 'Nguyên MMO',
      readTime: blog.readTime || '5 phút đọc',
      thumbnail: blog.thumbnail || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80',
      published: blog.published !== undefined ? blog.published : true,
      featured: blog.featured !== undefined ? blog.featured : false,
    });
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Vui lòng nhập tên tiêu đề bài viết!', 'error');
      return;
    }

    const slug = formData.slug.trim()
      ? formData.slug.toLowerCase().replace(/[^a-z0-9]/g, '-')
      : formData.title.toLowerCase().replace(/[^a-z0-9]/g, '-');

    let updatedList: BlogPost[] = [];

    if (editingBlog) {
      updatedList = blogsList.map((b) =>
        b.id === editingBlog.id
          ? {
              ...b,
              title: formData.title,
              slug,
              category: formData.category,
              summary: formData.summary,
              content: formData.content,
              author: formData.author,
              readTime: formData.readTime,
              thumbnail: formData.thumbnail,
              published: formData.published,
              featured: formData.featured,
            }
          : b
      );
      showToast(`Đã cập nhật bài viết "${formData.title}" thành công!`, 'success');
    } else {
      const newPost: BlogPost = {
        id: `blog-${Date.now()}`,
        title: formData.title,
        slug,
        category: formData.category,
        summary: formData.summary,
        content: formData.content || formData.summary,
        author: formData.author,
        date: new Date().toLocaleDateString('vi-VN'),
        readTime: formData.readTime,
        views: 1,
        thumbnail: formData.thumbnail,
        published: formData.published,
        featured: formData.featured,
      };
      updatedList = [newPost, ...blogsList];
      showToast(`Đã tạo mới bài viết "${formData.title}" thành công!`, 'success');
    }

    await syncBlogsToServer(updatedList);

    setEditingBlog(null);
    setIsCreating(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa bài viết "${title}"?`)) {
      const updatedList = blogsList.filter((b) => b.id !== id);
      await syncBlogsToServer(updatedList);
      showToast(`Đã xóa bài viết "${title}"!`, 'info');
    }
  };

  const handleTogglePublished = async (id: string) => {
    const updatedList = blogsList.map((b) =>
      b.id === id ? { ...b, published: !b.published } : b
    );
    await syncBlogsToServer(updatedList);
    showToast('Đã thay đổi trạng thái xuất bản!', 'success');
  };

  const filteredBlogs = blogsList.filter((b) => {
    const matchesTab = selectedCategoryTab === 'all' || b.category === selectedCategoryTab;
    const matchesSearch =
      searchQuery === '' ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* 1. HEADER TITLE BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-neon-red" />
              <span>QUẢN LÝ BÀI VIẾT BLOG & KHÓA HỌC</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-neon-red/20 border border-neon-red/40 text-neon-red text-xs font-mono font-bold">
              {blogsList.length} Bài Viết
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Đăng bài viết mới, chia sẻ thủ thuật MMO, kiến thức AI và đồng bộ tự động với trang chủ & trang tin tức.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-3 bg-neon-red hover:bg-neon-red-hover text-white text-xs font-black rounded-2xl btn-beam-touch hover:scale-105 transition-all flex items-center gap-2 shadow-neon-red shrink-0 overflow-hidden"
        >
          <Plus className="w-4 h-4" />
          <span>⚡ VIẾT BÀI MỚI</span>
        </button>
      </div>

      {/* 2. SEARCH & CATEGORY FILTER TABS */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#0D0D14] p-4 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto custom-scrollbar">
          {['all', 'Thủ thuật Facebook', 'AI Automation', 'MMO Thực chiến', 'Khóa học', 'Mẹo TikTok'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryTab(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategoryTab === cat
                  ? 'bg-neon-red text-white shadow-neon-red'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat === 'all' ? 'Tất cả bài viết' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tiêu đề bài viết..."
            className="w-full pl-9 pr-4 py-2 bg-[#050508] border border-white/15 rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-neon-red"
          />
        </div>
      </div>

      {/* 3. BLOG ARTICLES DATA TABLE */}
      <div className="bg-[#0D0D14] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[11px] font-bold uppercase tracking-wider text-gray-300">
                <th className="p-4 text-neon-red font-black whitespace-nowrap text-center">⚡ THAO TÁC</th>
                <th className="p-4 whitespace-nowrap">BÀI VIẾT & HÌNH ẢNH</th>
                <th className="p-4 whitespace-nowrap">CHUYÊN MỤC</th>
                <th className="p-4 whitespace-nowrap">TÁC GIẢ & NGÀY</th>
                <th className="p-4 whitespace-nowrap text-center">NỔI BẬT</th>
                <th className="p-4 whitespace-nowrap text-center">TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-gray-300">
              {filteredBlogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-white/5 transition-colors group">
                  {/* COL 1: THAO TÁC ON FAR-LEFT */}
                  <td className="p-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(blog)}
                        className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30 text-blue-300 hover:text-white rounded-xl font-bold transition-all text-xs flex items-center gap-1"
                        title="Chỉnh sửa bài viết"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Sửa</span>
                      </button>

                      <Link
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        className="p-1.5 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-xl transition-all"
                        title="Xem bài viết ngoài website"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => handleDelete(blog.id, blog.title)}
                        className="p-1.5 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white rounded-xl transition-all"
                        title="Xóa bài viết"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* COL 2: ARTICLE TITLE & THUMBNAIL */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={blog.thumbnail}
                        alt={blog.title}
                        className="w-14 h-10 rounded-xl object-cover border border-white/10 shrink-0"
                      />
                      <div className="space-y-0.5 max-w-md">
                        <div 
                          onClick={() => handleOpenEditModal(blog)}
                          className="font-bold text-white group-hover:text-neon-red transition-colors line-clamp-1 cursor-pointer"
                        >
                          {blog.title}
                        </div>
                        <div className="text-[11px] text-gray-400 line-clamp-1">
                          {blog.summary}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* COL 3: CATEGORY */}
                  <td className="p-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-200 font-bold text-[10px]">
                      {blog.category}
                    </span>
                  </td>

                  {/* COL 4: AUTHOR & DATE */}
                  <td className="p-4 whitespace-nowrap font-mono text-[11px]">
                    <div className="text-white font-bold">{blog.author || 'Nguyên MMO'}</div>
                    <div className="text-gray-400">{blog.date} • {blog.readTime}</div>
                  </td>

                  {/* COL 5: FEATURED */}
                  <td className="p-4 text-center whitespace-nowrap">
                    {blog.featured ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold inline-flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400" /> Nổi Bật Trang Chủ
                      </span>
                    ) : (
                      <span className="text-gray-500 text-[11px]">Bình thường</span>
                    )}
                  </td>

                  {/* COL 6: PUBLISHED STATUS */}
                  <td className="p-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => handleTogglePublished(blog.id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                        blog.published !== false
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-red-500/20 text-red-400 border border-red-500/40'
                      }`}
                    >
                      {blog.published !== false ? '🟢 Xuất bản' : '🔴 Bản nháp'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. EDITOR MODAL POPUP */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-3xl bg-[#0D0D15] border-2 border-neon-red/50 rounded-3xl p-6 shadow-2xl space-y-6 text-white max-h-[90vh] overflow-y-auto custom-scrollbar relative">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-neon-red" />
                  <span>{editingBlog ? 'CHỈNH SỬA BÀI VIẾT BLOG' : 'TẠO MỚI BÀI VIẾT BLOG'}</span>
                </h2>
                <div className="text-xs text-gray-400 mt-0.5">
                  Bài viết sẽ xuất hiện trên trang tin tức & mục Blog trang chủ.
                </div>
              </div>

              <button
                onClick={() => setIsCreating(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-300 font-bold">Tiêu đề bài viết: *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="VD: Hướng dẫn tăng 10k Follow TikTok thực chiến 2026..."
                  className="w-full px-3.5 py-2.5 bg-[#05050A] border border-white/15 rounded-xl text-white outline-none focus:border-neon-red font-bold text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-bold">Chuyên mục:</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#05050A] border border-white/15 rounded-xl text-white outline-none focus:border-neon-red"
                  >
                    <option value="Thủ thuật Facebook">Thủ thuật Facebook</option>
                    <option value="AI Automation">AI Automation</option>
                    <option value="MMO Thực chiến">MMO Thực chiến</option>
                    <option value="Khóa học">Khóa học MMO</option>
                    <option value="Mẹo TikTok">Mẹo TikTok</option>
                    <option value="Giải pháp Digital">Giải pháp Digital</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-bold">Slug đường dẫn:</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="Tu dong tao neu de trong..."
                    className="w-full px-3.5 py-2.5 bg-[#05050A] border border-white/15 rounded-xl text-sky-300 font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-bold">Tác giả bài viết:</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Nguyên MMO"
                    className="w-full px-3.5 py-2.5 bg-[#05050A] border border-white/15 rounded-xl text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-bold">Thời gian đọc:</label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="5 phút đọc"
                    className="w-full px-3.5 py-2.5 bg-[#05050A] border border-white/15 rounded-xl text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2 p-3 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex items-center justify-between">
                  <label className="text-gray-300 font-bold">Ảnh đại diện bài viết (Thumbnail Image):</label>
                  <label className="cursor-pointer px-3 py-1 bg-neon-red/20 hover:bg-neon-red/30 border border-neon-red/40 text-neon-red rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all">
                    {isUploadingR2 ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>{isUploadingR2 ? 'Đang tải lên...' : '☁️ Tải ảnh lên Cloudflare R2'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingR2}
                      onChange={handleUploadImageToR2}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="https://... hoặc bấm nút trên để tải ảnh từ máy tính lên Cloudflare R2"
                  className="w-full px-3.5 py-2.5 bg-[#05050A] border border-white/15 rounded-xl text-sky-300 font-mono outline-none"
                />
                {formData.thumbnail && (
                  <div className="pt-1 flex items-center gap-3">
                    <img
                      src={formData.thumbnail}
                      alt="Thumbnail Preview"
                      className="w-24 h-14 rounded-xl object-cover border border-white/15 shadow-md"
                    />
                    <div className="text-[11px] text-gray-400 font-mono space-y-0.5">
                      <div className="text-emerald-400 font-bold">✓ Xem trước ảnh đại diện thành công</div>
                      <div className="truncate max-w-sm text-gray-500">{formData.thumbnail}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-bold">Mô tả tóm tắt (Summary 2-3 câu):</label>
                <textarea
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Tóm tắt ngắn gọn nội dung cốt lõi của bài viết..."
                  className="w-full px-3.5 py-2.5 bg-[#05050A] border border-white/15 rounded-xl text-white outline-none focus:border-neon-red"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-bold">Nội dung chi tiết bài viết (Full Content / Markdown / HTML):</label>
                <textarea
                  rows={8}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Nhập nội dung bài viết chi tiết, hướng dẫn các bước..."
                  className="w-full px-3.5 py-2.5 bg-[#05050A] border border-white/15 rounded-xl text-white font-sans outline-none focus:border-neon-red leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-200">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 accent-neon-red rounded"
                  />
                  <span>🟢 Xuất bản bài viết công khai</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-300">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span>⭐ Đưa lên mục Nổi Bật Trang Chủ</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-gray-300 font-bold rounded-xl"
                >
                  Hủy bỏ
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-neon-red hover:bg-neon-red-hover text-white font-bold rounded-xl btn-beam-touch flex items-center gap-2 overflow-hidden"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingBlog ? 'Cập Nhật Bài Viết' : 'Lưu & Xuất Bản Bài Viết'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
