/**
 * Generic retry wrapper — lifted from ai-youtube-bot/main.js
 * Retries an async function up to maxAttempts times with a fixed delay.
 */
export async function withRetry<T>(
  label: string,
  fn: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 2000
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(
        `[retry] ${label} failed (attempt ${attempt}/${maxAttempts}): ${message}`
      );
      if (attempt === maxAttempts) throw err;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  // TypeScript needs this, but it's unreachable
  throw new Error(`[retry] ${label} exhausted all ${maxAttempts} attempts`);
}
