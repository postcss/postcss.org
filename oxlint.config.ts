import loguxOxlintConfig from '@logux/oxc-configs/lint'
import { defineConfig } from 'oxlint'

export default defineConfig({
  extends: [loguxOxlintConfig],
  ignorePatterns: ['projects/', 'dist/', 'design/'],
  rules: {
    'no-underscore-dangle': 'off'
  }
})
