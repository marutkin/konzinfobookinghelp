function simulateTyping(targetElement, text) {
    if (!text) {
        alert('ENV file is not provided, no PHI text found!')
    }
    for (let i = 0; i < text?.length; i++) {
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
    function lockUserInteraction() {
        let overlay = document.createElement('div');
        overlay.id = 'interaction-lock';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(0, 0, 0, 0.3)';
        overlay.style.zIndex = '9999';
        overlay.style.pointerEvents = 'all';
        document.body.appendChild(overlay);
    }

    function unlockUserInteraction() {
        let overlay = document.getElementById('interaction-lock');
        if (overlay) overlay.remove();
    }

    lockUserInteraction();
    setTimeout(unlockUserInteraction, 5000);

    // Helper for specific text cases.
    function findDOMNodeByContent(content) {
        var allNodes = document.querySelectorAll("*");
        for (var i = 0; i < allNodes.length; i++) {
            var nodeText = allNodes[i].innerText || allNodes[i].textContent;
            if (nodeText && nodeText.trim() === content) {
                return allNodes[i];
            }
        }
        return null;
    }
    await new Promise(resolve => setTimeout(resolve, 300));

    const waitForElm = waitForElmClone

    const { userName, userEmail, userPhone, userCitizenship, userPassportNumber, userJmbg, userDob, userApplicantsNumber } = formData

    // Modal (Location) open.
    const selectLocation = await waitForElm("#label1 > button");
    selectLocation.click();

    await waitForElm('#modal2 > div > div > div.modal-body');
    await waitForElm('#modal2 > div > div > div.modal-body > div:nth-child(81) > label');

    await new Promise(resolve => setTimeout(resolve, 1000));

    const [serbiaLocationOption] = Array.from(
        document.querySelectorAll('label'),
    ).filter(element => element.textContent.includes('Serbia - Belgrade'));

    if (serbiaLocationOption) {
        serbiaLocationOption.click();
    } else {
        const serbiaLocationOptionAlt = await waitForElm("#modal2 > div > div > div.modal-body > div:nth-child(81) > label");
        serbiaLocationOptionAlt.click();
    }

    // Modal (Application) open.
    const selectApplication = await waitForElm('#label3 > button');
    selectApplication.click();

    await new Promise(resolve => setTimeout(resolve, 500));
    const shortTermVisaOption = findDOMNodeByContent("Visa application (Schengen visa- type 'C')");
    await new Promise(resolve => setTimeout(resolve, 500));

    shortTermVisaOption.children[0].click();

    await new Promise(resolve => setTimeout(resolve, 500));

    const saveApplicationBtn = await waitForElm('#modalCases > div > div > div.modal-footer.bg-light > button.btn.btn-success');
    await new Promise(resolve => setTimeout(resolve, 500));

    saveApplicationBtn.click();

    await new Promise(resolve => setTimeout(resolve, 500));

    console.warn('Inserting PHI data...');
    // Inputs
    simulateTyping(document.querySelector("#label4"), userName);
    simulateTyping(document.querySelector("#label10"), userEmail);
    simulateTyping(document.querySelector("#label1000"), userPassportNumber);
    simulateTyping(document.querySelector("#label1001"), userCitizenship);
    simulateTyping(document.querySelector("#label1002"), userJmbg);
    simulateTyping(document.querySelector("#label9"), userPhone);

    // Applicants number
    document.querySelector("#label6").value = '';
    simulateTyping(document.querySelector("#label6"), userApplicantsNumber);

    // Re-Enter email
    const reEmailLabel = document.querySelector("#foglalasi-adatok > div:nth-child(10) > label");
    const [reEmailInput] = [...reEmailLabel.nextElementSibling.childNodes].filter(n => n.nodeName == 'INPUT');
    if (reEmailInput) {
        simulateTyping(reEmailInput, userEmail);
    }

    const concern1 = await waitForElm('#slabel13');
    const concern2 = await waitForElm('#label13');

    concern1.click();
    concern2.click();

    const dobInput = document.querySelector("#birthDate");
    dobInput.scrollIntoView({ behavior: 'smooth' });

    // User Date of Birth
    simulateTyping(dobInput, userDob);
    await new Promise(resolve => setTimeout(resolve, 250));
    dobInput.click();
    dobInput.focus();
    await new Promise(resolve => setTimeout(resolve, 250));
    document.querySelector("#birthDateComponent > div > div.duet-date__input-wrapper > button").click();
    const dobChunks = userDob.split('/');
    const picker = await waitForElm("#birthDateComponent > div > div.duet-date__dialog.is-active > div");
    if (!picker) {
        console.error('Date picker not found.');
        return;
    }
    if (dobChunks.length === 3) {
        console.warn('Picking date in datepicker to commit DOB selection.');
        async function clickDateButton(day) {
            const button = Array.from(document.querySelectorAll('.duet-date__day'))
                .find(btn => btn.querySelector('span[aria-hidden="true"]')?.textContent.trim() === String(day));

            if (button) {
                await new Promise(resolve => setTimeout(resolve, 500));
                console.warn("Clicking day button: ", day);
                button.click();
            } else {
                console.warn(`Date ${day} not found.`);
            }
        }

        await clickDateButton(dobChunks[0]);
        await new Promise(resolve => setTimeout(resolve, 250));
        dobInput.click();
        dobInput.focus();
    } else {
        console.error('Invalid DOB format. It should be in format DD/MM/YYYY');
    }
}

const userName = process.env.USER_NAME
const userEmail = process.env.USER_EMAIL
const userPhone = process.env.USER_PHONE
const userPassportNumber = process.env.USER_PASSPORT_NUMBER
const userCitizenship = process.env.USER_CITIZENSHIP
const userJmbg = process.env.USER_JMBG
const userDob = process.env.USER_DOB
const userApplicantsNumber = process.env.USER_APPLICANTS_NUMBER

const FormData = {
    userName,
    userEmail,
    userPhone,
    userCitizenship,
    userPassportNumber,
    userJmbg,
    userDob,
    userApplicantsNumber
}

const scriptsString = `
const simulateTyping = ${simulateTyping.toString()}
const autoFormFiller = ${autoFormFiller.toString()}
const waitForElm = ${_waitForElm.toString()}
waitForElm('body h1').then((elm) => {
    console.warn('Element is ready');
    autoFormFiller(${JSON.stringify(FormData)}, ${_waitForElm.toString()})
});
`

module.exports = { scriptsString }