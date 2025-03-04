import js from "@eslint/js";
import * as tsParser from "@typescript-eslint/parser";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  js.configs.recommended,
  eslintPluginPrettierRecommended,
  reactRefresh.configs.vite,
  {
    files: ["src/**/*.{ts,tsx,mts}"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parser: tsParser,
      parserOptions: {
        project: "tsconfig.json",
      },
    },
  },
  {
    files: ["src/**/*.{ts,tsx,mts}"],
    rules: {
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    }
  }
];