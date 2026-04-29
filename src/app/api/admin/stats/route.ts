import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';

export async function GET(request: Request) {
  const { authenticated, error } = requireAuth(request);
  if (!authenticated) return error;

  try {
    const supabase = createServerClient();

    // Fetch counts in parallel
    const [
      { count: projectsCount, error: projectsError },
      { count: messagesCount, error: messagesError },
      { count: experienceCount, error: experienceError },
      { count: allMessagesCount, error: allMessagesError }
    ] = await Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
      supabase.from('experience').select('*', { count: 'exact', head: true }),
      supabase.from('messages').select('*', { count: 'exact', head: true })
    ]);

    if (projectsError) throw projectsError;
    if (messagesError) throw messagesError;
    if (experienceError) throw experienceError;
    if (allMessagesError) throw allMessagesError;

    return NextResponse.json({
      projects: projectsCount || 0,
      unreadMessages: messagesCount || 0,
      totalMessages: allMessagesCount || 0,
      experience: experienceCount || 0,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
