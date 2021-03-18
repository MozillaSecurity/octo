const paramContexts = ["FunctionExpression", "FunctionDeclaration", "MethodDefinition"]
const requireOptions = {}
for (const context of [...paramContexts, "ClassDeclaration", "ClassExpression"]) {
  requireOptions[context] = true
}

module.exports = {
  env: {
    es2020: true,
    node: true,
  },
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.eslint.json",
  },
  plugins: ["@typescript-eslint", "eslint-plugin-tsdoc", "jest", "jsdoc", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
    "plugin:jsdoc/recommended",
    "prettier",
  ],
  rules: {
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "jsdoc/require-jsdoc": ["warn", { require: requireOptions }],
    "jsdoc/require-description": ["warn", { contexts: ["any"] }],
    "jsdoc/require-description-complete-sentence": ["warn"],
    "jsdoc/require-param": ["warn", { contexts: paramContexts }],
    "jsdoc/require-param-description": ["warn", { contexts: paramContexts }],
    "jsdoc/require-param-name": ["warn", { contexts: paramContexts }],
    "jsdoc/require-param-type": ["off"],
    "jsdoc/require-returns": ["off"],
    "sort-imports": ["error", { allowSeparatedGroups: true }],
    "tsdoc/syntax": "warn",
  },
}
