console.log("popup loaded");

document.addEventListener("DOMContentLoaded", function () {
  const hideVideoSwitch = document.getElementById("hideVideoSwitch");
  const homeOnlySwitch = document.getElementById("homeOnlySwitch");
  const homeOnlyContainer = homeOnlySwitch.closest(".switch-container");

  function updateUI(isEnabled, homeOnly) {
    hideVideoSwitch.checked = isEnabled;
    homeOnlySwitch.checked = homeOnly;
    homeOnlyContainer.style.display = isEnabled ? "flex" : "none";
  }

  function toggleHideVideo(isEnabled) {
    // console.log("popup sending isEnabled", isEnabled);
    browser.runtime
      .sendMessage({ action: "setSettings", settings: { isEnabled } })
      .then(() => {
        updateUI(isEnabled, homeOnlySwitch.checked);
      });
  }

  function toggleHomeOnly(homeOnly) {
    // console.log("popup sending homeOnly", homeOnly);
    browser.runtime
      .sendMessage({ action: "setSettings", settings: { homeOnly } })
      .then(() => {
        updateUI(hideVideoSwitch.checked, homeOnly);
      });
  }

  browser.runtime.sendMessage({ action: "getSettings" }).then((data) => {
    // console.log("data", data.isEnabled, data.homeOnly);
    const isEnabled = data.isEnabled !== undefined ? data.isEnabled : true;
    const homeOnly = data.homeOnly !== undefined ? data.homeOnly : true;
    updateUI(isEnabled, homeOnly);
    // console.log("getSettings", isEnabled, homeOnly);
  });

  hideVideoSwitch.addEventListener("change", () => {
    toggleHideVideo(hideVideoSwitch.checked);
  });

  homeOnlySwitch.addEventListener("change", () => {
    toggleHomeOnly(homeOnlySwitch.checked);
  });
});
