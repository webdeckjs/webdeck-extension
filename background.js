// Request listener
console.log("hello from background.js 3");
chrome.runtime.onMessageExternal.addListener(
  async (request, sender, sendResponse) => {
    console.log("onMessageExternal", sender, request);
    if (request) {
      switch (request?.type) {
        case "health":
          sendResponse({
            extension: true,
            manifest: chrome.runtime.getManifest(),
            runtime: chrome.runtime.id,
          });
          break;
        case "fetch":
          const { method, url, body, options } = request;
          try {
            const resp = await fetch(url, { method, body, ...options });
            const json = await resp.json();
            sendResponse(json);
          } catch (e) {
            console.log(e);
            sendResponse({ error: true, e });
          }
          break;
        case "get.data":
          chrome.storage.sync.get("data", function (items) {
            if (!chrome.runtime.error) {
              sendResponse(items);
            } else {
              sendResponse({ error: true, e: chrome.runtime.error });
            }
          });
          break;
        case "set.data":
          const { data } = request;
          chrome.storage.sync.set(data, function () {
            if (!chrome.runtime.error) {
              sendResponse({ success: true });
            } else {
              sendResponse({ error: true, e: chrome.runtime.error });
            }
          });
          break;
        default:
          sendResponse({ error: true, e: "invalid option" });
          break;
      }
      return;
    }
    sendResponse({ error: true });
  }
);

// Storage listener
chrome.storage.onChanged.addListener(async (update) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.storage.sync.get("data", function (data) {
      chrome.tabs.sendMessage(tabs[0].id, { data: data.data, update });
    });
    // chrome.tabs.sendMessage(tabs[0].id, data);
  });
});
