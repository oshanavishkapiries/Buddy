import { startInstance } from "../../modules/scrapper/start-instance.js";
import { cookies } from "../cookies.js";
import fs from "fs";

function cleanData(raw) {
    return raw.map((item) => {
        return {
            name: item.name.replace(/View .*?profile/, '').trim(),
            profileLink: item.profileLink?.trim() || null,
            description: item.description?.trim() || null,
            location: item.location?.trim() || null
        };
    });
}

async function main() {
    const url =
        "https://www.linkedin.com/search/results/people/?geoUrn=%5B%22100446352%22%5D&keywords=recruter&origin=FACETED_SEARCH&sid=ks5";

    const { page, browser } = await startInstance({
        url,
        cookies,
        monitorNetwork: true,
    });

    console.log("Waiting extra time to ensure all content loads...");

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

    await fs.promises.writeFile(`recruiters-${Date.now()}.json`, JSON.stringify(cleaned, null, 2));

    console.log(`✅ Scraped and saved ${cleaned.length} profiles.`);
    await browser.close();
}

main().catch((err) => {
    console.error("❌ Error in scraping:", err);
});
