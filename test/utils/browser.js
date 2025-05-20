const puppeteer = require('puppeteer-core');
const logger = require('./logger');

/**
 * Gets the Chrome executable path based on the operating system
 * @returns {string} Path to Chrome executable
 */
function getChromePath() {
    const platform = process.platform;

    if (platform === 'win32') {
        // Windows paths
        const paths = [
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe'
        ];

        for (const path of paths) {
            if (require('fs').existsSync(path)) {
                return path;
            }
        }
    } else if (platform === 'darwin') {
        // macOS paths
        return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    } else if (platform === 'linux') {
        // Linux paths
        return '/usr/bin/google-chrome';
    }

    throw new Error('Chrome executable not found. Please install Google Chrome.');
}

/**
 * Initializes a new browser instance
 * @returns {Promise<import('puppeteer-core').Browser>}
 */
async function initializeBrowser() {
    try {
        logger.info('Initializing browser...');

        const chromePath = getChromePath();
        logger.info(`Using Chrome at: ${chromePath}`);

        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
            executablePath: chromePath,
            args: [
                '--start-maximized',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu'
            ]
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