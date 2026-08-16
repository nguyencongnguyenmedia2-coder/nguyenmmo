import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export const BUCKET_NAME = 'blog-images';

/**
 * Upload an image buffer/file directly to Supabase Storage.
 * Includes local disk fallback if bucket is missing or unconfigured.
 */
export async function uploadImageToSupabase(
  buffer: Buffer,
  originalFilename: string,
  mimeType: string
): Promise<{ url: string; storage: 'supabase_storage' | 'local_disk' | 'base64_uri' }> {
  const cleanName = originalFilename.toLowerCase().replace(/[^a-z0-9.-]/g, '_');
  const fileName = `blogs/${Date.now()}_${cleanName}`;

  try {
    // Attempt Supabase Storage Upload
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (!error && data?.path) {
      const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);
      if (publicUrlData?.publicUrl) {
        return {
          url: publicUrlData.publicUrl,
          storage: 'supabase_storage',
        };
      }
    } else if (error) {
      console.warn('Supabase Storage Upload Notice (using disk fallback):', error.message);
    }
  } catch (e: any) {
    console.warn('Supabase Storage Exception:', e?.message || e);
  }

  // Fallback 1: Local Disk Storage
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'blogs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const localFileName = `img_${Date.now()}_${cleanName}`;
    const filePath = path.join(uploadDir, localFileName);
    fs.writeFileSync(filePath, buffer);

    return {
      url: `/uploads/blogs/${localFileName}`,
      storage: 'local_disk',
    };
  } catch (fsError) {
    // Fallback 2: Base64 Data URI for serverless read-only environments
    const base64Image = `data:${mimeType};base64,${buffer.toString('base64')}`;
    return {
      url: base64Image,
      storage: 'base64_uri',
    };
  }
}
