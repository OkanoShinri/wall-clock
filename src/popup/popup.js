browser.storage.local
    .get()
    .then((restoredSettings) => {
        if ("timezone" in restoredSettings) {
            document.getElementById("time_zone").value = restoredSettings.timezone;
        } else {
            document.getElementById("time_zone").value = "none"
        }
        if ("fontsize" in restoredSettings) {
            document.getElementById("font-size-input").value = restoredSettings.fontsize;
        } else {
            document.getElementById("font-size-input").value = 32
        }
        if ("fontfamily" in restoredSettings) {
            document.getElementById("custom-font-input").value = restoredSettings.fontfamily;
        } else {
            document.getElementById("custom-font-input").value = "Cutive Mono"
        }
    })
    .catch((e) => {
        console.error(`Failed : ${e.message}`);
    });


browser.tabs
    .query({
        currentWindow: true,
        active: true,
    })
    .then(queryDisplayStatus)
function queryDisplayStatus(tabs) {
    browser.tabs
        .sendMessage(tabs[0].id, {
            command: "tell_me_display_style"
        })
        .then((response) => {
            document.getElementById("display_check").checked = !(response.response == "none");
        })
}

document.getElementById("display_check").addEventListener("change", () => {
    browser.tabs
        .query({
            currentWindow: true,
            active: true,
        })
        .then(sendDisplayStatus)
});
function sendDisplayStatus(tabs) {
    browser.tabs.sendMessage(tabs[0].id, {
        command: "toggle_clock",
        checked: document.getElementById("display_check").checked
    });
};


document.getElementById("font-size-input").addEventListener("change", () => {
    browser.storage.local.set({ fontsize: document.getElementById("font-size-input").value });
});
document.getElementById("custom-font-input").addEventListener("input", () => {
    browser.storage.local.set({ fontfamily: document.getElementById("custom-font-input").value });
});
document.getElementById("time_zone").addEventListener("change", () => {
    browser.storage.local.set({ timezone: document.getElementById("time_zone").value });
});