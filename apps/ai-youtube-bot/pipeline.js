/**
 * Download all videos from a YouTube/Instagram page and re-upload them.
 *
 * Usage:
 *   node pipeline.js download-upload youtube  @MrBeast
 *   node pipeline.js download-upload instagram natgeo
 *
 *   node pipeline.js download   youtube  @MrBeast        (download only)
 *   node pipeline.js upload     youtube  ./downloads/youtube/MrBeast   (upload folder only)
 */

const fs = require("fs");
const path = require("path");
const { downloadYouTubeChannel, downloadInstagramProfile } = require("./modules/video-downloader");
const { uploadToYouTube } = require("./modules/youtube-upload");
const { uploadToInstagram } = require("./modules/instagram-upload");

const [action, platform, target] = process.argv.slice(2);

const HELP = `
Usage:
  node pipeline.js download-upload youtube  @ChannelName
  node pipeline.js download-upload instagram ProfileName

  node pipeline.js download  youtube  @ChannelName
  node pipeline.js download  instagram ProfileName

  node pipeline.js upload    youtube  <folder-with-mp4s>
  node pipeline.js upload    instagram <folder-with-mp4s>
`;

if (!action || !platform || !target) {
  console.log(HELP);
  process.exit(1);
}

// ── helpers ────────────────────────────────────────────────────────────────

function getMp4Files(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory()
        ? getMp4Files(path.join(dir, e.name))
        : e.name.endsWith(".mp4")
        ? [path.join(dir, e.name)]
        : []
    );
}

function titleFromFile(filePath) {
  return path.basename(filePath, ".mp4").replace(/^\d{8}_/, "").replace(/_/g, " ");
}

async function downloadStep(platform, target) {
  if (platform === "youtube") {
    await downloadYouTubeChannel(target);
    const handle = target.startsWith("@") ? target.slice(1) : target;
    return path.join(__dirname, "downloads", "youtube", handle);
  } else if (platform === "instagram") {
    await downloadInstagramProfile(target);
    const clean = target.replace("@", "");
    return path.join(__dirname, "downloads", "instagram", clean);
  }
  throw new Error(`Unknown platform: ${platform}`);
}

async function uploadStep(platform, folder) {
  const videos = getMp4Files(folder);
  if (videos.length === 0) {
    console.log("⚠️  No .mp4 files found in:", folder);
    return;
  }

  console.log(`\n🚀 Uploading ${videos.length} video(s) to ${platform}...\n`);

  for (const videoPath of videos) {
    const title = titleFromFile(videoPath);
    try {
      if (platform === "youtube") {
        await uploadToYouTube(videoPath, title, title);
      } else if (platform === "instagram") {
        await uploadToInstagram(videoPath, title);
      }
      console.log(`✅ Done: ${path.basename(videoPath)}\n`);
    } catch (err) {
      console.error(`❌ Failed: ${path.basename(videoPath)} — ${err.message}\n`);
    }
  }
}

// ── main ───────────────────────────────────────────────────────────────────

(async () => {
  try {
    if (action === "download") {
      await downloadStep(platform, target);

    } else if (action === "upload") {
      await uploadStep(platform, target);

    } else if (action === "download-upload") {
      const downloadedFolder = await downloadStep(platform, target);
      await uploadStep(platform, downloadedFolder);

    } else {
      console.error(`❌ Unknown action: ${action}`);
      console.log(HELP);
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Pipeline error:", err.message);
    process.exit(1);
  }
})();
