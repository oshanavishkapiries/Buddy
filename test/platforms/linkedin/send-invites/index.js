const { initializeBrowser } = require('../../../utils/browser');
const { setCookies } = require('../../../utils/cookies');
const logger = require('../../../utils/logger');
const { sendInvitesToFollowers } = require('./actions');

/**
 * Starts the LinkedIn connection request automation process
 * @param {string} profileUrl - The LinkedIn profile URL to get followers from
 */
async function startLinkedInInviteAutomation(profileUrl) {
    let browser;
    try {
        logger.info('Starting LinkedIn invite automation...');

        // Initialize browser
        browser = await initializeBrowser();
        const page = await browser.newPage();

        // Set cookies
        await setCookies(page, './cookies/linkedin-cookies.json');

        try {
            await page.goto('https://www.linkedin.com/feed/', {
                waitUntil: 'domcontentloaded',
                timeout: 30000
            });
            await page.waitForSelector('.scaffold-finite-scroll', { timeout: 10000 });
        } catch (navError) {
            logger.warning('Initial navigation timeout, but continuing...');
        }

        await new Promise(resolve => setTimeout(resolve, 3000));

        // Send invites to followers
        await sendInvitesToFollowers(page, profileUrl);

        logger.success('LinkedIn invite automation completed successfully!');
    } catch (error) {
        logger.error('LinkedIn invite automation failed:', error);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

module.exports = {
    startLinkedInInviteAutomation
}; 