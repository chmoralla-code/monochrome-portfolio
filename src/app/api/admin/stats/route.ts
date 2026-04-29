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

    // Return default values if there are errors (graceful degradation)
    const projects = projectsError ? 0 : (projectsCount || 0);
    const unreadMessages = messagesError ? 0 : (messagesCount || 0);
    const experience = experienceError ? 0 : (experienceCount || 0);
    const totalMessages = allMessagesError ? 0 : (allMessagesCount || 0);

    return NextResponse.json({
      projects,
      unreadMessages,
      totalMessages,
      experience,
      hasErrors: !!(projectsError || messagesError || experienceError || allMessagesError)
    });
  } catch (err: any) {
    console.error('Stats endpoint error:', err);
    
    // Return zeros instead of error to allow dashboard to load
    return NextResponse.json({
      projects: 0,
      unreadMessages: 0,
      totalMessages: 0,
      experience: 0,
      hasErrors: true,
      errorMessage: err.message
    });
  }
}
