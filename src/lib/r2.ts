import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'nguyenmmo-blog-images';
const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL || '';

export const isR2Configured = (): boolean => {
  return !!(accountId && accessKeyId && secretAccessKey && bucketName);
};

export const getR2Client = (): S3Client => {
  if (!isR2Configured()) {
    throw new Error('Cloudflare R2 Storage is not configured in .env.local variables.');
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: accessKeyId!,
      secretAccessKey: secretAccessKey!,
    },
  });
};

export const uploadToR2 = async (
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> => {
  const r2 = getR2Client();
  const cleanFileName = fileName.toLowerCase().replace(/[^a-z0-9.-]/g, '_');
  const key = `blogs/${Date.now()}-${cleanFileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await r2.send(command);

  if (publicUrl) {
    return `${publicUrl.replace(/\/$/, '')}/${key}`;
  }

  return `https://${bucketName}.${accountId}.r2.cloudflarestorage.com/${key}`;
};
