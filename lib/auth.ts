export type TokenPayload = {
    userId?: string | number;
    user_id?: string | number;
    sub?: string | number;
    exp?: number;
    iat?: number;
    [key: string]: unknown;
};

/**
 * Verifies and decodes a JWT access token.
 * Validates expiration (exp) and extracts the user identifier.
 */
export function verifyToken(token: string): TokenPayload | null {
    if (!token || typeof token !== "string") {
        return null;
    }

    try {
        const parts = token.split(".");
        if (parts.length !== 3) {
            return null;
        }

        // Base64Url decode payload
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

        let jsonPayload: string;
        if (typeof Buffer !== "undefined") {
            jsonPayload = Buffer.from(paddedBase64, "base64").toString("utf-8");
        } else if (typeof atob === "function") {
            jsonPayload = decodeURIComponent(
                atob(paddedBase64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
        } else {
            return null;
        }

        const payload = JSON.parse(jsonPayload) as TokenPayload;

        // Check token expiration (exp is in seconds)
        if (payload.exp && typeof payload.exp === "number") {
            const currentTime = Math.floor(Date.now() / 1000);
            if (currentTime >= payload.exp) {
                return null;
            }
        }

        const id = payload.user_id ?? payload.userId ?? payload.sub;
        if (!id) {
            return null;
        }

        return {
            ...payload,
            userId: id,
        };
    } catch {
        return null;
    }
}

/**
 * Checks if a JWT token is expired or expiring within `offsetSeconds` (default 30s).
 */
export function isTokenExpiringSoon(token?: string | null, offsetSeconds: number = 30): boolean {
    if (!token || typeof token !== "string") {
        return true;
    }

    try {
        const parts = token.split(".");
        if (parts.length !== 3) {
            return true;
        }

        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

        let jsonPayload: string;
        if (typeof Buffer !== "undefined") {
            jsonPayload = Buffer.from(paddedBase64, "base64").toString("utf-8");
        } else if (typeof atob === "function") {
            jsonPayload = decodeURIComponent(
                atob(paddedBase64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
        } else {
            return true;
        }

        const payload = JSON.parse(jsonPayload) as TokenPayload;
        if (payload.exp && typeof payload.exp === "number") {
            const currentTime = Math.floor(Date.now() / 1000);
            return currentTime >= (payload.exp - offsetSeconds);
        }
        return false;
    } catch {
        return true;
    }
}

