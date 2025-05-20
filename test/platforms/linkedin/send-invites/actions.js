const logger = require('../../../utils/logger');
const selectors = require('../selectors/send-invites');
const { delay, simulateHumanClick } = require('../../../utils/helpers');

/**
 * Handles the connection request popup
 * @param {import('puppeteer-core').Page} page - The Puppeteer page instance
 */
async function handleConnectionPopup(page) {
    try {
        // Wait for popup to appear
        await page.waitForSelector(selectors.popupContainer, { timeout: 5000 });

        // Click "Send without a note" button
        const sendButton = await page.waitForSelector(selectors.popupSendWithoutNote);
        await simulateHumanClick(page, sendButton);

        // Wait for popup to close
        await page.waitForSelector(selectors.popupContainer, { hidden: true });
        await delay(1000);
    } catch (error) {
        logger.warning('Failed to handle connection popup:', error.message);
        // Try to close popup if it's still open
        try {
            const closeButton = await page.$(selectors.popupClose);
            if (closeButton) {
                await simulateHumanClick(page, closeButton);
            }
        } catch (closeError) {
            logger.warning('Failed to close popup:', closeError.message);
        }
    }
}

/**
 * Navigates to a profile's followers page
 * @param {import('puppeteer-core').Page} page - The Puppeteer page instance
 * @param {string} profileUrl - The LinkedIn profile URL
 */
async function navigateToFollowers(page, profileUrl) {
    try {
        // Navigate to the profile
        logger.info(`Navigating to profile: ${profileUrl}`);
        await page.goto(profileUrl, { waitUntil: 'domcontentloaded' });
        await delay(2000);

        // Click on followers link
        logger.info('Looking for followers link...');
        await page.waitForSelector(selectors.followersLink);
        await page.click(selectors.followersLink);
        await delay(2000);

        logger.success('Successfully navigated to followers page');
    } catch (error) {
        logger.error('Failed to navigate to followers:', error);
        throw error;
    }
}

/**
 * Sends connection requests to followers
 * @param {import('puppeteer-core').Page} page - The Puppeteer page instance
 * @param {string} profileUrl - The LinkedIn profile URL
 */
async function sendInvitesToFollowers(page, profileUrl) {
    try {
        // Navigate to followers page
        await navigateToFollowers(page, profileUrl);

        let hasMoreFollowers = true;
        let sentCount = 0;
        let pageCount = 0;
        const MAX_PAGES = 10;

        while (hasMoreFollowers && pageCount < MAX_PAGES) {
            // Wait for any action buttons to be visible
            const connectButtons = await page.$$(selectors.connectButton);
            const followButtons = await page.$$(selectors.followButton);

            if (connectButtons.length === 0 && followButtons.length === 0) {
                logger.info('No action buttons found on current view');

                // Try to find the "Next" button
                const nextButton = await page.$(selectors.showMoreButton);
                if (nextButton) {
                    logger.action('Clicking "Next" button...');
                    await simulateHumanClick(page, nextButton);
                    pageCount++;
                    await delay(2000);
                } else {
                    logger.info('No "Next" button found');
                    hasMoreFollowers = false;
                    break;
                }
            } else {
                // Process all visible connect buttons first
                for (const button of connectButtons) {
                    try {
                        const isVisible = await button.isVisible();
                        if (!isVisible) continue;

                        const nameElement = await button.evaluate(el => {
                            const ariaLabel = el.getAttribute('aria-label');
                            return ariaLabel ? ariaLabel.replace('Invite ', '').replace(' to connect', '') : null;
                        });

                        if (nameElement) {
                            logger.action(`Sending connection request to ${nameElement}...`);
                            await simulateHumanClick(page, button);
                            await handleConnectionPopup(page);
                            sentCount++;
                            await delay(1000 + Math.random() * 1000);
                        }
                    } catch (buttonError) {
                        logger.warning(`Failed to send connection request: ${buttonError.message}`);
                    }
                }

                // Then process follow buttons
                for (const button of followButtons) {
                    try {
                        const isVisible = await button.isVisible();
                        if (!isVisible) continue;

                        const nameElement = await button.evaluate(el => {
                            const ariaLabel = el.getAttribute('aria-label');
                            return ariaLabel ? ariaLabel.replace('Follow ', '') : null;
                        });

                        if (nameElement) {
                            logger.action(`Following ${nameElement}...`);
                            await simulateHumanClick(page, button);
                            sentCount++;
                            await delay(1000 + Math.random() * 1000);
                        }
                    } catch (buttonError) {
                        logger.warning(`Failed to follow: ${buttonError.message}`);
                    }
                }
            }

            // Random delay between batches
            await delay(2000 + Math.random() * 2000);
        }

        logger.success(`Successfully sent ${sentCount} connection requests/follows`);
    } catch (error) {
        logger.error('Error sending connection requests:', error);
        throw error;
    }
}

module.exports = {
    sendInvitesToFollowers
}; 