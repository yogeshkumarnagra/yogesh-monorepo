import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { isAuthenticated } from "@/lib/auth";

const BACKUP_DIR = join(process.cwd(), "data", "backups");

// GET /api/resume/backup?file=resume-2026-...json  → restore a backup
export async function GET(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const file = req.nextUrl.searchParams.get("file");
  if (!file) return NextResponse.json({ error: "No file specified" }, { status: 400 });

  // Sanitize — only allow filenames, no path traversal
  const safeName = file.replace(/[^a-zA-Z0-9._-]/g, "");
  const filePath = join(BACKUP_DIR, safeName);

  if (!existsSync(filePath)) {
    return NextResponse.json({ error: "Backup not found" }, { status: 404 });
  }

  const data = JSON.parse(readFileSync(filePath, "utf-8"));
  return NextResponse.json({ resume: data });
}
