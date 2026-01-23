import { serialize } from "cookie"; // Gunakan library cookie untuk membuat header Set-Cookie
import { useSession } from "vinxi/http";

export async function GET() {
  const session = await useSession({
    password: process.env.SESSION_SECRET,
    name: "auth",
  });

  // Hapus session di sisi server (jika diperlukan)
  await session.update({});

  // Hapus cookie secara manual dengan Set-Cookie
  const expiredCookie = serialize("auth", "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true, // atau false jika di dev (http)
    expires: new Date(0),
  });

  return new Response(null, {
    status: 302,
    headers: {
      "Location": "/auth/login",
      "Set-Cookie": expiredCookie,
    },
  });
}
