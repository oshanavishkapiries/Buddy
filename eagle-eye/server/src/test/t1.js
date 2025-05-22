
import { startInstance } from "../modules/scrapper/start-instance.js";
import { sleep } from "../utils/sleep.js";
import { cookies } from "./cookies.js";

const { page, network, browser } = await startInstance({
  url: 'https://www.instagram.com',
  cookies,
  monitorNetwork: true,
});

await sleep(8000);

// Filter and log specific API responses
const graphqlResponses = network.responses.filter((res) =>
  res.url.includes('/api/graphql')
);

for (const res of graphqlResponses) {
  console.log('GraphQL API URL:', res.url);
  console.log('Response Body:', res.body);
}

// Optional: Screenshot or other actions
// await page.screenshot({ path: 'screenshot.png' });

// Close the browser
await browser.close();
