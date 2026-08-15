import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { MOCK_BLOGS } from '@/data/mockBlog';
import { BlogPost } from '@/types';
import { getAuthUser } from '@/lib/server-auth';
import fs from 'fs';
import path from 'path';

const BLOGS_JSON_PATH = path.join(process.cwd(), 'src', 'data', 'blogs.json');

// Helper to read blogs from JSON file
function readBlogsFromFile(): BlogPost[] {
  try {
    if (fs.existsSync(BLOGS_JSON_PATH)) {
      const content = fs.readFileSync(BLOGS_JSON_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading blogs.json:', err);
  }
  return MOCK_BLOGS;
}

// Helper to write blogs to JSON file
function writeBlogsToFile(blogs: BlogPost[]): boolean {
  try {
    const dir = path.dirname(BLOGS_JSON_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(BLOGS_JSON_PATH, JSON.stringify(blogs, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing blogs.json:', err);
    return false;
  }
}

// GET: Fetch all blog posts live from Supabase or server JSON file fallback
export async function GET() {
  try {
    // 1. Try fetching from Supabase
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('date', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const mapped: BlogPost[] = data.map((b: any) => ({
          id: b.id,
          title: b.title,
          slug: b.slug,
          category: b.category,
          summary: b.summary,
          content: b.content,
          author: b.author || 'Nguyên MMO',
          authorAvatar: b.author_avatar || b.authorAvatar,
          authorRole: b.author_role || b.authorRole,
          date: b.date,
          readTime: b.read_time || b.readTime || '5 phút đọc',
          views: Number(b.views) || 0,
          thumbnail: b.thumbnail,
          published: b.published !== false,
          featured: b.featured === true,
          tags: Array.isArray(b.tags) ? b.tags : [],
        }));

        return NextResponse.json({ success: true, data: mapped });
      }
    } catch (e) {
      // Supabase table might not exist yet, fallback to JSON
    }

    // 2. Fallback to local server JSON file
    const blogs = readBlogsFromFile();
    return NextResponse.json({ success: true, data: blogs });
  } catch (err: any) {
    return NextResponse.json({ success: true, data: MOCK_BLOGS });
  }
}

// POST: Save or Update blog post(s) (Admin Only)
export async function POST(request: Request) {
  try {
    const auth = await getAuthUser(request);
    if (!auth || !auth.isAdmin) {
      return NextResponse.json(
        { success: false, error: '403 Forbidden: Chỉ Admin mới có quyền quản lý bài viết' },
        { status: 403 }
      );
    }

    const body = await request.json();
    let updatedList: BlogPost[] = [];

    if (Array.isArray(body)) {
      // Full list replacement
      updatedList = body;
    } else if (body && body.id) {
      // Single post update or insert
      const currentList = readBlogsFromFile();
      const index = currentList.findIndex((b) => b.id === body.id);
      if (index >= 0) {
        currentList[index] = { ...currentList[index], ...body };
      } else {
        currentList.unshift(body);
      }
      updatedList = currentList;
    } else {
      return NextResponse.json({ success: false, error: 'Dữ liệu bài viết không hợp lệ!' }, { status: 400 });
    }

    // 1. Write to local server JSON file immediately
    writeBlogsToFile(updatedList);

    // 2. Try syncing to Supabase if configured
    try {
      const rows = updatedList.map((b) => ({
        id: b.id,
        title: b.title,
        slug: b.slug,
        category: b.category,
        summary: b.summary,
        content: b.content || '',
        author: b.author || 'Nguyên MMO',
        author_avatar: b.authorAvatar || null,
        author_role: b.authorRole || null,
        date: b.date,
        read_time: b.readTime || '5 phút đọc',
        views: b.views || 0,
        thumbnail: b.thumbnail,
        published: b.published !== false,
        featured: b.featured === true,
        tags: b.tags || [],
      }));

      await supabase.from('blogs').upsert(rows);
    } catch (e) {
      // Ignore Supabase sync error if table missing
    }

    return NextResponse.json({
      success: true,
      message: 'Đã lưu và xuất bản bài viết thành công!',
      data: updatedList,
    });
  } catch (err: any) {
    console.error('API /api/blogs POST error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Lỗi lưu bài viết!' }, { status: 500 });
  }
}

// DELETE: Delete a blog post by ID (Admin Only)
export async function DELETE(request: Request) {
  try {
    const auth = await getAuthUser(request);
    if (!auth || !auth.isAdmin) {
      return NextResponse.json(
        { success: false, error: '403 Forbidden: Chỉ Admin mới có quyền xóa bài viết' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu ID bài viết cần xóa' }, { status: 400 });
    }

    const currentList = readBlogsFromFile();
    const updatedList = currentList.filter((b) => b.id !== id);

    writeBlogsToFile(updatedList);

    try {
      await supabase.from('blogs').delete().eq('id', id);
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: 'Đã xóa bài viết thành công!',
      data: updatedList,
    });
  } catch (err: any) {
    console.error('API /api/blogs DELETE error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
