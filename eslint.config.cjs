const {
    defineConfig,
    globalIgnores,
} = require("eslint/config");

const {
    fixupConfigRules,
    fixupPluginRules,
} = require("@eslint/compat");

const _import = require("eslint-plugin-import");
const eslintComments = require("eslint-plugin-eslint-comments");
const functional = require("eslint-plugin-functional");
const tsParser = require("@typescript-eslint/parser");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([globalIgnores(["**/node_modules", "**/build", "**/coverage"]), {
    extends: fixupConfigRules(compat.extends(
        "eslint:recommended",
        "plugin:eslint-comments/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/typescript",
        "plugin:functional/lite",
        "prettier",
        "prettier/@typescript-eslint",
    )),

    plugins: {
        import: fixupPluginRules(_import),
        "eslint-comments": fixupPluginRules(eslintComments),
        functional: fixupPluginRules(functional),
    },

    languageOptions: {
        globals: {
            BigInt: true,
            console: true,
            WebAssembly: true,
        },

        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            project: "./tsconfig.json",
        },
    },

    rules: {
        "@typescript-eslint/explicit-module-boundary-types": "off",

        "eslint-comments/disable-enable-pair": ["error", {
            allowWholeFile: true,
        }],

        "eslint-comments/no-unused-disable": "error",

        "import/order": ["error", {
            "newlines-between": "always",

            alphabetize: {
                order: "asc",
            },
        }],

        "sort-imports": ["error", {
            ignoreDeclarationSort: true,
            ignoreCase: true,
        }],
    },
}]);