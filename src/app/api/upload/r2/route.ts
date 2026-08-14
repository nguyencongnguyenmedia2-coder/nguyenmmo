import { NextResponse } from 'next/server';
import { isR2Configured, uploadToR2 } from '@/lib/r2';
import fs from 'fs';
import path from 'path';

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

    // 1. If Cloudflare R2 API Keys are configured in .env.local, upload directly to Cloudflare R2 Bucket!
    if (isR2Configured()) {
      try {
        const publicImageUrl = await uploadToR2(buffer, file.name, file.type);
        return NextResponse.json({
          success: true,
          url: publicImageUrl,
          storage: 'cloudflare_r2',
          message: 'Tải ảnh lên Cloudflare R2 Storage thành công!',
        });
      } catch (r2Error: any) {
        console.warn('Cloudflare R2 API Key chưa sẵn sàng, đang chuyển sang chế độ lưu đĩa tự động:', r2Error.message);
      }
    }

    // 2. Automated Fallback: Save to local public/uploads/blogs directory instantly!
    const cleanFileName = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, '_');
    const fileName = `img_${Date.now()}_${cleanFileName}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'blogs');

    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/blogs/${fileName}`,
        storage: 'local_disk',
        message: 'Đã tải và lưu hình ảnh thành công!',
      });
    } catch (fsError) {
      // 3. Fallback for serverless Vercel if filesystem is read-only: Return Data URI
      const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;
      return NextResponse.json({
        success: true,
        url: base64Image,
        storage: 'base64_uri',
        message: 'Đã tải hình ảnh thành công!',
      });
    }
  } catch (error: any) {
    console.error('Lỗi khi tải ảnh lên:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi server khi tải tệp hình ảnh!' },
      { status: 500 }
    );
  }
}
