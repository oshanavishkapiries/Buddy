const fs = require('fs').promises;
const logger = require('./logger');

/**
 * Cleans and formats a cookie object to ensure it's compatible with Puppeteer
 * @param {Object} cookie - The cookie object to clean
 * @returns {Object} Cleaned cookie object
 */
function cleanCookie(cookie) {
    return {
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path || '/',
        secure: cookie.secure || false,
        httpOnly: cookie.httpOnly || false,
        sameSite: cookie.sameSite || 'None',
        expires: cookie.expires || cookie.expirationDate || Math.floor(Date.now() / 1000) + 31536000 // 1 year from now
    };
}

/**
 * Sets cookies for a page from a JSON file
 * @param {import('puppeteer-core').Page} page - The Puppeteer page instance
 * @param {string} cookiePath - Path to the cookie file
 */
async function setCookies(page, cookiePath) {
    try {
        logger.info('Loading cookies...');

        // Read and parse cookie file
        const cookieData = await fs.readFile(cookiePath, 'utf8');
        const cookies = JSON.parse(cookieData);

        // Clean and format each cookie
        const cleanedCookies = cookies.map(cleanCookie);

        // Set cookies one by one to handle potential errors
        for (const cookie of cleanedCookies) {
            try {
                await page.setCookie(cookie);
            } catch (cookieError) {
                logger.warning(`Failed to set cookie ${cookie.name}: ${cookieError.message}`);
            }
        }

        logger.success('Cookies loaded successfully');
    } catch (error) {
        logger.error('Failed to load cookies:', error);
        throw error;
    }
}

/**
 * Saves cookies from a page to a JSON file
 * @param {import('puppeteer-core').Page} page - The Puppeteer page instance
 * @param {string} cookiePath - Path to save the cookie file
 */
async function saveCookies(page, cookiePath) {
    try {
        logger.info('Saving cookies...');

        // Get cookies from page
        const cookies = await page.cookies();

        // Clean and format cookies before saving
        const cleanedCookies = cookies.map(cleanCookie);

        // Save cookies to file
        await fs.writeFile(cookiePath, JSON.stringify(cleanedCookies, null, 2));

        logger.success('Cookies saved successfully');
    } catch (error) {
        logger.error('Failed to save cookies:', error);
        throw error;
    }
}

module.exports = {
    setCookies,
    saveCookies
}; 