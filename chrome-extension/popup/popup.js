const getCurrentTab = async () => {
	let queryOptions = { active: true, currentWindow: true };
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}


const main = async () => {
  const btnElement = document.querySelector("#btn")
  if(!btnElement) return

  btnElement.addEventListener("click", async () => {
    const tab = await getCurrentTab()

    await chrome.scripting.insertCSS({
      files: ["scripts/style.css"],
      target: { tabId: tab.id },
    });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["scripts/script.js"]
    });
  })
}




main()