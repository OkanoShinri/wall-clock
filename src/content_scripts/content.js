function createClock() {
  // 既にスクリプトが走ったか確認
  if (document.getElementById("clock-extension")) {
    return;
  }

  const clockDiv = document.createElement("div");
  clockDiv.id = "clock-extension";
  document.body.appendChild(clockDiv);

  // TODO:
  // フォント設定を取得したい
  //const { fontFamily } = await browser.storage.sync.get("fontFamily");

  //if (fontFamily) {
  //  clockDiv.style.fontFamily = fontFamily;
  //}

  function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    clockDiv.textContent = timeString;
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
