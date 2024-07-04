const fs = require("fs");
const path = require("path");

const manifestPath = path.join(
  __dirname,
  "..",
  "dist",
  "firefox",
  "manifest.json"
);

// Read the Chrome manifest
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

// Firefox Manifest V3 adjustments
manifest.manifest_version = 3;

// Convert background service_worker to background.scripts
if (manifest.background && manifest.background.service_worker) {
  manifest.background = {
    scripts: [manifest.background.service_worker],
    type: "module",
  };
}

// Add Firefox-specific settings
manifest.browser_specific_settings = {
  gecko: {
    id: "whocares@exex.com",
  },
};

// Write the Firefox manifest
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log("Firefox Manifest V3 created successfully.");
