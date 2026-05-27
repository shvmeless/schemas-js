// IMPORTS
import globals from 'globals'
import javascript from '@eslint/js'
import typescript from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig } from 'eslint/config'

// CONFIG
export default defineConfig ([
  {
    ignores: ['**/.*', 'node_modules', 'dist'],
  },
  {
    files: [
      './src/**/*.{js,mjs,cjs,ts,mts,cts}',
      './tests/**/*.{js,mjs,cjs,ts,mts,cts}',
    ],
    extends: [
      javascript.configs.recommended,
      typescript.configs.recommended,
      stylistic.configs.recommended,
    ],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      // STYLISTIC
      '@stylistic/padded-blocks': 'off',
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/function-call-spacing': ['error', 'never'],
      '@stylistic/type-generic-spacing': ["error"],
      '@stylistic/brace-style': ['error', '1tbs', {
        allowSingleLine: true
      }],
      '@stylistic/space-before-function-paren': ['error', {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
        catch: 'always'
      }],
      '@stylistic/quotes': ['error', 'single', {
        avoidEscape: true,
        allowTemplateLiterals: 'avoidEscape',
      }],

      // TYPESCRIPT
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/array-type': ['error', {
        default: 'generic',
        readonly: 'generic'
      }],

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
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-member-accessibility': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/unbound-method': 'error',
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'error',
      'no-invalid-this': 'off',
      '@typescript-eslint/no-invalid-this': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      'consistent-return': 'off',
      '@typescript-eslint/consistent-return': 'error',
      'dot-notation': 'off',
      '@typescript-eslint/dot-notation': ['error', {
        allowPrivateClassPropertyAccess: false,
        allowProtectedClassPropertyAccess: false,
        allowIndexSignaturePropertyAccess: false,
      }],
    },
  },
])
