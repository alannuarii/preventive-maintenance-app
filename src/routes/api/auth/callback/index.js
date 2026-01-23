import { OAuth2Client } from "google-auth-library";
import { useSession } from "vinxi/http";
import jwt from "jsonwebtoken";
import { pool } from "~/lib/db/postgresql";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const JWT_SECRET = process.env.JWT_SECRET;

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

export async function GET({ request }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) return new Response("Code not found", { status: 400 });

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userInfoResponse.ok) return new Response("Failed to fetch user info", { status: 500 });
    const userInfo = await userInfoResponse.json();

    // Menggunakan pool.connect() untuk mendapatkan client
    const client = await pool.connect();
    try {
      // Mengubah placeholder dari '?' menjadi '$1' untuk PostgreSQL
      const existingUser = await client.query(
        "SELECT id, email, name, google_id FROM googleuser WHERE google_id = $1 LIMIT 1",
        [userInfo.id]
      );

      if (existingUser.rows.length === 0) {
        // Mengubah placeholder dari '?' menjadi '$1', '$2', '$3', '$4' untuk PostgreSQL
        // Menambahkan created_at dengan DEFAULT CURRENT_TIMESTAMP tidak perlu disebutkan di INSERT query
        await client.query(
          "INSERT INTO googleuser (id, email, name, google_id) VALUES ($1, $2, $3, $4)",
          [generateUserId(), userInfo.email, userInfo.name, userInfo.id]
        );
      }
    } finally {
      // Penting untuk melepaskan client kembali ke pool
      client.release();
    }

    const tokenPayload = {
      id: userInfo.id,
      email: userInfo.email, // Ambil dari userInfo
      name: userInfo.name,   // Ambil dari userInfo
    };

    const jwtToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "30d" });

    const session = await useSession({
      password: process.env.SESSION_SECRET,
      name: "auth", // bisa diganti
    });

    await session.update({ token: jwtToken });

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

function generateUserId() {
  const bytes = crypto.getRandomValues(new Uint8Array(15));
  return [...bytes].map(b => b.toString(16).padStart(2, "0")).join("");
}
