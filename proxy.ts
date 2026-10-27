import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/auth/callback",
    "/callback",
    "/api/login",
    "/api/register",
    "/api/auth/refresh",
    "/api/auth/google",
    "/api/auth/exchange",
];

const authRoutes = [
    "/login",
    "/register",
    "/sign-in",
    "/sign-up",
];

function isPublicRoute(pathname: string): boolean {
    return publicRoutes.some((route) => {
        if (route === "/") return pathname === "/";
        return pathname === route || pathname.startsWith(route + "/");
    });
}

function isAuthRoute(pathname: string): boolean {
    return authRoutes.some((route) => {
        return pathname === route || pathname.startsWith(route + "/");
    });
}

export async function proxy(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    if (pathname === "/sign-in") {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    if (pathname === "/sign-up") {
        return NextResponse.redirect(new URL("/register", req.url));
    }

    const isAuthPage = isAuthRoute(pathname);
    const isPublic = isPublicRoute(pathname);

    let userId: string | null = null;
    const accessToken = req.cookies.get("accessToken")?.value || req.cookies.get("access_token")?.value;

    if (accessToken) {
        try {
            const payload = verifyToken(accessToken);
            if (payload?.userId) {
                userId = String(payload.userId);
            }
        } catch {
            userId = null;
        }
    }

    // 1. Auth pages (/login, /register, etc.):
    // Never block, trap, or silently auto-login/redirect users away from auth pages in proxy.
    // Ensure any leftover cookies are purged when unauthenticated so the user starts with a clean slate.
    if (isAuthPage) {
        const response = NextResponse.next();
        if (!userId && accessToken) {
            response.cookies.delete("accessToken");
            response.cookies.delete("access_token");
        }
        return response;
    }

    // 2. Protected routes:
    // Strictly require a valid, verified access token.
    // If unauthenticated, redirect immediately to /login and delete all auth cookies.
    if (!userId && !isPublic) {
        const redirectRes = NextResponse.redirect(new URL("/login", req.url));
        redirectRes.cookies.delete("accessToken");
        redirectRes.cookies.delete("access_token");
        redirectRes.cookies.delete("refreshToken");
        redirectRes.cookies.delete("refresh_token");
        return redirectRes;
    }

    // 3. Public pages or verified requests:
    const response = NextResponse.next();
    if (userId) {
        response.headers.set("x-user-id", userId);
    }
    return response;
}

export default proxy;

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
