import { defineConfig } from 'vite'

import pugPlugin from './scripts/pugPlugin.js'

export default defineConfig({
  plugins: [pugPlugin()],
  root: './src',
})
