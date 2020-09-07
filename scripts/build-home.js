#!/usr/bin/env node

let { writeFile, readFile, copyFile, unlink } = require('fs').promises
let { join, extname } = require('path')
let combineMedia = require('postcss-combine-media-query')
let { terser } = require('rollup-plugin-terser')
let { rollup } = require('rollup')
let posthtml = require('posthtml')
let postcss = require('postcss')
let Bundler = require('parcel-bundler')
let del = require('del')

const SRC = join(__dirname, '..', 'src')
const DIST = join(__dirname, '..', 'dist')

async function cleanBuildDir () {
  await del(join(DIST, '*'), { dot: true })
}

function findAssets (bundle) {
  return Array.from(bundle.childBundles).reduce(
    (all, i) => {
      return all.concat(findAssets(i))
    },
    [bundle.name]
  )
}

async function build () {
  let bundler = new Bundler(join(SRC, 'index.pug'), { sourceMaps: false })
  await cleanBuildDir()
  let [bundle, jsBundle] = await Promise.all([
    bundler.bundle(),
    rollup({ input: join(SRC, 'index.js'), plugins: [terser()] })
  ])

  let assets = findAssets(bundle)
  let htmlFile = join(DIST, 'index.html')
  let cssFile = assets.find(i => extname(i) === '.css')
  let jsFile = assets.find(i => extname(i) === '.js')

  let [html, css, jsOut] = await Promise.all([
    readFile(htmlFile),
    readFile(cssFile),
    jsBundle.generate({ format: 'iife', strict: false }),
    unlink(jsFile),
    copyFile(join(SRC, 'base', 'logo.svg'), join(DIST, 'logo.svg')),
    copyFile(join(SRC, 'base', 'logo-leftp.svg'), join(DIST, 'logo-leftp.svg'))
  ])

  let cssMin = postcss([combineMedia]).process(css, { from: cssFile }).css
  let jsRepack = jsOut.output[0].code.trim()

  function htmlPlugin (tree) {
    tree.match({ tag: 'link', attrs: { rel: 'stylesheet' } }, () => {
      return { tag: 'style', content: cssMin }
    })
    tree.match({ tag: 'script' }, i => {
      if (i.attrs?.src?.includes('/src.')) {
        return {
          tag: 'script',
          content: jsRepack
        }
      } else {
        return i
      }
    })
  }

  let inlined = posthtml().use(htmlPlugin).process(html, { sync: true }).html

  await Promise.all([writeFile(htmlFile, inlined), unlink(cssFile)])
}

build().catch(e => {
  process.stderr.write(e.stack + '\n')
  process.exit(1)
})
