const { simulateTyping,
    waitForElement,
    lockUserInteraction,
    unlockUserInteraction,
    findDOMNodeByContent,
    dobPickerClick,
    sleep
} = require('../utils/index.js');

const SCREEN_LOCK_TIME = 4500;

// Populate the form with the provided data.
async function fillInFormWith(formData) {
    // Preparation step. (Lock user interaction for a while to prevent any accidental clicks).
    lockUserInteraction();
    // Unlock after {{SCREEN_LOCK_TIME}} seconds.
    setTimeout(unlockUserInteraction, SCREEN_LOCK_TIME);
    await sleep(300);

    // 0. Form data destructure.
    const { userName, userEmail, userPhone, userCitizenship, userPassportNumber, userJmbg, userDob, userApplicantsNumber } = formData

    // 1. Modal (Location) open.
    const selectLocation = await waitForElement("#label1 > button");
    selectLocation.click();

    await waitForElement('#modal2 > div > div > div.modal-body');
    await waitForElement('#modal2 > div > div > div.modal-body > div:nth-child(81) > label');
    await sleep(900);

    const [serbiaLocationOption] = Array.from(
        document.querySelectorAll('label'),
    ).filter(element => element.textContent.includes('Serbia - Belgrade'));

    if (serbiaLocationOption) {
        serbiaLocationOption.click();
    } else {
        const serbiaLocationOptionAlt = await waitForElement("#modal2 > div > div > div.modal-body > div:nth-child(81) > label");
        serbiaLocationOptionAlt.click();
    }

    // 1.1 Modal (Application) open.
    const selectApplication = await waitForElement('#label3 > button');

    selectApplication.click();
    await sleep();

    const shortTermVisaOption = findDOMNodeByContent("Visa application (Schengen visa- type 'C')");
    await sleep();

    shortTermVisaOption.children[0].click();
    await sleep();

    const saveApplicationBtn = await waitForElement('#modalCases > div > div > div.modal-footer.bg-light > button.btn.btn-success');
    await sleep();

    saveApplicationBtn.click();
    await sleep();

    console.warn('Inserting PHI data...');
    // 2. Basic inputs
    simulateTyping(document.querySelector("#label4"), userName);
    simulateTyping(document.querySelector("#label10"), userEmail);
    simulateTyping(document.querySelector("#label1000"), userPassportNumber);
    simulateTyping(document.querySelector("#label1001"), userCitizenship);
    simulateTyping(document.querySelector("#label1002"), userJmbg);
    simulateTyping(document.querySelector("#label9"), userPhone);
    // 2.1 Basic inputs (Applicants number)
    document.querySelector("#label6").value = '';
    simulateTyping(document.querySelector("#label6"), userApplicantsNumber);
    // 2.2 Basic inputs (Re-Enter email)
    const reEmailLabel = document.querySelector("#foglalasi-adatok > div:nth-child(10) > label");
    const [reEmailInput] = [...reEmailLabel.nextElementSibling.childNodes].filter(n => n.nodeName == 'INPUT');
    if (reEmailInput) {
        simulateTyping(reEmailInput, userEmail);
    }
    // 2.3 Basic inputs (DOB input initial population)
    const dobInput = document.querySelector("#birthDate");
    simulateTyping(dobInput, userDob);
    await sleep(250);

    // Commit DOB selection by clicking on the date picker 2 times.
    dobInput.scrollIntoView({ behavior: 'smooth' });

    await dobPickerClick(dobInput, userDob);

    // 3. Concerns
    const c1 = await waitForElement('#slabel13');
    const c2 = await waitForElement('#label13');

    c1.click();
    c2.click();
}

const scriptsString = `
const simulateTyping = ${simulateTyping.toString()}
const fillInFormWith = ${fillInFormWith.toString()}
const waitForElement = ${waitForElement.toString()}
const lockUserInteraction = ${lockUserInteraction.toString()}
const unlockUserInteraction = ${unlockUserInteraction.toString()}
const findDOMNodeByContent = ${findDOMNodeByContent.toString()}
const dobPickerClick = ${dobPickerClick.toString()}
const sleep = ${sleep.toString()}
const SCREEN_LOCK_TIME = ${SCREEN_LOCK_TIME}
console.warn('Scripts loaded.');

waitForElement('body h1').then(() => {
    console.warn('Starting fillInFormWith...');
    fillInFormWith(${JSON.stringify({
    userName: process.env.USER_NAME,
    userEmail: process.env.USER_EMAIL,
    userPhone: process.env.USER_PHONE,
    userCitizenship: process.env.USER_CITIZENSHIP,
    userPassportNumber: process.env.USER_PASSPORT_NUMBER,
    userJmbg: process.env.USER_JMBG,
    userDob: process.env.USER_DOB,
    userApplicantsNumber: process.env.USER_APPLICANTS_NUMBER
})})
});
`

module.exports = { scriptsString }