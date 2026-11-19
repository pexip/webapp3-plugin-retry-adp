import eslintConfigLove from 'eslint-config-love'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  eslintConfigLove,
  eslintConfigPrettier,
  {
    rules: {
      semi: ['error', 'never'],
      'comma-dangle': ['error', 'never'],
      'no-console': ['error', { allow: ['log', 'warn', 'error'] }]
    }
  },
  {
    files: ["**/*.tsx", "**/*.ts"],
  },
  {
    ignores: ['dist', 'eslint.config.js', 'vite.config.ts', 'utils'],
  }
]