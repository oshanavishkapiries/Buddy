const fs = require('fs');
const path = require('path');

const cookiesDir = path.join(__dirname, 'cookies');

if (!fs.existsSync(cookiesDir)) {
    fs.mkdirSync(cookiesDir);
    console.log('Cookies directory created successfully!');
}

const cookiesFile = path.join(cookiesDir, 'linkedin-cookies.json');

if (!fs.existsSync(cookiesFile)) {
    fs.writeFileSync(cookiesFile, JSON.stringify([], null, 2));
    console.log('linkedin-cookies.json file created successfully!');
} else {
    console.log('linkedin-cookies.json file already exists!');
} 