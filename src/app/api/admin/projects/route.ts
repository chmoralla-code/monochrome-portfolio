import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';

// GET /api/admin/projects - List all projects
export async function GET(request: Request) {
  const { authenticated, error } = requireAuth(request);
  if (!authenticated) return error;

  try {
    const supabase = createServerClient();
    const { data, error: dbError } = await supabase
      .from('projects')
      .select('*')
      .order('order', { ascending: true });

    if (dbError) throw dbError;

    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/admin/projects - Create a new project
export async function POST(request: Request) {
  const { authenticated, error } = requireAuth(request);
  if (!authenticated) return error;

  try {
    const body = await request.json();
    const supabase = createServerClient();

    const { data, error: dbError } = await supabase
      .from('projects')
      .insert([body])
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to create project' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/projects - Update a project
export async function PUT(request: Request) {
  const { authenticated, error } = requireAuth(request);
  if (!authenticated) return error;

  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const { data, error: dbError } = await supabase
      .from('projects')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/projects - Delete a project
export async function DELETE(request: Request) {
  const { authenticated, error } = requireAuth(request);
  if (!authenticated) return error;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const { error: dbError } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to delete project' },
      { status: 500 }
    );
  }
}
