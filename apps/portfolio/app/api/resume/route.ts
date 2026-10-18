import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";
import { isAuthenticated } from "@/lib/auth";

const DATA_DIR   = join(process.cwd(), "data");
const RESUME_FILE = join(DATA_DIR, "resume.json");
const BACKUP_DIR  = join(DATA_DIR, "backups");
const MAX_BACKUPS = 20;

function ensureDirs() {
  if (!existsSync(DATA_DIR))   mkdirSync(DATA_DIR,   { recursive: true });
  if (!existsSync(BACKUP_DIR)) mkdirSync(BACKUP_DIR, { recursive: true });
}

function readResume() {
  ensureDirs();
  return JSON.parse(readFileSync(RESUME_FILE, "utf-8"));
}

function createBackup(current: object) {
  ensureDirs();
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFile = join(BACKUP_DIR, `resume-${ts}.json`);
  writeFileSync(backupFile, JSON.stringify(current, null, 2), "utf-8");

  // Keep only the last MAX_BACKUPS
  const files = readdirSync(BACKUP_DIR)
    .filter(f => f.startsWith("resume-") && f.endsWith(".json"))
    .sort();
  if (files.length > MAX_BACKUPS) {
    const toDelete = files.slice(0, files.length - MAX_BACKUPS);
    toDelete.forEach(f => {
      try { require("fs").unlinkSync(join(BACKUP_DIR, f)); } catch {}
    });
  }
  return backupFile;
}

function listBackups() {
  ensureDirs();
  return readdirSync(BACKUP_DIR)
    .filter(f => f.startsWith("resume-") && f.endsWith(".json"))
    .sort()
    .reverse()
    .map(f => ({
      filename: f,
      timestamp: f.replace("resume-", "").replace(".json", "").replace(/-/g, (m, i) => i < 19 ? m : ":"),
    }));
}

// Normalise education to always be an array (handles old single-object format)
function normalise(resume: Record<string, unknown>) {
  if (resume.education && !Array.isArray(resume.education)) {
    resume.education = [resume.education];
  }
  return resume;
}

// GET — read current resume + backup list
export async function GET() {
  try {
    const resume  = normalise(readResume());
    const backups = listBackups();
    return NextResponse.json({ resume, backups });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// POST — save (draft) or publish
export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { action, data } = await req.json();
  if (!data) return NextResponse.json({ error: "No data provided" }, { status: 400 });

  try {
    // Always backup before any write
    const current = readResume();
    const backupPath = createBackup(current);

    const now = new Date().toISOString();
    const updated = {
      ...data,
      _meta: {
        ...data._meta,
        version: (current._meta?.version ?? 0) + 1,
        lastUpdated: now,
        publishedAt: action === "publish" ? now : current._meta?.publishedAt,
      },
    };

    writeFileSync(RESUME_FILE, JSON.stringify(updated, null, 2), "utf-8");

    return NextResponse.json({
      ok: true,
      action,
      version: updated._meta.version,
      backupCreated: backupPath.split("\\").pop(),
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
