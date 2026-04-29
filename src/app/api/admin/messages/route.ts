import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';

// GET /api/admin/messages - List all messages
export async function GET(request: Request) {
  const { authenticated, error } = requireAuth(request);
  if (!authenticated) return error;

  try {
    const supabase = createServerClient();
    const { data, error: dbError } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (dbError) throw dbError;

    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/messages - Mark message as read/unread
export async function PUT(request: Request) {
  const { authenticated, error } = requireAuth(request);
  if (!authenticated) return error;

  try {
    const body = await request.json();
    const { id, is_read } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const { data, error: dbError } = await supabase
      .from('messages')
      .update({ is_read })
      .eq('id', id)
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to update message' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/messages - Delete a message
export async function DELETE(request: Request) {
  const { authenticated, error } = requireAuth(request);
  if (!authenticated) return error;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const { error: dbError } = await supabase
      .from('messages')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to delete message' },
      { status: 500 }
    );
  }
}
