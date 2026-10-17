import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const OUTPUT_DIR = "D:\\MyData\\Projects\\AI\\ai-story-pipeline\\output";

const MIME: Record<string, string> = {
  ".png":  "image/png",
  ".mp3":  "audio/mpeg",
  ".mp4":  "video/mp4",
  ".txt":  "text/plain; charset=utf-8",
};

export async function GET(req: NextRequest) {
  const filePath = req.nextUrl.searchParams.get("path");
  if (!filePath) return NextResponse.json({ error: "No path" }, { status: 400 });

  const fullPath = path.join(OUTPUT_DIR, filePath);
  const ext = path.extname(filePath).toLowerCase();

  if (!fs.existsSync(fullPath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const buffer = fs.readFileSync(fullPath);
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": "no-store",
    },
  });
}
