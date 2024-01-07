function simulateTyping(targetElement, text) {
    for (let i = 0; i < text.length; i++) {
        setTimeout(() => {
            const char = text[i];
            const event = new KeyboardEvent('keypress', {
                bubbles: true,
                cancelable: true,
                key: char,
            });

            targetElement.value += char;
            targetElement.dispatchEvent(event);

            if (i === text.length - 1) {
                // Optionally, trigger a change event after typing is simulated
                const changeEvent = new Event('change', { bubbles: true, cancelable: true });
                targetElement.dispatchEvent(changeEvent);
            }
        }, i * 50); // Adjust the delay as needed
    }
}

function _waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

async function autoFormFiller(formData, waitForElmClone) {
    await new Promise(resolve => setTimeout(resolve, 300));

    const waitForElm = waitForElmClone

    const { userName, userEmail, userPhone, userCitizenship, userPassportNumber, userJmbg } = formData

    const selectLocation = await waitForElm("#label1 > button")
    selectLocation.click()

    await new Promise(resolve => setTimeout(resolve, 550));

    const serbiaLocationOption = await waitForElm('#modal2 > div > div > div.modal-body > div:nth-child(80) > label')
    serbiaLocationOption.click()

    const selectApplication = await waitForElm('#label3 > button')
    selectApplication.click()

    const shortTermVisaOption = await waitForElm('#modalCases > div > div > div.modal-body > div:nth-child(46) > label')
    shortTermVisaOption.click()

    await new Promise(resolve => setTimeout(resolve, 500));

    const saveApplicationBtn = await waitForElm('#modalCases > div > div > div.modal-footer.bg-light > button.btn.btn-success')
    saveApplicationBtn.click()

    // Inputs
    simulateTyping(document.querySelector("#label4"), userName);
    simulateTyping(document.querySelector("#label10"), userEmail);
    simulateTyping(document.querySelector("#label1000"), userPassportNumber);
    simulateTyping(document.querySelector("#label1001"), userCitizenship);
    simulateTyping(document.querySelector("#label1002"), userJmbg);
    simulateTyping(document.querySelector("#label9"), userPhone);

    const concern1 = await waitForElm('#foglalasi-adatok > div.form-group.row.mb-3 > div.col-md-8 > div.form-group.form-check > label')
    const concern2 = await waitForElm('#foglalasi-adatok > div:nth-child(14) > div.col-md-8 > div.form-group.form-check > label')
    
    concern1.click()
    concern2.click()
}

const userName = process.env.USER_NAME
const userEmail = process.env.USER_EMAIL
const userPhone = process.env.USER_PHONE
const userPassportNumber = process.env.USER_PASSPORT_NUMBER
const userCitizenship = process.env.USER_CITIZENSHIP
const userJmbg = process.env.USER_JMBG

const FormData = {
    userName,
    userEmail,
    userPhone,
    userCitizenship,
    userPassportNumber,
    userJmbg,
}

const scriptsString = `
const simulateTyping = ${simulateTyping.toString()}
const autoFormFiller = ${autoFormFiller.toString()}
const waitForElm = ${_waitForElm.toString()}
waitForElm('body h1').then((elm) => {
    console.log('Element is ready');
    autoFormFiller(${JSON.stringify(FormData)}, ${_waitForElm.toString()})
});
`

module.exports = { scriptsString }