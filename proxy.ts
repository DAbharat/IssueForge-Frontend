import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/api/login",
    "/api/register",
    "/api/auth/refresh",
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
    console.log("Proxy: Request received for:", pathname);

    if (pathname === "/sign-in") {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    if (pathname === "/sign-up") {
        return NextResponse.redirect(new URL("/register", req.url));
    }

    let userId: string | null = null;
    const accessToken = req.cookies.get("accessToken")?.value || req.cookies.get("access_token")?.value;
    const refreshToken = req.cookies.get("refreshToken")?.value || req.cookies.get("refresh_token")?.value;

    if (accessToken) {
        try {
            const payload = verifyToken(accessToken);
            if (payload?.userId) {
                userId = String(payload.userId);
            }
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "unknown";
            console.log("Proxy: Invalid access token:", msg);
            userId = null;
        }
    }

    if (!userId && refreshToken) {
        try {
            const refreshPayload = verifyToken(refreshToken);
            if (refreshPayload?.userId) {
                userId = String(refreshPayload.userId);
            } else if (refreshToken.length > 20) {
                userId = "authenticated";
            }
        } catch {
            userId = null;
        }
    }

    const isAuthPage = isAuthRoute(pathname);

    if (userId && isAuthPage) {
        console.log("Proxy: Redirecting authenticated user away from auth page to /profile");
        return NextResponse.redirect(new URL("/profile", req.url));
    }

    // if (userId && pathname === "/") {
    //     console.log("Proxy: Redirecting authenticated user from / to /profile");
    //     return NextResponse.redirect(new URL("/profile", req.url));
    // }

    if (!userId && !isPublicRoute(pathname)) {
        console.log("Proxy: Redirecting unauthenticated user to /login from:", pathname);
        return NextResponse.redirect(new URL("/login", req.url));
    }

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
