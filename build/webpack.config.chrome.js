const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    background: path.resolve(__dirname, "..", "src", "background.js"),
    content: path.resolve(__dirname, "..", "src", "content.js"),
    popup: path.resolve(__dirname, "..", "src", "popup.js"),
  },
  output: {
    path: path.resolve(__dirname, "..", "dist", "chrome"),
    filename: "[name].js",
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, "..", "manifest.json") },
        { from: path.resolve(__dirname, "..", "src", "index.html") },
        { from: path.resolve(__dirname, "..", "src", "styles.css") },
        {
          from: path.resolve(
            __dirname,
            "..",
            "node_modules",
            "webextension-polyfill",
            "dist",
            "browser-polyfill.min.js"
          ),
        },
        // Add the following lines to copy the icon files
        {
          from: path.resolve(__dirname, "..", "icons", "novideo_128.png"),
          to: "icons/novideo_128.png",
        },
        {
          from: path.resolve(__dirname, "..", "icons", "novideo_48.png"),
          to: "icons/novideo_48.png",
        },
        {
          from: path.resolve(__dirname, "..", "icons", "novideo_16.png"),
          to: "icons/novideo_16.png",
        },
      ],
    }),
  ],
  mode: "production",
};
