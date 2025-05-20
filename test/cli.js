const inquirer = require('inquirer');
const { startLinkedInAutomation } = require('./platforms/linkedin/invite-accept');
const { startLinkedInInviteAutomation } = require('./platforms/linkedin/send-invites');

async function showMainMenu() {
    const { platform } = await inquirer.prompt([
        {
            type: 'list',
            name: 'platform',
            message: 'Select a platform:',
            choices: [
                { name: 'LinkedIn', value: 'linkedin' },
                { name: 'Exit', value: 'exit' }
            ]
        }
    ]);

    if (platform === 'exit') {
        console.log('Goodbye! 👋');
        process.exit(0);
    }

    await showPlatformMenu(platform);
}

async function showPlatformMenu(platform) {
    const menuOptions = {
        linkedin: [
            { name: 'Accept Invitations', value: 'accept_invitations' },
            { name: 'Send Connection Requests to Followers', value: 'send_invites' },
            { name: 'Back to Main Menu', value: 'back' }
        ]
    };

    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: `Select a ${platform} action:`,
            choices: menuOptions[platform]
        }
    ]);

    if (action === 'back') {
        return showMainMenu();
    }

    await handlePlatformAction(platform, action);
}

async function handlePlatformAction(platform, action) {
    try {
        switch (platform) {
            case 'linkedin':
                switch (action) {
                    case 'accept_invitations':
                        await startLinkedInAutomation();
                        break;
                    case 'send_invites':
                        const { profileUrl } = await inquirer.prompt([
                            {
                                type: 'input',
                                name: 'profileUrl',
                                message: 'Enter the LinkedIn profile URL to get followers from:',
                                validate: input => input.includes('linkedin.com/in/') ? true : 'Please enter a valid LinkedIn profile URL'
                            }
                        ]);
                        await startLinkedInInviteAutomation(profileUrl);
                        break;
                }
                break;
        }

        await showPlatformMenu(platform);
    } catch (error) {
        console.error('An error occurred:', error.message);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await showPlatformMenu(platform);
    }
}

console.log('Welcome to Buddy Automation! 🤖\n');
showMainMenu().catch(console.error); 