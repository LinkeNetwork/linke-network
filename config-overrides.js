const {
  override,
  addWebpackAlias,
} = require("customize-cra");
const path = require("path");
module.exports = {
  webpack: override(
    addWebpackAlias({
      "@": path.resolve(__dirname, "./src"),
      'numeric-keyboard$': 'numeric-keyboard/dist/numeric_keyboard.react.js'
    }),
    (config) => {
      console.log("config", config);
      config.devtool =
        config.mode === "development" ? "cheap-module-source-map" : false;
      if (process.env.NODE_ENV === "production") {
        config.plugins = [...config.plugins];
      }
      let loaders = config.module.rules.find((rule) =>
        Array.isArray(rule.oneOf)
      ).oneOf;
      return config;
    }
  ),
};
