const { launchBrowser } = require('./modules/browser');

(async () => {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  await page.goto('https://google.com');
  await page.screenshot({ path: 'google.png' });
  console.log('Screenshot saved: google.png');
  // browser.close();
})();
