// Shared ESLint flat config for all Next.js apps in the monorepo
// Usage in an app: import sharedConfig from "@yogesh/config/eslint";
import { defineConfig } from "eslint/config";
import nextPlugin from "eslint-config-next";

/** @type {import("eslint").Linter.Config[]} */
export default defineConfig([
  ...nextPlugin.flatConfigs["core-web-vitals"],
  {
    rules: {
      // Allow unused vars prefixed with _
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      // Relax explicit any in development
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]);
