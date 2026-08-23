const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'd:/Unitytvsite/admin_screenshot1.png' });
  
  // click a button that contains Newsroom
  const elements = await page.$$('button');
  for (const el of elements) {
    const text = await page.evaluate(e => e.textContent, el);
    if (text && text.includes('Newsroom')) {
      await el.click();
      break;
    }
  }
  
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'd:/Unitytvsite/admin_screenshot2.png' });
  await browser.close();
  console.log('Done');
})();
