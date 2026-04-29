import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';

// GET /api/admin/experience - List all experience entries
export async function GET(request: Request) {
  const { authenticated, error } = requireAuth(request);
  if (!authenticated) return error;

  try {
    const supabase = createServerClient();
    const { data, error: dbError } = await supabase
      .from('experience')
      .select('*')
      .order('order', { ascending: true });

    if (dbError) throw dbError;

    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch experience' },
      { status: 500 }
    );
  }
}

// POST /api/admin/experience - Create a new experience entry
export async function POST(request: Request) {
  const { authenticated, error } = requireAuth(request);
  if (!authenticated) return error;

  try {
    const body = await request.json();
    const supabase = createServerClient();

    const { data, error: dbError } = await supabase
      .from('experience')
      .insert([body])
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to create experience' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/experience - Update an experience entry
export async function PUT(request: Request) {
  const { authenticated, error } = requireAuth(request);
  if (!authenticated) return error;

  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Experience ID is required' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const { data, error: dbError } = await supabase
      .from('experience')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to update experience' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/experience - Delete an experience entry
export async function DELETE(request: Request) {
  const { authenticated, error } = requireAuth(request);
  if (!authenticated) return error;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Experience ID is required' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const { error: dbError } = await supabase
      .from('experience')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to delete experience' },
      { status: 500 }
    );
  }
}
