/**
 * Admin credentials for the resume editor.
 * ⚠️  DUMMY CREDENTIALS — replace with real values and move to .env before going live.
 *
 * In production, set these as environment variables:
 *   ADMIN_USERNAME=your_username
 *   ADMIN_PASSWORD=your_password
 *   SESSION_SECRET=a_long_random_string
 */

export const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME ?? "yogesh_admin",
  password: process.env.ADMIN_PASSWORD ?? "Resume@2026!",
};

export const SESSION_SECRET =
  process.env.SESSION_SECRET ?? "yogesh-portfolio-secret-key-change-in-prod";

/** Session cookie name */
export const SESSION_COOKIE = "portfolio_session";

/** Session expires in 8 hours */
export const SESSION_EXPIRES_MS = 8 * 60 * 60 * 1000;
