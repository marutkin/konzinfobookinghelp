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

function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
        const observer = new MutationObserver(() => {
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

// User Date of Birth
async function dobPickerClick(dobInput, userDob) {
    dobInput.click();
    dobInput.focus();

    await sleep(250);

    // Click on the date picker button.
    document.querySelector("#birthDateComponent > div > div.duet-date__input-wrapper > button").click();

    const dobChunks = userDob.split('/');
    const picker = await waitForElement("#birthDateComponent > div > div.duet-date__dialog.is-active > div");

    if (!picker) {
        console.error('Date picker not found.');
        return;
    }

    if (dobChunks.length !== 3) {
        console.error('Invalid DOB format. It should be in format DD/MM/YYYY');
        return;
    }

    console.warn('Picking date in datepicker to commit DOB selection.');
    async function clickDateButton(day) {
        const button = Array.from(document.querySelectorAll('.duet-date__day'))
            .find(btn => btn.querySelector('span[aria-hidden="true"]')?.textContent.trim() === String(day));

        if (button) {
            await sleep();
            console.warn("Clicking day button: ", day);
            button.click();
        } else {
            console.warn(`Date ${day} not found.`);
        }
    }

    await clickDateButton(dobChunks[0]);
    await sleep(250);
    dobInput.click();
    dobInput.focus();
}

function sleep(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Export the functions
module.exports = {
    simulateTyping,
    waitForElement,
    lockUserInteraction,
    unlockUserInteraction,
    findDOMNodeByContent,
    dobPickerClick,
    sleep
};