// nothing here

console.log("hello from content.js 1");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  window.postMessage(request);
});
