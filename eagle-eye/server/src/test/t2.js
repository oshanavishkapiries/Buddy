
import { startInstance } from "../modules/scrapper/start-instance.js";
import { sleep } from "../utils/sleep.js";
import { cookies } from "./cookies.js";
import fs from 'fs';

const { page, network, browser } = await startInstance({
  url: 'https://www.instagram.com/kavihari_haputhanthri',
  cookies,
  monitorNetwork: true,
});

await sleep(8000);

// Filter and log specific API responses
const graphqlResponses = network.responses.filter((res) =>
  res.url.includes('/graphql/query')
);

for (const res of graphqlResponses) {
  const fileName = `graphql_response_${Date.now()}.json`;
  const fileContent = {
    url: res.url,
    body: res.body
  };
  await fs.promises.writeFile(fileName, JSON.stringify(fileContent, null, 2));
}

// Optional: Screenshot or other actions
// await page.screenshot({ path: 'screenshot.png' });

// Close the browser
await browser.close();
