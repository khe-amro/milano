import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  // Update user session cookies first
  let response = await updateSession(request);

  const path = request.nextUrl.pathname;

  // Protect all dashboard routes except /dashboard/login
  if (path.startsWith('/dashboard') && path !== '/dashboard/login') {
    // Create a temporary read-only supabase client in the middleware to inspect request cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            // No-op in read-only check
          },
          remove(name: string, options: CookieOptions) {
            // No-op in read-only check
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // User is not authenticated, redirect to the dashboard login page
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/dashboard/login';
      // Pass the original path as a query param so we can redirect back after successful login
      redirectUrl.searchParams.set('next', path);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for Next.js internal folders and static assets:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Images in /public/images/
     */
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
