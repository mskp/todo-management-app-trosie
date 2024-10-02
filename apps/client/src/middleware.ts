import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from './lib/auth-utils';

/**
 * Middleware to check if a user is authenticated based on the presence of an access token cookie.
 */
export async function middleware(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const pathname = request.nextUrl.pathname;
    const authRoutes = ['/login', '/signup'];
    const protectedRoutes = ['/projects', '/projects/*'];
    const isAuthRoute = authRoutes.includes(pathname);
    const isProtectedRoute = protectedRoutes.includes(pathname);

    // Verify the access token present in the cookie
    const isAuthenticated = await verifyAccessToken();

    // If logged in and trying to access an auth route, redirect to home page
    if (isAuthenticated && isAuthRoute) {
      return NextResponse.redirect(new URL('/projects', request.nextUrl));
    }

    // If not logged in and trying to access a protected route, redirect to login page
    if (!isAuthenticated && isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    // Continue the request if the above conditions are not met
    return NextResponse.next();
  } catch (error) {
    // In case of an error, redirect to the home page
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }
}

export const config: MiddlewareConfig = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
