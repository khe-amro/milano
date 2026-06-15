import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // If a 'next' redirect parameter is present (like /dashboard), redirect there. Otherwise, default to /dashboard.
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = createClient();
    
    // Exchange the verification code for an active user session.
    // This automatically verifies the email in Supabase and sets the browser cookies.
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If there is an error, redirect them back to the login screen with a query error message.
  return NextResponse.redirect(`${origin}/dashboard/login?error=Verification failed`);
}
