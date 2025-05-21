import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Add stealth plugin
puppeteer.use(StealthPlugin());

async function launchBrowser(options = {}) {
  const {
    headless = true,
    isDesktop = true,
    isMobile = false
  } = options;

  const viewport = isMobile
    ? { width: 375, height: 812, deviceScaleFactor: 2, isMobile: true }
    : { width: 1366, height: 768, deviceScaleFactor: 1, isMobile: false };

  return await puppeteer.launch({
    headless,
    defaultViewport: viewport
  });
}

export {
  launchBrowser
}
