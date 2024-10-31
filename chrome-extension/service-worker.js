const getCurrentTab = async () => {
	let queryOptions = { active: true, currentWindow: true };
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}

const dataURItoBlob = (dataURI) => {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  //New Code
  return new Blob([ab], {type: mimeString});
}

chrome.runtime.onMessage.addListener(async (message) => {
  if(message.type === "capture") {
    const screenshotDataUrl = await chrome.tabs.captureVisibleTab()
    const screenshotBlob = dataURItoBlob(screenshotDataUrl)

    const formData = new FormData()
    formData.append("message", message.issue)
    formData.append("screenshotSizeString", JSON.stringify(message.screenshotSize))
    formData.append("elementRectString", JSON.stringify(message.elementRect))
    formData.append("screenshot", screenshotBlob)

    await fetch("http://localhost:8080/issues", {
      method: "POST",
      body: formData
    })
    
    return;
  }
});
