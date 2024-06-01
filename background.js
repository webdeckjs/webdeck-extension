// Request listener
console.log("hello from background.js 2");
chrome.runtime.onMessageExternal.addListener(
  async (request, sender, sendResponse) => {
    console.log("Received message from", sender, request);
    if (request) {
      switch (request?.type) {
        case "health":
          sendResponse({
            extension: true,
            manifest: chrome.runtime.getManifest(),
            runtime: chrome.runtime.id,
          });
          console.log(chrome);
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
        default:
          sendResponse({ error: true });
          break;
      }
      return;
    }
    sendResponse({ error: true });
  }
);
