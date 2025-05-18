const chalk = require('chalk');

const logger = {
    info: (message) => {
        console.log(chalk.blue('ℹ️'), message);
    },

    success: (message) => {
        console.log(chalk.green('✅'), message);
    },

    warning: (message) => {
        console.log(chalk.yellow('⚠️'), message);
    },

    error: (message, error) => {
        console.error(chalk.red('❌'), message);
        if (error) {
            console.error(chalk.red('Error details:'), error);
        }
    },

    action: (message) => {
        console.log(chalk.cyan('🖱️'), message);
    },

    progress: (message) => {
        console.log(chalk.magenta('⏳'), message);
    }
};

module.exports = logger; 