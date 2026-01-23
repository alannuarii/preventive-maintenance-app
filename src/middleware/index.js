import { createMiddleware } from "@solidjs/start/middleware";
import { useSession } from "vinxi/http";
import jwt from "jsonwebtoken";

export default createMiddleware({
    async onRequest(event) {
        const sessionSecret = process.env.SESSION_SECRET;

        if (!sessionSecret || sessionSecret.length === 0) {
            console.error("SESSION_SECRET is empty or undefined");
            throw new Error("SESSION_SECRET must be defined");
        }

        const session = await useSession({
            password: sessionSecret,
            name: "auth",
        });

        const cookieToken = session.data?.token;
        const { pathname } = new URL(event.request.url);

        const publicPaths = ["/auth/login", "/api/auth/login", "/api/auth/callback"];
        const isPublic = publicPaths.some(path => pathname.startsWith(path));

        // ✅ Aturan tambahan: jika sudah login dan akses /auth/login, redirect ke /
        if (pathname === "/auth/login" && cookieToken) {
            try {
                jwt.verify(cookieToken, process.env.JWT_SECRET);
                console.warn("Ada tokennya cuy, redirecting to home");
                return Response.redirect(new URL("/", event.request.url), 302);
            } catch (err) {
                // Token tidak valid → biarkan akses ke /auth/login
            }
        }

        // if (isPublic) return;

        // 🔒 Harus login untuk akses private route
        if (!cookieToken) {
            console.warn("No token found, redirecting to login");
            return Response.redirect(new URL("/auth/login", event.request.url), 302);
        }

        try {
            jwt.verify(cookieToken, process.env.JWT_SECRET);
        } catch (err) {
            console.error("JWT invalid or expired", err);
            return Response.redirect(new URL("/auth/login", event.request.url), 302);
        }

        // Token valid, lanjutkan ke route
    }
});
