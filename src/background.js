import browser from "webextension-polyfill";

// console.log("background loaded");

async function sendCheckTwitterPageMessage(tabId) {
  try {
    const tab = await browser.tabs.get(tabId);
    if (tab.url.includes("twitter.com") || tab.url.includes("x.com")) {
      await browser.tabs.sendMessage(tabId, { action: "checkTwitterPage" });
    }
  } catch (error) {
    console.error("Error sending message to content script:", error);
  }
}

browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "complete") {
    sendCheckTwitterPageMessage(tabId);
  }
});

browser.tabs.onActivated.addListener((activeInfo) => {
  sendCheckTwitterPageMessage(activeInfo.tabId);
});

browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    browser.storage.local.set({ isEnabled: true, homeOnly: true });
  }
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSettings") {
    browser.storage.local.get(["isEnabled", "homeOnly"]).then((result) => {
      sendResponse(result);
    });
    return true; // Indicates that the response will be sent asynchronously
  } else if (request.action === "setSettings") {
    browser.storage.local.set(request.settings).then(async () => {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tab.url.includes("twitter.com") || tab.url.includes("x.com")) {
        try {
          await browser.tabs.sendMessage(tab.id, {
            action: "checkTwitterPage",
          });
        } catch (error) {
          console.error("Error sending message to content script:", error);
        }
      }
      sendResponse({ success: true });
    });
    return true;
  }
});
