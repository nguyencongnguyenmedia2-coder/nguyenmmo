import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { MOCK_SERVICES } from '@/data/mockServices';
import { getAuthUser } from '@/lib/server-auth';

// GET: Fetch all services live from Supabase or fallback to full MOCK_SERVICES
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('id', { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      const mapped = data.map((s: any) => ({
        id: s.id,
        slug: s.slug || s.id,
        name: s.name,
        category: s.category || s.category_slug || 'facebook',
        subCategory: s.sub_category || s.subCategory || 'Dịch vụ chính',
        description: s.description || '',
        price: Number(s.price) || 0,
        salePrice: s.sale_price ? Number(s.sale_price) : undefined,
        vipPrice: s.vip_price ? Number(s.vip_price) : undefined,
        min: s.min_quantity || s.min || 1,
        max: s.max_quantity || s.max || 100000,
        eta: s.eta || '⚡ Nhanh',
        rating: Number(s.rating) || 5.0,
        reviewCount: Number(s.review_count) || 1,
        sold: Number(s.sold) || 0,
        inStock: s.in_stock !== false,
        warranty: s.warranty || 'Bảo hành 30 ngày',
        icon: s.icon || '🚀',
        providerId: s.provider_id || '',
        providerServiceId: s.provider_service_id || '',
        features: s.features || [],
      }));

      return NextResponse.json({ success: true, data: mapped });
    }

    return NextResponse.json({ success: true, data: MOCK_SERVICES });
  } catch (err: any) {
    return NextResponse.json({ success: true, data: MOCK_SERVICES });
  }
}

// POST: Insert a new service into Supabase (Admin Only)
export async function POST(request: Request) {
  try {
    const auth = await getAuthUser(request);
    if (!auth || !auth.isAdmin) {
      return NextResponse.json(
        { success: false, error: '403 Forbidden: Chỉ Admin mới có quyền tạo/sửa dịch vụ' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      id,
      slug,
      name,
      category,
      subCategory,
      description,
      price,
      salePrice,
      vipPrice,
      min,
      max,
      eta,
      warranty,
      icon,
      inStock,
      providerId,
      providerServiceId,
    } = body;

    const row = {
      id: id || `srv-${Date.now()}`,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name,
      category,
      sub_category: subCategory || 'Dịch vụ chính',
      description: description || '',
      price: Number(price) || 0,
      sale_price: salePrice ? Number(salePrice) : null,
      vip_price: vipPrice ? Number(vipPrice) : null,
      min_quantity: Number(min) || 1,
      max_quantity: Number(max) || 100000,
      eta: eta || '⚡ Nhanh',
      warranty: warranty || 'Bảo hành 30 ngày',
      icon: icon || '🚀',
      in_stock: inStock !== false,
      provider_id: providerId || '',
      provider_service_id: providerServiceId || '',
    };

    const { data, error } = await supabase.from('services').upsert([row]).select();

    if (error) {
      console.error('Supabase upsert service error:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: data[0] });
  } catch (err: any) {
    console.error('API /api/services POST error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE: Remove a service from Supabase (Admin Only)
export async function DELETE(request: Request) {
  try {
    const auth = await getAuthUser(request);
    if (!auth || !auth.isAdmin) {
      return NextResponse.json(
        { success: false, error: '403 Forbidden: Chỉ Admin mới có quyền xóa dịch vụ' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing service id' }, { status: 400 });
    }

    const { error } = await supabase.from('services').delete().eq('id', id);

    if (error) {
      console.error('Supabase delete service error:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('API /api/services DELETE error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
