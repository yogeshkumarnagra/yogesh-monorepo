// ─── YouTube / video bot shared types ───────────────────────────────────────

export interface UploadResult {
  videoId: string;
  url: string;
  title: string;
  status: "uploaded" | "failed";
}

export interface StoryOutput {
  title: string;
  description: string;
  tags: string[];
  scenes: string[];
  language: string;
}

export interface RetryOptions {
  maxAttempts: number;
  delayMs: number;
}
