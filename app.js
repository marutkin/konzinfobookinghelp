const puppeteer = require('puppeteer');
const { scriptsString } = require('./autoFormFiller.js');

async function runScript() {
    // Launch a headless browser
    const browser = await puppeteer.launch({
        headless: false, ignoreHTTPSErrors: true,
        args: [`--window-size=1920,1080`],
        defaultViewport: {
            width: 1920,
            height: 1080
        }
    });

    // Open a new page
    const page = await browser.newPage();

    // Navigate to a specific URL
    const targetUrl = 'https://konzinfobooking.mfa.gov.hu/'; // Replace with your desired URL
    await page.goto(targetUrl);

    if (!scriptsString) {
        throw new Error('No script to use! autoFormFiller not found!')
    }

    await page.evaluate(scriptsString);
}

// Run the script
runScript();
