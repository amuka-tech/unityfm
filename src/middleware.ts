import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES: Record<string, string[]> = {
  '/admin/overview': ['managing_director', 'super_admin', 'broadcast_director', 'news_editor'],
  '/admin/newsroom': ['managing_director', 'super_admin', 'news_editor', 'field_reporter'],
  '/admin/live-blog': ['managing_director', 'super_admin', 'broadcast_director', 'news_editor', 'field_reporter'],
  '/admin/streams': ['managing_director', 'super_admin', 'broadcast_director'],
  '/admin/epg': ['managing_director', 'super_admin', 'broadcast_director'],
  '/admin/whistleblower': ['managing_director', 'super_admin', 'news_editor'],
  '/admin/monetization': ['managing_director', 'super_admin'],
  '/admin/settings': ['managing_director', 'super_admin']
};

function getRoleFromCookie(cookieValue: string): string | null {
  try {
    const [base64Payload, signature] = cookieValue.split('.');
    if (!base64Payload || !signature) return null;
    
    // Convert base64url to standard base64 and decode
    const payloadStr = Buffer.from(base64Payload, 'base64url').toString('utf8');
    const payload = JSON.parse(payloadStr);
    return payload.role; // The subagent used 'role' directly on the session object
  } catch (e) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const sessionCookie = request.cookies.get('unity_session')?.value;
  let userRole = null;
  
  if (sessionCookie) {
    userRole = getRoleFromCookie(sessionCookie);
  }

  const protectedRoute = Object.keys(PROTECTED_ROUTES).find(route => pathname.startsWith(route));
  
  if (protectedRoute) {
    if (!userRole) {
      return NextResponse.redirect(new URL('/admin?error=unauthorized', request.url));
    }

    const allowedRoles = PROTECTED_ROUTES[protectedRoute];
    if (!allowedRoles.includes(userRole)) {
      // Find the first route they ARE allowed to access and redirect them there instead of an error page,
      // Or just redirect to the first available route for their role
      const firstAllowed = Object.keys(PROTECTED_ROUTES).find(route => PROTECTED_ROUTES[route].includes(userRole));
      if (firstAllowed && pathname !== firstAllowed) {
         return NextResponse.redirect(new URL(firstAllowed, request.url));
      }
      return NextResponse.redirect(new URL('/admin?error=forbidden', request.url));
    }
  }

  const response = NextResponse.next();
  response.headers.set('x-user-authenticated', userRole ? '1' : '0');
  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
