const path = require('path');

/**
 * Sets cookies for a Puppeteer page
 * @param {import('puppeteer-core').Page} page - The Puppeteer page instance
 * @param {string} cookiePath - Path to the cookies.json file
 * @returns {Promise<void>}
 */
async function setCookies(page, cookiePath) {
    try {
        // Load cookies from file using absolute path
        const absolutePath = path.resolve(process.cwd(), cookiePath);
        const cookies = require(absolutePath);

        // Set cookies one by one with error handling
        for (const cookie of cookies) {
            try {
                // Remove any problematic fields
                const cleanCookie = {
                    name: cookie.name,
                    value: cookie.value,
                    domain: cookie.domain,
                    path: cookie.path,
                    secure: cookie.secure,
                    httpOnly: cookie.httpOnly,
                    sameSite: cookie.sameSite || 'no_restriction'
                };

                if (cookie.expirationDate) {
                    cleanCookie.expires = cookie.expirationDate;
                }

                await page.setCookie(cleanCookie);
            } catch (cookieError) {
                console.warn(`Failed to set cookie ${cookie.name}:`, cookieError.message);
            }
        }
    } catch (error) {
        console.error('Error setting cookies:', error);
        throw error;
    }
}

module.exports = {
    setCookies
}; 