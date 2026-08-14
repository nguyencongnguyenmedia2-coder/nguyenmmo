import { NextResponse } from 'next/server';
import { isR2Configured, uploadToR2 } from '@/lib/r2';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy tệp hình ảnh để tải lên!' }, { status: 400 });
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Định dạng tệp không hỗ trợ! Vui lòng chọn tệp hình ảnh (JPG, PNG, WEBP, GIF, SVG).' },
        { status: 400 }
      );
    }

    // Max 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Dung lượng hình ảnh quá lớn! Tối đa 10MB.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // If Cloudflare R2 is configured, upload directly to R2 bucket!
    if (isR2Configured()) {
      const publicImageUrl = await uploadToR2(buffer, file.name, file.type);
      return NextResponse.json({
        success: true,
        url: publicImageUrl,
        storage: 'cloudflare_r2',
        message: 'Tải ảnh lên Cloudflare R2 Storage thành công!',
      });
    }

    // Fallback if R2 credentials are not set in .env.local yet: convert to base64 Data URL or mock CDN
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;
    return NextResponse.json({
      success: true,
      url: base64Image,
      storage: 'local_base64',
      message: 'Hình ảnh đã xử lý thành công! (Lưu ý: Để lưu trên Cloudflare R2 R2 Object Storage thực tế, vui lòng cấu hình biến môi trường trong file .env.local)',
    });
  } catch (error: any) {
    console.error('Lỗi khi tải ảnh lên Cloudflare R2:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi server khi tải tệp lên Cloudflare R2' },
      { status: 500 }
    );
  }
}
