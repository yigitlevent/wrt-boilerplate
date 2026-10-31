import eslint from '@eslint/js'
import pStylistic from '@stylistic/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'
import pJson from 'eslint-plugin-json'
import pReact from 'eslint-plugin-react'
import pReactHooks from 'eslint-plugin-react-hooks'
import pReactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tsEslint from 'typescript-eslint'

const tsFilePatterns = ['**/*.{ts,tsx}']

export default defineConfig([
  globalIgnores([
    '**/.tests/**',
    '**/build/**',
    '**/dist/**',
    '**/gen/**',
    '**/node_modules/**/*',
    '**/out/**',
    '**/target/**',
    '**/wasm/**/*',
    '**/package-lock.json',
  ]),

  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  eslint.configs.recommended,
  ...tsEslint.configs.recommended.map(cfg => ({ ...cfg, files: tsFilePatterns })),
  pStylistic.configs.recommended,
  pReact.configs.flat.recommended,
  pReact.configs.flat['jsx-runtime'],
  pReactHooks.configs.flat.recommended,
  pReactRefresh.configs.vite,
  pJson.configs['recommended-with-comments'],
])
