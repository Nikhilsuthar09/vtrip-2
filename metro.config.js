// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
config.transformer.minifierConfig = {
  compress: {
    // The option below removes all console logs statements in production.
    drop_console: ["log", "error"],
  },
};

module.exports = config;
