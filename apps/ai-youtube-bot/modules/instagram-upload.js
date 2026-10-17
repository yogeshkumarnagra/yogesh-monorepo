const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const CHROME_PROFILE = path.join(__dirname, "../chrome-profile");

async function uploadToInstagram(videoPath, caption = "") {
  const absVideoPath = path.resolve(videoPath);
  if (!fs.existsSync(absVideoPath)) throw new Error(`Video not found: ${absVideoPath}`);

  console.log(`\n📸 Uploading to Instagram: ${path.basename(absVideoPath)}`);

  const browser = await puppeteer.launch({
    headless: false,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    userDataDir: CHROME_PROFILE,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto("https://www.instagram.com/", { waitUntil: "networkidle2" });

  // Check if logged in
  const isLoggedIn = await page.$('svg[aria-label="Home"]');
  if (!isLoggedIn) {
    console.log("⚠️  Not logged into Instagram. Please log in manually in the browser window.");
    console.log("   Waiting 60 seconds for manual login...");
    await new Promise((r) => setTimeout(r, 60000));
  }

  // Click the Create / + button
  await page.waitForSelector('svg[aria-label="New post"]', { timeout: 15000 }).catch(async () => {
    // fallback: look for the create link
    await page.waitForSelector('a[href="/create/style/"]', { timeout: 10000 });
    await page.click('a[href="/create/style/"]');
  });

  // Try clicking the new post button
  const createBtn = await page.$('svg[aria-label="New post"]');
  if (createBtn) {
    const parent = await createBtn.evaluateHandle((el) => el.closest("div[role='button'], a"));
    await parent.click();
  }

  // Wait for file input and upload video
  await page.waitForSelector('input[type="file"]', { timeout: 15000 });
  const fileInput = await page.$('input[type="file"]');
  await fileInput.uploadFile(absVideoPath);

  console.log("   Video file attached, waiting for processing...");
  await page.waitForTimeout(5000);

  // Click OK/Select on crop/format dialog if it appears
  const okBtn = await page.$('button:has-text("OK")').catch(() => null);
  if (okBtn) await okBtn.click();

  // Click Next button (may appear multiple times for crop → filter → caption screens)
  for (let i = 0; i < 3; i++) {
    await page.waitForTimeout(3000);
    const next = await page.$('div[role="button"]:has-text("Next"), button:has-text("Next")');
    if (next) {
      await next.click();
      console.log(`   Clicked Next (step ${i + 1})`);
    }
  }

  // Add caption
  if (caption) {
    await page.waitForTimeout(2000);
    const captionBox = await page.$('div[aria-label="Write a caption..."], div[contenteditable="true"]');
    if (captionBox) {
      await captionBox.click();
      await captionBox.type(caption, { delay: 30 });
    }
  }

  // Click Share button
  await page.waitForTimeout(2000);
  const shareBtn = await page.$('div[role="button"]:has-text("Share"), button:has-text("Share")');
  if (!shareBtn) throw new Error("Share button not found");
  await shareBtn.click();

  // Wait for upload to complete
  console.log("   Uploading... (waiting up to 3 minutes)");
  await page.waitForSelector('div:has-text("Your reel has been shared"), span:has-text("Your post has been shared")', {
    timeout: 180000,
  }).catch(() => console.log("   Upload may have completed (confirmation not detected)"));

  console.log(`✅ Instagram upload done: ${path.basename(absVideoPath)}`);
  await browser.close();
}

module.exports = { uploadToInstagram };
