const contexts = [
  "FunctionExpression",
  "FunctionDeclaration",
  "MethodDefinition",
  "PropertyDefinition",
  "TSInterfaceDeclaration",
  "TSPropertySignature",
]
const required = {
  ClassDeclaration: true,
  ClassExpression: true,
  FunctionExpression: true,
  FunctionDeclaration: true,
  MethodDefinition: true,
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
    "jsdoc/require-jsdoc": [
      "warn",
      {
        contexts,
        publicOnly: { ancestorsOnly: true },
        require: required,
      },
    ],
    "jsdoc/require-description": ["warn"],
    "jsdoc/require-description-complete-sentence": ["error"],
    "jsdoc/require-param": ["warn"],
    "jsdoc/require-param-description": ["warn"],
    "jsdoc/require-param-name": ["warn"],
    "jsdoc/require-param-type": ["off"],
    "jsdoc/require-returns": ["off"],
    "jsdoc/require-yields": ["off"],
    "prettier/prettier": "error",
    "sort-imports": ["error", { allowSeparatedGroups: true }],
    "tsdoc/syntax": "warn",
  },
  settings: {
    jsdoc: {
      mode: "typescript",
    },
  },
}
