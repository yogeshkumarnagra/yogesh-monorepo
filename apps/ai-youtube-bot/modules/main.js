const cron = require('node-cron');
const { generateStory } = require('./modules/story-generator');
const { generateSceneImages } = require('./modules/image-generator');
const { animateScenes } = require('./modules/kling-automation');
const { generateNarration } = require('./modules/voice-generator');
const { buildFinalVideo } = require('./modules/ffmpeg-builder');
const { uploadToYouTube } = require('./modules/youtube-upload');
const settings = require('./config/settings.json');

const { maxAttempts, delayMs } = settings.retry;

async function withRetry(label, fn) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      console.error(`[retry] ${label} failed (attempt ${attempt}/${maxAttempts}): ${err.message}`);
      if (attempt === maxAttempts) throw err;
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
}

async function runPipeline() {
  const storyId = `story-${Date.now()}`;
  console.log(`\n=== Starting pipeline: ${storyId} ===\n`);

  // Step 1 & 2: Story + scene split
  const story = await withRetry('story-generator', () => generateStory(storyId));
  console.log(`[main] Story: ${story.title}`);

  // Step 3: Scene images
  const imagePaths = await withRetry('image-generator', () => generateSceneImages(story.scenes));

  // Step 4 & 5: Kling animation
  const videoPaths = await withRetry('kling-automation', () => animateScenes(imagePaths, story.scenes));

  // Step 6: Hindi narration
  const audioPath = await withRetry('voice-generator', () => generateNarration(story));

  // Step 7: Subtitles (optional - skip if not needed)
  const subtitlesPath = null;  // add subtitles module later if needed

  // Step 8: FFmpeg merge
  const finalPath = await withRetry('ffmpeg-builder', () =>
    buildFinalVideo(videoPaths, audioPath, subtitlesPath)
  );

  // Step 9: YouTube upload
  const videoUrl = await withRetry('youtube-upload', () =>
    uploadToYouTube(finalPath, story.title, story.description, story.tags)
  );

  console.log(`\n=== Done! ${videoUrl} ===\n`);
}

// Run immediately if called directly
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--schedule')) {
    // Scheduled mode using node-cron
    settings.schedules.forEach(cronExpr => {
      console.log(`[cron] Scheduled: ${cronExpr}`);
      cron.schedule(cronExpr, () => runPipeline().catch(console.error));
    });
    console.log('[cron] Scheduler running. Press Ctrl+C to stop.');
  } else {
    // Single run
    runPipeline().catch(err => {
      console.error('[main] Pipeline failed:', err.message);
      process.exit(1);
    });
  }
}

module.exports = { runPipeline };
