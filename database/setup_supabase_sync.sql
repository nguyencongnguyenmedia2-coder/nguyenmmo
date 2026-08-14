-- ====================================================================
-- NGUYÊN MMO - SUPABASE CLOUD DATABASE SETUP & SYNC FIX
-- Chạy toàn bộ file này trong Supabase Dashboard -> SQL Editor
-- Link Supabase Dashboard: https://supabase.com/dashboard/project/pneetlrdafgdsfnwgmwu/sql/new
-- ====================================================================

-- 1. BẢNG KHÁCH HÀNG (PROFILES / USERS)
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    vip_tier TEXT DEFAULT 'free',
    balance NUMERIC(15, 2) DEFAULT 0.00,
    total_orders INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. BẢNG YÊU CẦU DỊCH VỤ & ĐƠN HÀNG (SERVICE_REQUESTS)
CREATE TABLE IF NOT EXISTS public.service_requests (
    id TEXT PRIMARY KEY,
    request_code TEXT UNIQUE NOT NULL,
    user_id TEXT,
    guest_name TEXT NOT NULL,
    guest_phone TEXT NOT NULL,
    guest_email TEXT,
    telegram_username TEXT,
    facebook_username TEXT,
    service_id TEXT NOT NULL,
    service_name_snapshot TEXT NOT NULL,
    category_snapshot TEXT NOT NULL,
    service_type_snapshot TEXT DEFAULT 'social_media',
    platform TEXT,
    target_url TEXT,
    quantity INT NOT NULL,
    speed TEXT DEFAULT '⚡ Nhanh',
    unit_price NUMERIC(15, 2) NOT NULL,
    estimated_price NUMERIC(15, 2) NOT NULL,
    customer_note TEXT,
    service_inputs JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'NEW',
    assigned_admin TEXT,
    admin_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. BẢNG DỊCH VỤ MMO (SERVICES)
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    price NUMERIC(15, 2) NOT NULL,
    sale_price NUMERIC(15, 2),
    vip_price NUMERIC(15, 2),
    min_quantity INT DEFAULT 1,
    max_quantity INT DEFAULT 1000000,
    eta TEXT DEFAULT '⚡ 5–30 phút',
    rating NUMERIC(3, 2) DEFAULT 5.0,
    sold_count INT DEFAULT 0,
    in_stock BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TẮT RLS HOẶC MỞ QUYỀN TRUY CẬP ĐỂ ĐỒNG BỘ 100% GIỮA LOCALHOST VÀ VERCEL
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
