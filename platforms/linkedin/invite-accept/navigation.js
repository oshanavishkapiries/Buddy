const logger = require('../../../utils/logger');
const selectors = require('../selectors/invite-accept');

/**
 * Navigates to the My Network page
 * @param {import('puppeteer-core').Page} page - The Puppeteer page instance
 */
async function navigateToMyNetwork(page) {
    try {
        logger.info('Starting LinkedIn navigation...');

        logger.progress('Looking for My Network link...');
        await page.waitForSelector(selectors.myNetworkLink, { timeout: 10000 });
        logger.success('Found My Network link');

        logger.action('Clicking My Network link...');
        await page.click(selectors.myNetworkLink);
        logger.success('Clicked My Network link');

        logger.progress('Waiting for navigation to complete...');
        try {
            await page.waitForNavigation({
                waitUntil: 'domcontentloaded',
                timeout: 30000
            });
            logger.success('Successfully navigated to My Network page');
        } catch (navError) {
            logger.warning('Navigation timeout, but continuing...');
        }

        // Wait for the page to load and stabilize
        await new Promise(resolve => setTimeout(resolve, 3000));

        logger.progress('Looking for "Show all" link...');
        await page.waitForSelector(selectors.showAllLink, { timeout: 10000 });
        logger.success('Found "Show all" link');

        logger.action('Clicking "Show all" link...');
        await page.click(selectors.showAllLink);
        logger.success('Clicked "Show all" link');

        logger.progress('Waiting for invitation manager page to load...');
        try {
            await page.waitForNavigation({
                waitUntil: 'domcontentloaded',
                timeout: 30000
            });
            logger.success('Successfully navigated to invitation manager page');
        } catch (navError) {
            logger.warning('Navigation timeout, but continuing...');
        }

        // Wait for the page to stabilize
        await new Promise(resolve => setTimeout(resolve, 3000));

        logger.success('Navigation process completed successfully');
    } catch (error) {
        logger.error('Failed to navigate to My Network page:', error);
        throw error;
    }
}

module.exports = {
    navigateToMyNetwork
}; 