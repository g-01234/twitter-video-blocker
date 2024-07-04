console.log("content loaded");

let observer;

function hideTweetsWithVideos() {
  // console.log("Hiding tweets with videos");
  try {
    document
      .querySelectorAll('[data-testid="tweet"]:not([vb-blocked])')
      .forEach((tweet) => {
        const videoElement = tweet.querySelector(
          'video[aria-label="Embedded video"]'
        );
        if (videoElement) {
          // console.log("Video element detected");
          tweet.style.display = "none";
          tweet.setAttribute("vb-blocked", true);
        }
      });
  } catch (error) {
    console.error("Error hiding tweets with videos:", error);
  }
}

function showHiddenTweets() {
  // console.log("Showing hidden tweets");
  try {
    document
      .querySelectorAll('[data-testid="tweet"][vb-blocked]')
      .forEach((tweet) => {
        tweet.style.display = "";
        tweet.removeAttribute("vb-blocked");
      });
  } catch (error) {
    console.error("Error showing hidden tweets:", error);
  }
}

function toggleObserver(enable) {
  if (enable && !observer) {
    observer = new MutationObserver(hideTweetsWithVideos);
    // TODO wait for the timeline to populate and update observer to watch that instead
    observer.observe(document.body, { childList: true, subtree: true });
  } else if (!enable && observer) {
    observer.disconnect();
    observer = null;
  }
}

function setActivation(isEnabled, homeOnly) {
  // console.log("setActivation", isEnabled, homeOnly);
  if (
    isEnabled &&
    (!homeOnly ||
      document.location.pathname === "/" ||
      document.location.pathname === "/home")
  ) {
    hideTweetsWithVideos();
    toggleObserver(true);
  } else {
    showHiddenTweets();
    toggleObserver(false);
  }
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // console.log("onMessage", request);
  if (request.action === "checkTwitterPage") {
    // faster than sending a getSettings?
    browser.storage.local.get(["isEnabled", "homeOnly"]).then((result) => {
      setActivation(result.isEnabled, result.homeOnly);
    });
  }
});
