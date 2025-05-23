import { startInstance } from "../../modules/scrapper/start-instance.js";
import { cookies } from "../cookies.js";
import fs from "fs";
import path from "path";

function cleanData(raw) {
    return raw.map((item) => {
        return {
            name: item.name.replace(/\n.*$/, "").trim(),
            profileLink: item.profileLink.trim(),
            description: item.description.trim(),
            location: item.location.trim(),
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
        const cards = document.querySelectorAll(".reusable-search__result-container");
        return Array.from(cards).map((card) => {
            const name = card.querySelector("span.entity-result__title-text")?.innerText || "";
            const profileLink = card.querySelector("a.app-aware-link")?.href || "";
            const description = card.querySelector(".entity-result__primary-subtitle")?.innerText || "";
            const location = card.querySelector(".entity-result__secondary-subtitle")?.innerText || "";
            return { name, profileLink, description, location };
        });
    });

    const cleaned = cleanData(data);

    // Save to file
    const saveDir = path.resolve("data");
    if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir);
    fs.writeFileSync(path.join(saveDir, "recruiters.json"), JSON.stringify(cleaned, null, 2));

    console.log(`✅ Scraped and saved ${cleaned.length} profiles.`);
    await browser.close();
}

main().catch((err) => {
    console.error("❌ Error in scraping:", err);
});
