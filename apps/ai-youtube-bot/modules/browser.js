const puppeteer = require('puppeteer');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROFILE_DIR = path.resolve('./chrome-profile');

const STEALTH_ARGS = [
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-blink-features=AutomationControlled',
  '--disable-infobars',
  '--disable-web-security',
  '--disable-features=IsolateOrigins,site-per-process',
  '--no-sandbox',
  '--disable-setuid-sandbox'
];

async function launchBrowser(profileDir = PROFILE_DIR) {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: CHROME_PATH,
    userDataDir: profileDir,
    args: STEALTH_ARGS,
    ignoreDefaultArgs: ['--enable-automation']
  });

  // Patch every new page to hide navigator.webdriver
  browser.on('targetcreated', async (target) => {
    const p = await target.page().catch(() => null);
    if (p) await patchPage(p);
  });

  const pages = await browser.pages();
  for (const p of pages) await patchPage(p);

  return browser;
}

async function patchPage(page) {
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    window.chrome = { runtime: {} };
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3] });
  });
}

module.exports = { launchBrowser };
