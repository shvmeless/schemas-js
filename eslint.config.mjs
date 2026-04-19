// IMPORTS
import globals from 'globals'
import javascript from '@eslint/js'
import typescript from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig } from "eslint/config"

// CONFIG
export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js: javascript },
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
  javascript.configs.recommended,
  typescript.configs.recommended,
  stylistic.configs.recommended,
  {
    rules: {
      // STYLISTIC
      '@stylistic/padded-blocks': 'off',
      '@stylistic/arrow-parens': ['error', 'always'],
      "@stylistic/brace-style": ["error", "1tbs", { "allowSingleLine": true }],
      '@stylistic/quotes': ["error", "single", {
        "avoidEscape": true,
        "allowTemplateLiterals": "avoidEscape",
      }],

      // TYPESCRIPT
      '@typescript-eslint/array-type': ['error', { default: 'generic', readonly: 'generic' }],

      // SAFETY
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-declaration-merging': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-enum-comparison': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-unary-minus': 'error',

      // STRICT
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "no-invalid-this": "off",
      "@typescript-eslint/no-invalid-this": "error",
      "@typescript-eslint/unbound-method": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "consistent-return": "off",
      "@typescript-eslint/consistent-return": "error",
      "no-fallthrough": "error",
      "@typescript-eslint/explicit-member-accessibility": "error",
      "dot-notation": "off",
      "@typescript-eslint/dot-notation": ["error", {
        "allowPrivateClassPropertyAccess": false,
        "allowProtectedClassPropertyAccess": false,
        "allowIndexSignaturePropertyAccess": false,
      }],
      "@typescript-eslint/use-unknown-in-catch-callback-variable": "error",
    }
  },
  {
    ignores: [
      'eslint.config.mjs',
      'vitest.config.js',
      'node_modules',
      'dist',
    ]
  },
])
