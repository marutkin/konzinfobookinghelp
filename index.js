const puppeteer = require('puppeteer');
const { scriptsString } = require('./form/index.js');

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

    // Navigate
    const targetUrl = 'https://konzinfobooking.mfa.gov.hu/';
    await page.goto(targetUrl);

    // Run the script
    if (!scriptsString) {
        throw new Error('No script to use! fillInFormWith not found!')
    }
    await page.evaluate(scriptsString);
}

runScript();
