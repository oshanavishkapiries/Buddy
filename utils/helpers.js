/**
 * Creates a delay for a specified number of milliseconds
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Simulates human-like mouse movement and clicking
 * @param {import('puppeteer-core').Page} page - The Puppeteer page instance
 * @param {import('puppeteer-core').ElementHandle} element - The element to click
 */
async function simulateHumanClick(page, element) {
    try {
        // Get element position
        const box = await element.boundingBox();
        if (!box) return;

        // Move mouse to element with some randomness
        await page.mouse.move(
            box.x + box.width / 2 + (Math.random() * 10 - 5),
            box.y + box.height / 2 + (Math.random() * 10 - 5),
            { steps: 10 }
        );

        // Small delay before clicking
        await delay(100 + Math.random() * 200);

        // Click the element
        await element.click();
    } catch (error) {
        console.warn(`Failed to simulate human click: ${error.message}`);
        // Fallback to regular click
        await element.click();
    }
}

/**
 * Sets desktop view and scrolls to bottom of page
 * @param {import('puppeteer-core').Page} page - The Puppeteer page instance
 */
async function setupDesktopViewAndScroll(page) {
    try {
        // Set viewport to desktop size
        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 1,
            isMobile: false
        });

        // Scroll to bottom of page
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });

        // Wait a bit for content to load
        await delay(2000);
    } catch (error) {
        console.warn(`Error in setupDesktopViewAndScroll: ${error.message}`);
    }
}

/**
 * Finds a button containing specific text
 * @param {import('puppeteer-core').Page} page - The Puppeteer page instance
 * @param {string} text - The text to search for
 * @returns {Promise<import('puppeteer-core').ElementHandle|null>}
 */
async function findButtonByText(page, text) {
    try {
        // Get all buttons on the page
        const buttons = await page.$$('button');

        // Check each button for the text
        for (const button of buttons) {
            const buttonText = await button.evaluate(el => el.textContent);
            if (buttonText && buttonText.trim() === text) {
                return button;
            }
        }
        return null;
    } catch (error) {
        console.warn(`Error finding button with text "${text}": ${error.message}`);
        return null;
    }
}

module.exports = {
    delay,
    simulateHumanClick,
    setupDesktopViewAndScroll,
    findButtonByText
}; 