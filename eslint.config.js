import js from "@eslint/js";
import solid from "eslint-plugin-solid/configs/typescript.js";
import * as tsParser from "@typescript-eslint/parser";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";


export default [
  js.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    files: ["src/**/*.{ts,tsx,mts}"],
    ...solid,
    languageOptions: {
      globals: {
        ...globals.browser
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
      "solid/reactivity": ["error", { 
        customReactiveFunctions: ["createDebounce"],
      }]
    }
  }
];