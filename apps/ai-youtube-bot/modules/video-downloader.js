const { execSync, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

// Output folders
const DOWNLOAD_DIR = {
  youtube: path.join(__dirname, "../downloads/youtube"),
  instagram: path.join(__dirname, "../downloads/instagram"),
};

function ensureDirs() {
  Object.values(DOWNLOAD_DIR).forEach((d) => fs.mkdirSync(d, { recursive: true }));
}

function checkYtDlp() {
  try {
    execSync("yt-dlp --version", { stdio: "pipe" });
  } catch {
    throw new Error(
      "yt-dlp not found. Install it:\n  winget install yt-dlp\nOR\n  pip install yt-dlp"
    );
  }
}

/**
 * Download all videos from a YouTube channel
 * @param {string} channelName  e.g. "@MrBeast" or "MrBeast"
 */
function downloadYouTubeChannel(channelName) {
  ensureDirs();
  checkYtDlp();

  // Normalize: add @ if missing
  const handle = channelName.startsWith("@") ? channelName : `@${channelName}`;
  const url = `https://www.youtube.com/${handle}/videos`;
  const outDir = DOWNLOAD_DIR.youtube;

  console.log(`\n📺 Downloading YouTube channel: ${handle}`);
  console.log(`📁 Saving to: ${outDir}\n`);

  const args = [
    url,
    "-o", path.join(outDir, "%(channel)s/%(upload_date)s_%(title)s.%(ext)s"),
    "--format", "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
    "--merge-output-format", "mp4",
    "--match-filter", "duration <= 180",  // Shorts only (≤3 min)
    "--continue",
    "--ignore-errors",
    "--progress",
  ];

  return runYtDlp(args);
}

/**
 * Download all videos from an Instagram profile
 * @param {string} username  e.g. "natgeo" (without @)
 */
function downloadInstagramProfile(username) {
  ensureDirs();
  checkYtDlp();

  const clean = username.replace("@", "");
  const url = `https://www.instagram.com/${clean}/`;
  const outDir = DOWNLOAD_DIR.instagram;

  console.log(`\n📸 Downloading Instagram profile: @${clean}`);
  console.log(`📁 Saving to: ${outDir}`);
  console.log(`ℹ️  Instagram requires login. Using your Chrome cookies...\n`);

  const args = [
    url,
    "-o", path.join(outDir, `${clean}/%(upload_date)s_%(title)s.%(ext)s`),
    "--cookies-from-browser", "chrome",   // uses your Chrome login session
    "--format", "best[ext=mp4]/best",
    "--continue",
    "--ignore-errors",
    "--progress",
  ];

  return runYtDlp(args);
}

function runYtDlp(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn("yt-dlp", args, { stdio: "inherit", shell: true });
    proc.on("close", (code) => {
      if (code === 0) {
        console.log("\n✅ Download complete!");
        resolve();
      } else {
        reject(new Error(`yt-dlp exited with code ${code}`));
      }
    });
  });
}

module.exports = { downloadYouTubeChannel, downloadInstagramProfile };
