browser.storage.local
    .get()
    .then((restoredSettings) => {
        // document.getElementById("font_select").value =
        //     restoredSettings.font;
        if (restoredSettings.timezone != {}) {
            document.getElementById("time_zone").value =
                restoredSettings.timezone;
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


document.getElementById("time_zone").addEventListener("change", () => {
    browser.storage.local.set({ timezone: document.getElementById("time_zone").value });
});
