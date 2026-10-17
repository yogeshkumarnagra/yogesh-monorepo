const path = require('path');
const fs = require('fs');
const settings = require('../config/settings.json');
const { launchBrowser } = require('./browser');

async function animateScenes(imagePaths, scenes) {
  const browser = await launchBrowser();

  const page = await browser.newPage();
  await page.goto(settings.kling.url, { waitUntil: 'networkidle2' });

  // Check login
  const isLoggedIn = await page.$('[class*="user-avatar"], [class*="userInfo"], [href*="logout"]');
  if (!isLoggedIn) {
    console.log('\n[kling] NOT logged in. Please log in manually in the browser window.');
    console.log('[kling] Waiting for login... (press Enter in terminal once done)');
    await new Promise(resolve => process.stdin.once('data', resolve));
  }

  console.log('[kling] Logged in. Starting animation...');
  const videoPaths = [];

  for (let i = 0; i < imagePaths.length; i++) {
    const imagePath = path.resolve(imagePaths[i]);
    const scene = scenes[i];
    const outPath = path.join('videos', `scene-${String(scene.id).padStart(2, '0')}.mp4`);

    console.log(`[kling] Animating scene ${scene.id}...`);

    try {
      // Navigate to image-to-video page
      await page.goto(`${settings.kling.url}/create/image-to-video`, { waitUntil: 'networkidle2' });
      await page.waitForSelector('input[type="file"]', { timeout: 15000 });

      // Upload image
      const fileInput = await page.$('input[type="file"]');
      await fileInput.uploadFile(imagePath);
      await page.waitForTimeout(2000);

      // Enter prompt
      const promptBox = await page.$('textarea, [contenteditable="true"]');
      if (promptBox) {
        await promptBox.click({ clickCount: 3 });
        await promptBox.type(scene.imagePrompt);
      }

      // Click generate
      await page.click('button[type="submit"], button::-p-text(Generate), button::-p-text(Create)');
      console.log(`[kling] Waiting for video generation...`);

      // Wait for download link to appear
      await page.waitForSelector('a[download], [class*="download"]', {
        timeout: settings.kling.waitTimeoutMs
      });

      // Download the video
      const downloadUrl = await page.$eval(
        'a[download], [class*="download"]',
        el => el.href || el.dataset.url
      );

      const videoBuffer = await page.evaluate(async (url) => {
        const res = await fetch(url);
        const buf = await res.arrayBuffer();
        return Array.from(new Uint8Array(buf));
      }, downloadUrl);

      fs.writeFileSync(outPath, Buffer.from(videoBuffer));
      console.log(`[kling] Saved: ${outPath}`);
      videoPaths.push(outPath);

    } catch (err) {
      console.error(`[kling] Scene ${scene.id} failed: ${err.message}`);
      throw err;
    }
  }

  await browser.close();
  return videoPaths;
}

module.exports = { animateScenes };
