const { defineConfig, globalIgnores } = require("eslint/config");
const babelParser = require("@babel/eslint-parser");
const typescriptParser = require("@typescript-eslint/parser");
const js = require("@eslint/js");
const globals = require("globals");

module.exports = defineConfig([
  globalIgnores([
    "**/config/**",
    "**/node_modules/**",
    "**/dist/**",
    "**/coverage/**",
    "**/build/**",
    "**/public/**",
    "**/mock/**",
    "**/test/**",
    "**/reports/**",
    "eslint.config.js",
  ]),
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: typescriptParser,
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2025,
        $: "readonly",
        jQuery: "readonly",
        IS_PRODUCTION: "readonly",
        isArray: "readonly",
      },
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: {
      js,
    },
    extends: ["js/recommended"],
    rules: {
      semi: "error",
      "prefer-const": "error",
    },
  },
]);
