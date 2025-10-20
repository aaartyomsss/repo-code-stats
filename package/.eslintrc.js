module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  env: {
    node: true,
    es2020: true,
  },
  rules: {
    // TypeScript specific rules
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",

    // General ESLint rules
    "no-console": "off", // Allow console.log for this library
    "no-unused-vars": "off", // Handled by @typescript-eslint/no-unused-vars
    "no-var": "error",
    "prefer-const": "error",
    "eol-last": ["error", "always"],
    "no-trailing-spaces": "error",
    semi: ["error", "never"],
    quotes: ["error", "double"],
  },
  ignorePatterns: [
    "dist/",
    "node_modules/",
    "*.js", // Ignore JS files in root (like bump-version.js)
    "tests/**/testDir/**", // Ignore test data files
  ],
}
