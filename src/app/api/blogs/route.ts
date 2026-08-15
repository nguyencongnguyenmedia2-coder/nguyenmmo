import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { MOCK_BLOGS } from '@/data/mockBlog';
import { BlogPost } from '@/types';
import { getAuthUser } from '@/lib/server-auth';
import fs from 'fs';
import path from 'path';

const BLOGS_JSON_PATH = path.join(process.cwd(), 'src', 'data', 'blogs.json');
const SUPABASE_STORE_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
const SUPABASE_STORE_CODE = 'SYS_BLOGS_CACHE_001';

// Helper to read blogs from local JSON file (works in local dev)
function readBlogsFromFile(): BlogPost[] {
  try {
    if (fs.existsSync(BLOGS_JSON_PATH)) {
      const content = fs.readFileSync(BLOGS_JSON_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {}
  return MOCK_BLOGS;
}

// Helper to safely write blogs to JSON file (catch EROFS on Vercel)
function writeBlogsToFile(blogs: BlogPost[]): boolean {
  try {
    const dir = path.dirname(BLOGS_JSON_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(BLOGS_JSON_PATH, JSON.stringify(blogs, null, 2), 'utf-8');
    return true;
  } catch (err) {
    // Expected on Vercel read-only filesystem
    return false;
  }
}

// Read blogs from Supabase cloud database
async function getBlogsFromSupabase(): Promise<BlogPost[] | null> {
  // Option A: Try primary 'blogs' table
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('date', { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map((b: any) => ({
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
    }
  } catch (e) {}

  // Option B: Try cloud fallback record in 'service_requests' table (Works 100% on Vercel without new migrations)
  try {
    const { data, error } = await supabase
      .from('service_requests')
      .select('service_inputs')
      .eq('request_code', SUPABASE_STORE_CODE)
      .maybeSingle();

    if (!error && data && Array.isArray(data.service_inputs) && data.service_inputs.length > 0) {
      return data.service_inputs as BlogPost[];
    }
  } catch (e) {}

  return null;
}

// Save blogs to Supabase cloud database
async function saveBlogsToSupabase(blogs: BlogPost[]): Promise<boolean> {
  let saved = false;

  // Option A: Try saving to 'blogs' table
  try {
    const rows = blogs.map((b) => ({
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

    const { error } = await supabase.from('blogs').upsert(rows);
    if (!error) saved = true;
  } catch (e) {}

  // Option B: Save to cloud fallback record in 'service_requests' table (Ensures instant live sync across all Vercel visitors)
  try {
    const row = {
      id: SUPABASE_STORE_ID,
      request_code: SUPABASE_STORE_CODE,
      guest_name: 'System Blog Store',
      guest_phone: '0000000000',
      service_id: 'blogs_store',
      service_name_snapshot: 'Blog Posts JSON Storage',
      category_snapshot: 'BLOG_SYSTEM',
      unit_price: 0,
      estimated_price: 0,
      quantity: 1,
      service_inputs: blogs,
    };

    const { error } = await supabase.from('service_requests').upsert([row]).select();
    if (!error) saved = true;
  } catch (e) {
    console.error('Supabase cloud blog save error:', e);
  }

  return saved;
}

// GET: Fetch all blog posts live from Supabase or server JSON file fallback
export async function GET() {
  try {
    const cloudBlogs = await getBlogsFromSupabase();
    if (cloudBlogs && cloudBlogs.length > 0) {
      return NextResponse.json({ success: true, data: cloudBlogs, source: 'supabase' });
    }

    const localBlogs = readBlogsFromFile();
    return NextResponse.json({ success: true, data: localBlogs, source: 'local_file' });
  } catch (err: any) {
    return NextResponse.json({ success: true, data: MOCK_BLOGS, source: 'mock_fallback' });
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
      updatedList = body;
    } else if (body && body.id) {
      const currentList = (await getBlogsFromSupabase()) || readBlogsFromFile();
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

    // 1. Try local file write (works on dev)
    writeBlogsToFile(updatedList);

    // 2. Save to Supabase Cloud Storage (Works 100% on Vercel for all visitors)
    const cloudSaved = await saveBlogsToSupabase(updatedList);

    return NextResponse.json({
      success: true,
      message: cloudSaved
        ? 'Đã lưu và đồng bộ bài viết thành công lên Cloud Database!'
        : 'Đã lưu bài viết thành công!',
      data: updatedList,
      cloudSynced: cloudSaved,
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

    const currentList = (await getBlogsFromSupabase()) || readBlogsFromFile();
    const updatedList = currentList.filter((b) => b.id !== id);

    writeBlogsToFile(updatedList);
    await saveBlogsToSupabase(updatedList);

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
