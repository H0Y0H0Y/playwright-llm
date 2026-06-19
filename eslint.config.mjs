import typescript from "@typescript-eslint/eslint-plugin";
import playwright from "eslint-plugin-playwright";
import typescriptParser from "@typescript-eslint/parser";
import stylistic from "@stylistic/eslint-plugin";
import { plugin } from "typescript-eslint";

export default [
    {
        ignores: ["dist/"]
    },
    {
        files: ["**/*.ts", "**/*.tsx"],
        plugins: {
            "@typescript-eslint": typescript,
            "@stylistic": stylistic,
        },
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module"
            }
        },
        rules: {
            ...typescript.configs.recommended.rules,
            "no-console": "warn",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_"
                }
            ],
            "no-unused-expressions": "off",
            "@typescript-eslint/no-unused-expressions": "off",
            "@stylistic/padding-line-between-statements": [
                "error",
                { blankLine: "always", prev: "function", next: "function" },
                { blankLine: "always", prev: "class", next: "class" },
                { blankLine: "always", prev: "block", next: "*" },
                { blankLine: "always", prev: "block-like", next: "*" },
                { blankLine: "always", prev: "import", next: "*" },
                { blankLine: "never", prev: "import", next: "import" },
                { blankLine: "always", prev: "export", next: "*" },
                { blankLine: "always", prev: "const", next: "*" },
                { blankLine: "never", prev: "const", next: "const" },
                { blankLine: "always", prev: "let", next: "*" },
                { blankLine: "never", prev: "let", next: "let" },
                { blankLine: "always", prev: "var", next: "*" },
                { blankLine: "never", prev: "var", next: "var" },
                { blankLine: "always", prev: "*", next: "return" }
            ],
            "@stylistic/arrow-spacing": ["error", {
                "before": true,
                "after": true
            }],
            "@stylistic/space-before-blocks": ["error"],
            "@stylistic/type-annotation-spacing": ["error"],
            "@stylistic/array-bracket-spacing": ["error"],
            "@stylistic/block-spacing": ["error"],
            "@stylistic/brace-style": ["error", "1tbs", { "allowSingleLine": true }],
            "@stylistic/comma-spacing": ["error", {
                "before": false,
                "after": true
            }],
            "@stylistic/function-call-spacing": ["error", "never"],
            "@stylistic/key-spacing": ["error", {
                "beforeColon": false,
                "afterColon": true,
                "mode": "strict"
             }],
            "@stylistic/keyword-spacing": ["error", {
                "before": true,
                "after": true
             }],
            "@stylistic/lines-between-class-members": ["error", "always", {
                "exceptAfterSingleLine": true
            }],
            "@stylistic/object-curly-spacing": ["error", "always"],
            "@stylistic/no-floating-decimal": "error",
            "@stylistic/no-multi-spaces": "error",
            "eol-last": ["error", "always"],
            "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1 }],
            "@stylistic/semi": ["error", "always"]
        }
    },
    {
        files: ["**/*.ts", "**/*.tsx"],
        plugins: {
            "playwright": playwright
        },
        rules: {
            ...playwright.configs["flat/recommended"].rules
        }
    }
]
