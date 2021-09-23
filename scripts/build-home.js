#!/usr/bin/env node

import { fileURLToPath } from 'url'
import { copyFile } from 'fs/promises'
import parcelCore from '@parcel/core'
import { join } from 'path'
import { red } from 'nanocolors'
import del from 'del'

let Parcel = parcelCore.default

const ROOT = join(fileURLToPath(import.meta.url), '..', '..')
const SRC = join(ROOT, 'src')
const DIST = join(ROOT, 'dist')

async function cleanBuildDir() {
  await del(join(DIST, '*'), { dot: true })
}

async function build() {
  await cleanBuildDir()
  let bundler = new Parcel({
    entries: join(SRC, 'index.pug'),
    defaultConfig: join(ROOT, 'node_modules', '@parcel', 'config-default'),
    patchConsole: false,
    sourceMaps: false,
    mode: 'production'
  })
  await bundler.run()
  await Promise.all([
    copyFile(join(SRC, 'base', 'logo.svg'), join(DIST, 'logo.svg')),
    copyFile(join(SRC, 'base', 'logo-leftp.svg'), join(DIST, 'logo-leftp.svg'))
  ])
}

build().catch(e => {
  if (e.stack) {
    process.stderr.write(red(e.stack + '\n'))
  } else {
    process.stderr.write(red(e + '\n'))
  }
  process.exit(1)
})
