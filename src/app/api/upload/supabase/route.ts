import { NextResponse } from 'next/server';
import { uploadImageToSupabase } from '@/lib/supabase-storage';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy tệp hình ảnh để tải lên!' }, { status: 400 });
    }

    // Allowed image mime types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Định dạng tệp không hỗ trợ! Vui lòng chọn tệp hình ảnh (JPG, PNG, WEBP, GIF, SVG).' },
        { status: 400 }
      );
    }

    // 10MB file limit
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Dung lượng hình ảnh quá lớn! Tối đa 10MB.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload directly to Supabase Storage
    const result = await uploadImageToSupabase(buffer, file.name, file.type);

    return NextResponse.json({
      success: true,
      url: result.url,
      storage: result.storage,
      message: result.storage === 'supabase_storage'
        ? 'Tải ảnh lên Supabase Storage thành công!'
        : 'Đã lưu và tải hình ảnh thành công!',
    });
  } catch (error: any) {
    console.error('Lỗi khi tải ảnh lên Supabase Storage:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi server khi tải tệp hình ảnh!' },
      { status: 500 }
    );
  }
}
