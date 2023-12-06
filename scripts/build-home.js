#!/usr/bin/env node
import { copyFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { build } from 'vite'

import { DIST, SRC } from './lib/dir.js'

async function cleanBuildDir() {
  await rm(join(DIST, '*'), { force: true, recursive: true })
}

async function run() {
  await cleanBuildDir()
  await build({
    mode: 'production'
  })
  await Promise.all([
    copyFile(join(SRC, 'base', 'logo.svg'), join(DIST, 'logo.svg')),
    copyFile(join(SRC, 'base', 'logo-leftp.svg'), join(DIST, 'logo-leftp.svg'))
  ])
}

run().catch(e => {
  if (e.stack) {
    process.stderr.write(e.stack + '\n')
  } else {
    process.stderr.write(e + '\n')
  }
  process.exit(1)
})
