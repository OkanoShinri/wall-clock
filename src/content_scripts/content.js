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
    browser.storage.local.get().then((response) => {
      const timezone = response.timezone
      const now = new Date();
      let timeString = now.toLocaleTimeString();

      if (timezone != {} && timezone != "none") {
        timeString = now.toLocaleTimeString([], { timeZone: timezone });
      }
      clockDiv.textContent = timeString;

      const fontsize = response.fontsize
      if (fontsize != {}) {
        clockDiv.style.fontSize = fontsize + "px"
        clockDiv.style.borderRadius = fontsize * 0.2 + "px"
      }
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
// スタイルシートを動的に作成して、Google Fontsを読み込む
browser.storage.local.get().then((response) => {
  let fontfamily = response.fontfamily
  if (typeof fontfamily === "undefined" || fontfamily == "") {
    fontfamily = "Cutive Mono"
  }
  function sanitize(text) {
    let sanitizedText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return sanitizedText.replace(/\s+/g, '+');
  }
  const style = document.createElement('style');
  style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=${sanitize(fontfamily)}&display=swap&text=0123456789%3A');
  #clock-extension {
  font-family:
        "${fontfamily}", 'Liberation Serif', Monospace;
  }
`;
  document.head.appendChild(style);
})

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