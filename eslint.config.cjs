const { defineConfig } = require("eslint/config");
const babelParser = require("@babel/eslint-parser");

module.exports = defineConfig([
	{
    languageOptions:{
      parser: babelParser
    },
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/coverage/**",
      "**/build/**",
      "**/public/**",
      "eslint.config.cjs"
    ],
		rules: {
			semi: "error",
			"prefer-const": "error",
		},
	},
]);