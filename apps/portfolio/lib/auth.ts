import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_EXPIRES_MS, SESSION_SECRET } from "./credentials";

/** Verify session cookie server-side. Returns true if valid. */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return false;

  try {
    const [payloadB64, sig] = token.split(".");
    // Verify signature matches
    const expectedSig = Buffer.from(SESSION_SECRET).toString("base64").slice(0, 8);
    if (sig !== expectedSig) return false;

    const payload = JSON.parse(Buffer.from(payloadB64, "base64").toString());
    // Check expiry
    if (Date.now() > payload.exp) return false;
    return true;
  } catch {
    return false;
  }
}
