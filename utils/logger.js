const chalk = require('chalk');

/**
 * Logger utility for consistent console output
 */
const logger = {
    /**
     * Logs an info message
     * @param {string} message - The message to log
     */
    info: (message) => {
        console.log(chalk.blue('ℹ'), message);
    },

    /**
     * Logs a success message
     * @param {string} message - The message to log
     */
    success: (message) => {
        console.log(chalk.green('✓'), message);
    },

    /**
     * Logs a warning message
     * @param {string} message - The message to log
     */
    warning: (message) => {
        console.log(chalk.yellow('⚠'), message);
    },

    /**
     * Logs an error message
     * @param {string} message - The message to log
     * @param {Error} [error] - Optional error object
     */
    error: (message, error) => {
        console.error(chalk.red('✖'), message);
        if (error) {
            console.error(chalk.red('  Error details:'), error);
        }
    },

    /**
     * Logs an action being performed
     * @param {string} message - The message to log
     */
    action: (message) => {
        console.log(chalk.cyan('→'), message);
    },

    /**
     * Logs a progress message
     * @param {string} message - The message to log
     */
    progress: (message) => {
        console.log(chalk.magenta('⟳'), message);
    }
};

module.exports = logger; 