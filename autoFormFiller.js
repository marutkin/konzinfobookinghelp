function simulateTyping(targetElement, text) {
    if(!text) {
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

    const { userName, userEmail, userPhone, userCitizenship, userPassportNumber, userJmbg } = formData

    // Modal (Location) open.
    const selectLocation = await waitForElm("#label1 > button")
    selectLocation.click()

    await waitForElm('#modal2 > div > div > div.modal-body')
    await waitForElm('#modal2 > div > div > div.modal-body > div:nth-child(81) > label')

    await new Promise(resolve => setTimeout(resolve, 1000));

    const [serbiaLocationOption] = Array.from(
        document.querySelectorAll('label'),
    ).filter(element => element.textContent.includes('Serbia - Belgrade'));

    if (serbiaLocationOption) {
        serbiaLocationOption.click()
    } else {
        const serbiaLocationOptionAlt = await waitForElm("#modal2 > div > div > div.modal-body > div:nth-child(81) > label")
        serbiaLocationOptionAlt.click()
    }

    // Modal (Application) open.
    const selectApplication = await waitForElm('#label3 > button')
    selectApplication.click()

    await new Promise(resolve => setTimeout(resolve, 500));
    const shortTermVisaOption = findDOMNodeByContent("Visa application (Schengen visa- type 'C')")
    await new Promise(resolve => setTimeout(resolve, 500));

    shortTermVisaOption.children[0].click()

    await new Promise(resolve => setTimeout(resolve, 500));

    const saveApplicationBtn = await waitForElm('#modalCases > div > div > div.modal-footer.bg-light > button.btn.btn-success')
    await new Promise(resolve => setTimeout(resolve, 500));

    saveApplicationBtn.click()

    await new Promise(resolve => setTimeout(resolve, 500));

    console.warn('Inserting PHI data...')
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