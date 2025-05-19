const { initializeBrowser } = require('../../../utils/browser');
const { setCookies } = require('../../../utils/cookies');
const logger = require('../../../utils/logger');
const { navigateToMyNetwork } = require('./navigation');
const { acceptAllInvitations } = require('./actions');

/**
 * Starts the LinkedIn automation process
 */
async function startLinkedInAutomation() {
    let browser;
    try {
        logger.info('Starting LinkedIn automation...');

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

        // Navigate to My Network page
        await navigateToMyNetwork(page);

        // Accept invitations
        await acceptAllInvitations(page);

        logger.success('LinkedIn automation completed successfully!');
    } catch (error) {
        logger.error('LinkedIn automation failed:', error);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

module.exports = {
    startLinkedInAutomation
}; 