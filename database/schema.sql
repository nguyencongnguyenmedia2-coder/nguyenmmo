-- ====================================================================
-- DIGITAL MMO - Supabase PostgreSQL Database Schema (24 Tables)
-- High-Performance Cyber Dark SMM & Digital E-Commerce Architecture
-- ====================================================================

-- 1. USERS PROFILE & WALLET TABLES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    vip_tier TEXT DEFAULT 'free' CHECK (vip_tier IN ('free', 'basic', 'pro', 'business')),
    referral_code TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    balance NUMERIC(15, 2) DEFAULT 0.00 NOT NULL CHECK (balance >= 0),
    total_deposited NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
    total_spent NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    transaction_code TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('deposit', 'purchase', 'refund', 'bonus')),
    amount NUMERIC(15, 2) NOT NULL,
    balance_before NUMERIC(15, 2) NOT NULL,
    balance_after NUMERIC(15, 2) NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'success' CHECK (status IN ('pending', 'success', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CATEGORIES & SERVICES TABLES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    description TEXT,
    badge TEXT,
    is_hot BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
    sub_category TEXT,
    description TEXT,
    price NUMERIC(15, 2) NOT NULL,
    sale_price NUMERIC(15, 2),
    vip_price NUMERIC(15, 2) NOT NULL,
    min_quantity INT DEFAULT 1 NOT NULL,
    max_quantity INT DEFAULT 1000000 NOT NULL,
    eta TEXT DEFAULT '⚡ 5–30 phút',
    rating NUMERIC(3, 2) DEFAULT 5.0,
    sold_count INT DEFAULT 0,
    in_stock BOOLEAN DEFAULT true,
    warranty TEXT DEFAULT 'Bảo hành 30 ngày',
    provider_id UUID,
    provider_service_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ORDERS & TRANSACTIONS TABLES
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_code TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    service_name TEXT NOT NULL,
    target_link TEXT NOT NULL,
    quantity INT NOT NULL,
    total_amount NUMERIC(15, 2) NOT NULL,
    discount_amount NUMERIC(15, 2) DEFAULT 0.00,
    final_amount NUMERIC(15, 2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('bank_transfer', 'e_wallet', 'qr_code', 'wallet_balance')),
    payment_status TEXT DEFAULT 'paid' CHECK (payment_status IN ('paid', 'unpaid')),
    order_status TEXT DEFAULT 'processing' CHECK (order_status IN ('pending', 'processing', 'completed', 'canceled', 'partial')),
    start_count INT DEFAULT 0,
    remains INT DEFAULT 0,
    api_order_id TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. VIP PLANS & COUPONS TABLES
CREATE TABLE IF NOT EXISTS public.vip_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    price_monthly NUMERIC(15, 2) NOT NULL,
    discount_rate NUMERIC(3, 2) NOT NULL,
    benefits JSONB NOT NULL,
    is_popular BOOLEAN DEFAULT false,
    badge TEXT
);

CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_value NUMERIC(15, 2) NOT NULL,
    discount_type TEXT DEFAULT 'fixed' CHECK (discount_type IN ('fixed', 'percent')),
    min_order_value NUMERIC(15, 2) DEFAULT 0.00,
    max_usages INT DEFAULT 100,
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. API PROVIDERS TABLE (SMM PANEL 3RD PARTY INTEGRATION)
CREATE TABLE IF NOT EXISTS public.api_providers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    api_url TEXT NOT NULL,
    api_key TEXT NOT NULL,
    balance NUMERIC(15, 2) DEFAULT 0.00,
    currency TEXT DEFAULT 'VND',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) Policies Configuration
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own wallet" ON public.wallets FOR SELECT USING (auth.uid() = user_id);

-- 6. SERVICE REQUESTS TABLE (LEAD GENERATION SYSTEM)
CREATE TABLE IF NOT EXISTS public.service_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    request_code TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
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
    status TEXT DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTING', 'CONFIRMED', 'PROCESSING', 'WAITING_CUSTOMER', 'COMPLETED', 'CANCELED', 'REJECTED')),
    assigned_admin TEXT,
    admin_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

