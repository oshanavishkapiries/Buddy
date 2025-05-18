const dotenv = require('dotenv');
const puppeteer = require('puppeteer-core');
const logger = require('./logger');

dotenv.config();

/**
 * Initializes the browser with the correct executable path
 * @returns {Promise<import('puppeteer-core').Browser>}
 */
async function initializeBrowser() {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: process.env.CHROME_PATH,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        logger.success('Browser initialized successfully');
        return browser;
    } catch (error) {
        logger.error('Failed to initialize browser:', error);
        throw error;
    }
}

module.exports = {
    initializeBrowser
}; 