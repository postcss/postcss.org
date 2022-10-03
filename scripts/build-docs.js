#!/usr/bin/env node
import { readFile, writeFile, mkdir, rm } from 'fs/promises'
import remarkParse from 'remark-parse/lib/index.js'
import { unified } from 'unified'
import { globby } from 'globby'
import childProcess from 'child_process'
import rehypeStringify from 'rehype-stringify'
import { join } from 'path'
import { promisify } from 'util'
import { existsSync } from 'fs'
import { build } from 'vite'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'

import { PROJECTS, ROOT, DIST, SRC } from './lib/dir.js'

let exec = promisify(childProcess.exec)

async function downloadProject(name) {
  let dir = join(PROJECTS, name)
  if (existsSync(dir)) return
  let url = `https://github.com/postcss/${name}.git`
  await exec(`git clone --depth 1 ${url} "${dir}"`)
}

function articler(file) {
  return tree => {
    tree.children = [
      {
        type: 'element',
        tagName: 'article',
        properties: {},
        children: tree.children.filter(i => {
          if (i.tagName === 'h1') {
            // this url does not work
            i.editUrl = `https://github.com/postcss/docs/edit/main/${file}`
            i.noSlug = true
          }
          return i.type !== 'text' || i.value !== '\n'
        })
      }
    ]
  }
}

async function readDocs() {
  let ignore = "'../postcss/docs/README-cn.md'"
  let files = await globby('../postcss/docs/**/*.md')
  let docs = await Promise.all(
    files.filter(file => !ignore.includes(file)).map(async file => {
      let md = await readFile(join(ROOT, file))
      let tree = await unified()().use(remarkParse).parse(md)
      tree = await unified()
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(articler, file)
        .run(tree)
      return (tree)
    })
  )
  return docs
}

async function buildLayout() {
  let data = await build({
    mode: 'production',
    build: {
      outDir: join(DIST, 'docs'),
      rollupOptions: {
        input: join(SRC, 'docs.html')
      },
      assetsInlineLimit: 0
    }
  })
  return data.output.find(file => file.fileName === 'docs.html').source
}

async function makeHTML(tree) {
  let html = await unified().use(rehypeStringify).stringify(tree)
  html = tag('section.doc', html)
  return html
}

async function saveFile(html) {
  let docs = join(DIST, 'docs')
  if (!existsSync(docs)) await mkdir(docs)
  let fileTitle = randString() + '.html'
  await writeFile(join(docs, fileTitle), html)
}

function randString() {
  return (+new Date * Math.random()).toString(36).substring(0, 6)
}

function tag(prefix, attrs, body) {
  if (typeof body === 'undefined') {
    body = attrs
    attrs = {}
  }
  let [tagName, cls] = prefix.split('.')
  if (cls) attrs.class = cls
  if (Array.isArray(body)) body = body.join('')
  let attrsString = Object.keys(attrs)
    .map(i => ` ${i}="${attrs[i]}"`)
    .join('')
  return `<${tagName}${attrsString}>${body}</${tagName}>`
}


function makeSidemenu(contents) {

  //let titles = contents.match(/(?<=<p><a(?:.*?)>)(.*?)(?=<)/gm).filter(title => title !== "")
  let chapters = contents.match(/(?<=<p><a(?:.*?)>)(.*?)(?=<)|(?<=<li><a(?:.*?)>)(.*)(?=<\/a)/gm).filter(title => title !== "")
  // TODO: make sidebar links
  let sidemenu = tag(
    'nav.sidemenu',
    tag(
      'ul',
      chapters.map(chapter => {
        let name = tag('sidemenu_section', chapter)
        let children = chapter
        return tag(
          'li.sidemenu_item',
          tag('div.sidemenu_bar', [
            name,
            tag(`button.sidemenu_controller`, {}, ``)
          ]) +
          tag(
            'ul.sidemenu_children',
            children
          )
        )
      })
    )
  )
  return sidemenu
}

async function run() {
  await downloadProject('postcss')
  let [docs, layout] = await Promise.all([readDocs(), buildLayout()])
  let contents = []
  let sidemenu
  for (let i = 0; i < docs.length; i++) {

    if (docs[i].children[0].children[0].children[0].value === "Documentation") {
      contents[i] = await makeHTML(docs[i])
      sidemenu = makeSidemenu(contents[i])
    }
  }

  let body = []
  for (let i = 0; i !== docs.length; i++) {
    body[i] = await (makeHTML(docs[i]))

  }

  for (let i = 0; i < body.length + 1; i++) {
    await saveFile(
      layout
        .replace('</nav>', '</nav>' + sidemenu + body[i])
        .replace(/\/assets/g, '/docs/assets')
    )
    //await rm(join(DIST, 'docs/docs.html'))
  }
}

run().catch(e => {
  if (e.stack) {
    process.stderr.write(e.stack + '\n')
  } else {
    process.stderr.write(e + '\n')
  }
  process.exit(1)
})
