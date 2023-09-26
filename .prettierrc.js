const baseConfig = require("@axieinfinity/eslint-config-ronin/config/prettier.cjs")

module.exports = {
  ...baseConfig,
  plugins: [require("prettier-plugin-tailwindcss")],
}
