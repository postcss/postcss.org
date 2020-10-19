#!/usr/bin/env node

let { copyFile } = require('fs').promises
let { join } = require('path')
let Parcel = require('@parcel/core').default
let del = require('del')

const ROOT = join(__dirname, '..')
const SRC = join(ROOT, 'src')
const DIST = join(ROOT, 'dist')

async function cleanBuildDir () {
  await del(join(DIST, '*'), { dot: true })
}

async function build () {
  await cleanBuildDir()
  let bundler = new Parcel({
    entries: join(SRC, 'index.pug'),
    defaultConfig: join(ROOT, 'node_modules', '@parcel', 'config-default'),
    patchConsole: false,
    sourceMaps: false,
    mode: 'production'
  })
  await Promise.all([
    bundler.run(),
    copyFile(join(SRC, 'base', 'logo.svg'), join(DIST, 'logo.svg')),
    copyFile(join(SRC, 'base', 'logo-leftp.svg'), join(DIST, 'logo-leftp.svg'))
  ])
}

build().catch(e => {
  process.stderr.write(e.stack + '\n')
  process.exit(1)
})
