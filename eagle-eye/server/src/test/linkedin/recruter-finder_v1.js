import { startInstance } from "../../modules/scrapper/start-instance.js";
import { sleep } from "../../utils/sleep.js";
import { cookies } from "../cookies.js";
import fs from "fs/promises";

const META_PATH = "./meta.json";

async function readMeta() {
  try {
    const data = await fs.readFile(META_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return {
      lastPage: 1,
      totalScraped: 0,
      lastUpdated: null,
    };
  }
}

async function updateMeta({ lastPage, totalScraped }) {
  const meta = {
    lastPage,
    totalScraped,
    lastUpdated: new Date().toISOString(),
  };
  await fs.writeFile(META_PATH, JSON.stringify(meta, null, 2));
}

function cleanData(raw) {
  return raw.map((item) => ({
    name: item.name.replace(/View .*?profile/, "").trim(),
    profileLink: item.profileLink?.trim() || null,
    description: item.description?.trim() || null,
    location: item.location?.trim() || null,
  }));
}

async function clickNext(page) {
    try {
      const nextBtn = await page.$('.artdeco-pagination__button--next:not(.artdeco-button--disabled)');
  
      if (nextBtn) {
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle0' }),
          nextBtn.click()
        ]);
        console.log("✅ Clicked next, waiting for page to load...");
      } else {
        console.log("⚠️ Next button not found or disabled. Retrying in 3 seconds...");
        await sleep(3000); // wait before retrying
      }
    } catch (error) {
      console.error("❌ Error in clicking next:", error);
      await sleep(3000); // fallback pause in case of failure
    }
  }

// Scroll to bottom of page to load more content
async function scrollToBottom(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      const distance = 300;
      const delay = 100;
      const maxScrolls = 10;
      let scrolled = 0;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        scrolled++;
        if (scrolled >= maxScrolls) {
          clearInterval(timer);
          resolve();
        }
      }, delay);
    });
  });
}

async function main() {
  const url =
    "https://www.linkedin.com/search/results/people/?geoUrn=%5B%22100446352%22%5D&keywords=recruter&origin=FACETED_SEARCH&sid=ks5";

  const meta = await readMeta();
  let { lastPage, totalScraped } = meta;

  const { page, browser } = await startInstance({
    url,
    cookies,
    monitorNetwork: true,
  });

  console.log(`🔄 Resuming from page ${lastPage}...`);

  // Navigate to lastPage
  let currentPage = 1;
  while (currentPage < lastPage) {
    const clicked = await clickNext(page);
    if (!clicked) {
      console.log("⛔ Could not reach page", lastPage);
      await browser.close();
      return;
    }
    currentPage++;
  }

  // Scrape loop
  while (true) {
    console.log(`📄 Scraping page ${currentPage}...`);

    await scrollToBottom(page); // scroll to load all content

    await page.waitForSelector('div[data-chameleon-result-urn^="urn:li:member:"]', { timeout: 10000 });

    const data = await page.evaluate(() => {
      const cards = document.querySelectorAll('div[data-chameleon-result-urn^="urn:li:member:"]');
      return Array.from(cards).map((card) => {
        const name = card.querySelector("a[href*='/in/'] span[dir='ltr']")?.innerText || "";
        const profileLink = card.querySelector("a[href*='/in/']")?.href || "";
        const description = card.querySelector("div.t-14.t-black.t-normal")?.innerText || "";
        const location = card.querySelectorAll("div.t-14.t-normal")[1]?.innerText || "";
        return { name, profileLink, description, location };
      });
    });

    const cleaned = cleanData(data);
    totalScraped += cleaned.length;

    // Save page-specific data
    const pageOutput = `recruiters-page-${currentPage}.json`;
    await fs.writeFile(pageOutput, JSON.stringify(cleaned, null, 2));
    console.log(`✅ Page ${currentPage}: Scraped ${cleaned.length} profiles -> saved to ${pageOutput}`);

    await updateMeta({ lastPage: currentPage, totalScraped });

    const clicked = await clickNext(page);
    if (!clicked) {
      console.log("🚩 No more pages or 'Next' is disabled.");
      break;
    }

    currentPage++;
  }

  console.log(`🎉 Done! Total profiles scraped: ${totalScraped}`);
  await browser.close();
}

main().catch((err) => {
  console.error("❌ Error in scraping:", err);
});
