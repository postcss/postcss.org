import { join } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import vitePugPlugin from 'vite-plugin-pug-transformer'

const ROOT = join(fileURLToPath(import.meta.url), '..')
const SRC = join(ROOT, 'src')
const DIST = join(ROOT, 'dist')

export default defineConfig({
  root: SRC,
  build: {
    outDir: DIST,
    assetsInlineLimit: 0
  },
  plugins: [vitePugPlugin()],
})
