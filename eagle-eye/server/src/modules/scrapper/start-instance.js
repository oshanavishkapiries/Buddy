// modules/start-instance.js
import { launchBrowser } from "../../utils/puppeteerUtil.js";
import { parseCookies } from "../../utils/cookieParser.js";

async function startInstance({ url, cookies = [], monitorNetwork = false }) {
  const browser = await launchBrowser({
    headless: false,
    isDesktop: true,
    isMobile: false,
  });

  const page = await browser.newPage();

  // Set cookies
  if (cookies.length > 0) {
    const parsedCookies = parseCookies(cookies);
    await page.setCookie(...parsedCookies);
  }

  // Network data collection
  const network = {
    requests: [],
    responses: [],
  };

  if (monitorNetwork) {
    page.on('request', (request) => {
      network.requests.push({
        url: request.url(),
        method: request.method(),
      });
    });

    page.on('response', async (response) => {
      const req = response.request();
      const contentType = response.headers()['content-type'] || '';

      let body = null;
      try {
        if (contentType.includes('application/json')) {
          body = await response.json();
        } else {
          body = await response.text();
        }
      } catch (err) {
        body = null;
      }

      network.responses.push({
        url: response.url(),
        status: response.status(),
        method: req.method(),
        body,
      });
    });
  }

  // Navigate to the target URL
  await page.goto(url);

  return {
    browser,
    page,
    network,
  };
}

export { startInstance };
