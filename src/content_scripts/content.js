function createClock() {
  // 既にスクリプトが走ったか確認
  if (document.getElementById("clock-extension")) {
    return;
  }

  const clockDiv = document.createElement("div");
  clockDiv.id = "clock-extension";
  document.body.appendChild(clockDiv);

  // const fontFamily = browser.storage.local.get("font");

  // if (fontFamily) {
  //   clockDiv.style.fontFamily = fontFamily;
  // }

  function updateClock() {
    browser.storage.local.get("timezone").then((response) => {
      const timezone = response.timezone
      const now = new Date();
      let timeString = now.toLocaleTimeString();

      if (timezone != {} && timezone != "none") {
        timeString = now.toLocaleTimeString([], { timeZone: timezone });
      }
      clockDiv.textContent = timeString;
    })

  }

  setInterval(updateClock, 100);
  updateClock();
}

// ページの変更を監視する関数
//window.addEventListener("load")だとリロード時に走らない
//しゃーないのでDOMの変更を見る
function observeDOMChanges() {
  const observer = new MutationObserver(() => {
    createClock();
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

observeDOMChanges();
createClock();

browser.runtime.onMessage.addListener((message) => {

  let response = "Hi"

  if (!message.command) {
    return;
  }
  switch (message.command) {
    case "toggle_clock": {
      let display_style = "none"
      if (message.checked)
        display_style = "block"
      document.getElementById("clock-extension").style.display = display_style
    }
    case "tell_me_display_style": {
      response = document.getElementById("clock-extension").style.display;
    }
    default:
      break;
  }

  return Promise.resolve({ response: response });
});