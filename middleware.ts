import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl;
        const token = req.nextauth.token;

        // Admin route védelem — csak admin role férhet hozzá
        if (pathname.startsWith('/admin') && token?.role !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            // Ez határozza meg hogy mikor fusson a middleware
            authorized: ({ token }) => !!token,
        },
    }
);

// Mely route-okra vonatkozzon a middleware
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/log/:path*',
        '/foods/:path*',
        '/recipes/:path*',
        '/profile/:path*',
        '/admin/:path*',
    ],
};