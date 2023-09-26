module.exports = {
  root: true,
  extends: ["@axieinfinity/ronin", "plugin:@next/next/recommended"],
  rules: {
    "@next/next/no-img-element": "off",
  },

  ignorePatterns: [".swc", ".next", "out", "node_modules", "contracts"],
}
