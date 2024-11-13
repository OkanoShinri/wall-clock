// 保存ボタンがクリックされたときの処理
document.getElementById("save-button").addEventListener("click", async () => {
  const fontFamily = document.getElementById("font-select").value;
  await browser.storage.sync.set({ fontFamily });
  console.log("フォントが保存されました！");
});

// ページ読み込み時に現在の設定を反映
async function loadSettings() {
  const { fontFamily } = await browser.storage.sync.get("fontFamily");
  if (fontFamily) {
    document.getElementById("font-select").value = fontFamily;
  }
}

loadSettings();
