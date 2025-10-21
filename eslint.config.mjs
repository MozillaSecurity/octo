/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import globals from "globals"
import jest from "eslint-plugin-jest"
import js from "@eslint/js"
import jsdoc from "eslint-plugin-jsdoc"
import prettier from "eslint-plugin-prettier"
import tsdoc from "eslint-plugin-tsdoc"
import typescriptEslint from "@typescript-eslint/eslint-plugin"
import typescriptParser from "@typescript-eslint/parser"

export default [
  // Core JavaScript ESLint recommended configuration
  {
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      "sort-imports": [
        "error",
        {
          ignoreCase: false,
          ignoreDeclarationSort: false,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
          allowSeparatedGroups: true,
        },
      ],
    },
  },

  // TypeScript Configuration (with direct parser and rules)
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: "./tsconfig.eslint.json", // Points to your TypeScript config
      },
    },
    plugins: { "@typescript-eslint": typescriptEslint },
    rules: {
      ...typescriptEslint.configs.recommended.rules,
      ...typescriptEslint.configs.stylistic.rules,
      // ...typescriptEslint.configs["recommended-requiring-type-checking"].rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },

  // JSDoc Configuration
  {
    plugins: { jsdoc },
    rules: {
      ...jsdoc.configs["flat/recommended-typescript"].rules,
      "jsdoc/check-param-names": ["error", { checkDestructured: false }],
      "jsdoc/require-jsdoc": [
        "error",
        {
          publicOnly: { ancestorsOnly: true },
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
          },
          contexts: [
            "TSTypeAliasDeclaration",
            "TSInterfaceDeclaration",
            "TSPropertySignature",
            "PropertyDefinition",
            "FunctionExpression",
            "ArrowFunctionExpression",
          ],
        },
      ],
      "jsdoc/require-description": ["warn", { checkConstructors: false }],
      "jsdoc/require-description-complete-sentence": ["error"],
      "jsdoc/require-param": ["error", { checkDestructured: false }],
      "jsdoc/require-returns": ["off"],
      "jsdoc/require-yields": ["off"],
    },
  },

  // Jest Configuration with environment for test files
  {
    files: ["**/*.test.ts"],
    plugins: { jest },
  },

  // Prettier Configuration
  {
    plugins: { prettier },
    rules: {
      ...prettier.configs.recommended.rules, // Integrate Prettier rules
      "prettier/prettier": "error", // Ensure Prettier issues are flagged as errors
    },
  },

  // TSDoc Configuration
  {
    plugins: {
      tsdoc: tsdoc,
    },
    rules: {
      "tsdoc/syntax": "warn",
    },
  },
]
