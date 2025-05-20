const logger = require('../../../utils/logger');
const selectors = require('../selectors/invite-accept');

// Helper function to create a delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Extracts the name from an invitation's aria-label
 * @param {string} ariaLabel - The aria-label text from the button
 * @returns {string} The extracted name
 */
function extractNameFromAriaLabel(ariaLabel) {
    if (!ariaLabel) return "Unknown";

    // Remove common prefixes and suffixes
    return ariaLabel
        .replace(/^Accept\s+/, '')  // Remove "Accept " prefix
        .replace(/^Ignore\s+an\s+invitation\s+to\s+connect\s+from\s+/, '')  // Remove "Ignore an invitation to connect from "
        .replace(/'s\s+invitation$/, '')  // Remove "'s invitation" suffix
        .trim();
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
        logger.warning(`Error in setupDesktopViewAndScroll: ${error.message}`);
    }
}

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
        logger.warning(`Failed to simulate human click: ${error.message}`);
        // Fallback to regular click
        await element.click();
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
        logger.warning(`Error finding button with text "${text}": ${error.message}`);
        return null;
    }
}

/**
 * Accepts all pending invitations on the page
 * @param {import('puppeteer-core').Page} page - The Puppeteer page instance
 * @returns {Promise<void>}
 */
async function acceptAllInvitations(page) {
    try {
        // First ensure desktop view and scroll to bottom
        await setupDesktopViewAndScroll(page);

        let hasMoreInvitations = true;
        let acceptedCount = 0;
        let loadMoreAttempts = 0;
        const MAX_LOAD_MORE_ATTEMPTS = 10;

        while (hasMoreInvitations && loadMoreAttempts < MAX_LOAD_MORE_ATTEMPTS) {
            // Wait for any accept buttons to be visible
            const acceptButtons = await page.$$(selectors.acceptButton);

            if (acceptButtons.length === 0) {
                logger.info('No accept buttons found on current view');

                // Try to find the "Load more" button
                const loadMoreButton = await findButtonByText(page, 'Load more');

                if (loadMoreButton) {
                    logger.action('Clicking "Load more" button...');
                    await simulateHumanClick(page, loadMoreButton);
                    loadMoreAttempts++;

                    // Wait for new content to load with random delay
                    logger.progress('Waiting for new content to load...');
                    await delay(2000 + Math.random() * 1000);

                    // Scroll to bottom again to ensure new content is loaded
                    await setupDesktopViewAndScroll(page);

                    // Check if we actually loaded more buttons
                    const newButtons = await page.$$(selectors.acceptButton);
                    if (newButtons.length === 0) {
                        logger.info('No new invitations loaded after clicking "Load more"');
                        if (loadMoreAttempts >= MAX_LOAD_MORE_ATTEMPTS) {
                            logger.warning('Reached maximum "Load more" attempts');
                            hasMoreInvitations = false;
                            break;
                        }
                    }
                } else {
                    logger.info('No "Load more" button found');
                    hasMoreInvitations = false;
                    break;
                }
            } else {
                // Reset load more attempts when we find buttons
                loadMoreAttempts = 0;
            }

            // Process all visible accept buttons
            for (const button of acceptButtons) {
                try {
                    // Check if button is visible and clickable
                    const isVisible = await button.isVisible();
                    if (!isVisible) continue;

                    // Get the invitation name from aria-label
                    const ariaLabel = await button.evaluate(el => el.getAttribute('aria-label'));
                    const name = extractNameFromAriaLabel(ariaLabel);

                    logger.action(`Accepting invitation from ${name}...`);

                    // Simulate human-like interaction
                    await simulateHumanClick(page, button);
                    acceptedCount++;

                    // Random delay between actions to simulate human behavior
                    await delay(800 + Math.random() * 1200);
                } catch (buttonError) {
                    logger.warning(`Failed to click an accept button: ${buttonError.message}`);
                }
            }

            // Random delay between batches of invitations
            await delay(1000 + Math.random() * 2000);
        }

        if (loadMoreAttempts >= MAX_LOAD_MORE_ATTEMPTS) {
            logger.warning('Stopped after maximum "Load more" attempts');
        }

        logger.success(`Successfully accepted ${acceptedCount} invitations`);
    } catch (error) {
        logger.error('Error accepting invitations:', error);
        throw error;
    }
}

module.exports = {
    acceptAllInvitations
}; 