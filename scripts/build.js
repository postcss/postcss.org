#!/usr/bin/env node

let { join } = require('path')
let Bundler = require('parcel-bundler')
let del = require('del')

const SRC = join(__dirname, '..', 'src')
const DIST = join(__dirname, '..', 'dist')

async function cleanBuildDir () {
  await del(join(DIST, '*'), { dot: true })
}

async function build () {
  let bundler = new Bundler(join(SRC, 'index.pug'), { sourceMaps: false })
  await cleanBuildDir()
  await bundler.bundle()
}

build().catch(e => {
  process.stderr.write(e.stack + '\n')
  process.exit(1)
})
