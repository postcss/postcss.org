import { defineConfig } from 'vite'
import vitePugPlugin from 'vite-plugin-pug-transformer'

import { DIST, SRC } from './scripts/lib/dir.js'

export default defineConfig({
  build: {
    assetsInlineLimit: 0,
    emptyOutDir: true,
    outDir: DIST
  },
  plugins: [vitePugPlugin()],
  root: SRC
})
