#!/usr/bin/env node

import { fileURLToPath } from 'url'
import { copyFile } from 'fs/promises'
import { join } from 'path'
import del from 'del'
import { build as viteBuild } from 'vite'

import pugPlugin from './pugPlugin.js'

const ROOT = join(fileURLToPath(import.meta.url), '..', '..')
const SRC = join(ROOT, 'src')
const DIST = join(ROOT, 'dist')

async function cleanBuildDir() {
  await del(join(DIST, '*'), { dot: true })
}

async function build() {
  await cleanBuildDir()
  await viteBuild({
    plugins: [pugPlugin()],
    root: SRC,
    base: '/',
    mode: 'production',
    build: {
      outDir: DIST,
    }
  });
  await Promise.all([
    copyFile(join(SRC, 'base', 'logo.svg'), join(DIST, 'logo.svg')),
    copyFile(join(SRC, 'base', 'logo-leftp.svg'), join(DIST, 'logo-leftp.svg'))
  ])
}

build().catch(e => {
  if (e.stack) {
    process.stderr.write(e.stack + '\n')
  } else {
    process.stderr.write(e + '\n')
  }
  process.exit(1)
})
