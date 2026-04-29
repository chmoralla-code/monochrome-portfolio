import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';

// GET /api/admin/profile - Get profile data
export async function GET(request: Request) {
  const { authenticated, error } = requireAuth(request);
  if (!authenticated) return error;

  try {
    const supabase = createServerClient();
    const { data, error: dbError } = await supabase
      .from('profile')
      .select('*')
      .single();

    if (dbError) throw dbError;

    return NextResponse.json(data || {});
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// POST /api/admin/profile - Update profile
export async function POST(request: Request) {
  const { authenticated, error } = requireAuth(request);
  if (!authenticated) return error;

  try {
    const body = await request.json();
    const supabase = createServerClient();

    // Upsert profile (insert if not exists, update if exists)
    const { data, error: dbError } = await supabase
      .from('profile')
      .upsert({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}
