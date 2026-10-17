/**
 * Usage:
 *   node download.js youtube @MrBeast
 *   node download.js instagram natgeo
 */

const { downloadYouTubeChannel, downloadInstagramProfile } = require("./modules/video-downloader");

const [platform, name] = process.argv.slice(2);

if (!platform || !name) {
  console.log(`
Usage:
  node download.js youtube  @ChannelName
  node download.js instagram ProfileName

Examples:
  node download.js youtube  @MrBeast
  node download.js instagram natgeo
`);
  process.exit(1);
}

(async () => {
  try {
    if (platform === "youtube") {
      await downloadYouTubeChannel(name);
    } else if (platform === "instagram") {
      await downloadInstagramProfile(name);
    } else {
      console.error(`❌ Unknown platform: ${platform}. Use "youtube" or "instagram"`);
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
})();
