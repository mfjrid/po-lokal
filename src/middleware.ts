import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard');

    // Protect all dashboard routes
    if (isDashboardRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    // Matches all routes except api, _next/static, _next/image, and favicon.ico
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
