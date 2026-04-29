import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: Request) {
  const { authenticated, error } = requireAuth(request);
  if (!authenticated) return error;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const bucketName = 'portfolio-images';

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${randomString}.${extension}`;

    // Upload file to Supabase Storage
    const { data, error: uploadError } = await supabase
      .storage
      .from(bucketName)
      .upload(filename, file, {
        contentType: file.type,
        cacheControl: '3600',
      });

    if (uploadError) {
      // If bucket doesn't exist, try to create it
      if (uploadError.message.includes('bucket') || uploadError.message.includes('not found')) {
        // Try to create bucket
        const { error: createBucketError } = await supabase
          .storage
          .createBucket(bucketName, {
            public: true,
            fileSizeLimit: 5242880, // 5MB
          });

        if (createBucketError) {
          throw new Error(`Failed to create storage bucket: ${createBucketError.message}`);
        }

        // Retry upload
        const { data: retryData, error: retryError } = await supabase
          .storage
          .from(bucketName)
          .upload(filename, file, {
            contentType: file.type,
            cacheControl: '3600',
          });

        if (retryError) throw retryError;

        // Get public URL
        const { data: urlData } = supabase
          .storage
          .from(bucketName)
          .getPublicUrl(retryData?.path || filename);

        return NextResponse.json({ url: urlData.publicUrl });
      }

      throw uploadError;
    }

    // Get public URL
    const { data: urlData } = supabase
      .storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}
