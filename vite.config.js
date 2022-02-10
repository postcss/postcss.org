import { defineConfig } from 'vite'
import vitePugPlugin from 'vite-plugin-pug-transformer'

import { SRC, DIST } from './scripts/lib/dir.js'

export default defineConfig({
  root: SRC,
  build: {
    assetsInlineLimit: 0,
    emptyOutDir: true,
    outDir: DIST
  },
  plugins: [vitePugPlugin()]
})
