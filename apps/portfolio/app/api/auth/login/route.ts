import { NextRequest, NextResponse } from "next/server";
import { ADMIN_CREDENTIALS, SESSION_COOKIE, SESSION_EXPIRES_MS, SESSION_SECRET } from "@/lib/credentials";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (
    username !== ADMIN_CREDENTIALS.username ||
    password !== ADMIN_CREDENTIALS.password
  ) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Simple signed session token: base64(payload).timestamp
  const payload = { username, exp: Date.now() + SESSION_EXPIRES_MS };
  const token = Buffer.from(JSON.stringify(payload)).toString("base64") +
    "." + Buffer.from(SESSION_SECRET).toString("base64").slice(0, 8);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: SESSION_EXPIRES_MS / 1000,
    path: "/",
  });
  return res;
}
