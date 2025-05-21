import { launchBrowser } from "../utils/puppeteerUtil.js";

async function startInstance({ url, cookies = [] }) {
  const browser = await launchBrowser({
    headless: false,
    isDesktop: true,
    isMobile: false
  });

  const page = await browser.newPage();

  // Set cookies if provided
  if (cookies.length > 0) {
    await page.setCookie(...cookies);
  }

  // Start flow
  console.log('Starting flow...');

  try {
    // Navigate to URL
    await page.goto(url);
    console.log('Page loaded successfully');

    // Return page and browser for further operations
    return {
      page,
      browser,
      async end() {
        console.log('Ending flow...');
        await browser.close();
        console.log('Browser closed');
      }
    };
  } catch (error) {
    console.error('Error during flow:', error);
    await browser.close();
    throw error;
  }
}

// Example usage:
/*
const instance = await startInstance({
  url: 'https://example.com',
  cookies: [
    {
      name: 'cookie1',
      value: 'value1',
      domain: 'example.com'
    }
  ]
});

// Use the page
await instance.page.screenshot({ path: 'screenshot.png' });

// End the flow
await instance.end();
*/

export { startInstance };
