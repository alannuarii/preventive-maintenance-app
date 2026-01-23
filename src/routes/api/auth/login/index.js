import { OAuth2Client } from "google-auth-library";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI
// Pastikan variabel lingkungan sudah terisi
if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error("Missing CLIENT_ID or CLIENT_SECRET in environment variables");
}

// Inisialisasi OAuth2Client dengan CLIENT_ID dan CLIENT_SECRET
const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);


export async function GET() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"],
  });

  return new Response(null, {
    status: 302,
    headers: { Location: authUrl },
  });
}