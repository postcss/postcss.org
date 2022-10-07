#!/usr/bin/env node
import { readFile, writeFile, mkdir, rm } from 'fs/promises'
import remarkParse from 'remark-parse/lib/index.js'
import rehypeHighlight from 'rehype-highlight'
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

function prepareHTML() {
  let checkDuplicate = false
  return tree => {
    tree.children = [
      {
        type: 'element',
        tagName: 'article',
        properties: { class: 'doc' },
        children: tree.children.filter(i => {
          if (i.tagName === 'h1') {
            i.properties = { class: 'doc_title' }
          }
          if (i.tagName === 'h2' || i.tagName === 'h3') {
            let elementID = getName(i.children[0].value)
            if (i.children[1] !== undefined) {
              let complexID = []
              i.children.forEach(element => {
                if (element.value !== undefined) {
                  complexID += element.value
                } else {
                  complexID += element.children[0].value
                }
              })
              elementID = getName(complexID)
            }

            if (checkDuplicate && elementID === 'main-theory') {
              elementID = 'main-theory-1'
            }
            if (elementID === 'main-theory') {
              checkDuplicate = true
            }
            i.properties = { class: 'doc_subtitle', id: elementID }
          }
          return i.type !== 'text' || i.value !== '\n'
        })
      }
    ]
  }
}

async function readDocs() {
  let ignore = [
    '../postcss/docs/README-cn.md',
    '../postcss/docs/source-maps.md'
  ]
  let files = await globby('../postcss/docs/**/*.md')
  let docs = await Promise.all(
    files
      .filter(file => !ignore.includes(file))
      .map(async file => {
        let md = await readFile(join(ROOT, file))
        let tree = await unified()().use(remarkParse).parse(md)
        tree = await unified()
          .use(remarkRehype, { allowDangerousHtml: true })
          .use(rehypeRaw)
          .use(prepareHTML)
          .use(rehypeHighlight, { prefix: 'code-', aliases: { css: 'pcss' } })
          .run(tree)
        return tree
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
  return html
}

async function saveFile(html, fileName) {
  let docs = join(DIST, 'docs')
  if (!existsSync(docs)) await mkdir(docs)
  let fileTitle
  if (fileName === 'documentation') {
    fileTitle = 'index.html'
  } else {
    fileTitle = fileName + '.html'
    html = html.replace(
      /PostCSS Documentation/gm,
      html.match(/(?<="doc_title">)(.*)(?=<\/h1)/gm)
    )
  }
  await writeFile(join(docs, fileTitle), html)
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
  let titles = contents
    .match(/(?<=<p><a(?:.*?)>)(.*?)(?=<)/gm)
    .filter(title => title !== '')
    .filter(title => title !== 'PostCSS and Source Maps')
  let chapters = contents
    .match(/(?<=<p><a(?:.*?)>)(.*?)(?=<)|(?<=<li><a(?:.*?)>)(.*)(?=<\/a)/gm)
    .filter(title => title !== '')
  let i = 0
  let sidemenu = tag(
    'nav.sidemenu',
    tag(
      'ul',
      titles.map(title => {
        let name = linkHeadings('sidemenu_section', getName(title), title)
        let children = findChildren(titles, chapters, i)
        i++
        return tag(
          'li.sidemenu_item',
          tag('div.sidemenu_bar', [
            name,
            tag(`button.sidemenu_controller`, {}, ``)
          ]) +
            tag(
              'ul.sidemenu_children',
              children.map(child => {
                return tag(
                  'li',
                  linkSubHeadings(
                    'sidemenu_child',
                    getName(title),
                    getName(child),
                    child
                  )
                )
              })
            )
        )
      })
    )
  )
  sidemenu =
    sidemenu.slice(0, sidemenu.indexOf('main-theory') + 'main-theory'.length) +
    sidemenu
      .slice(sidemenu.indexOf('main-theory') + 'main-theory'.length)
      .replace(/main-theory/gm, 'main-theory-1')

  return sidemenu
}

function makeIndex(contents) {
  let titles = contents
    .match(/(?<=<p><a(?:.*?)>)(.*?)(?=<)/gm)
    .filter(title => title !== '')
    .filter(title => title !== 'PostCSS and Source Maps')

  let index = titles.map(title => {
    return tag('li', linkHeadings('doc_subtitle', getName(title), title))
  })
  index =
    "<article class='doc'><h1 class='doc_title'>Documentation</h1><ul>" +
    index.join('\n') +
    '</ul></article>'
  contents.slice(contents.indexOf(titles[titles.length]))
  return index
}

function linkHeadings(cls, link, text) {
  return tag(`a.${cls}`, { href: `${link}` }, text)
}

function linkSubHeadings(cls, link, hash, text) {
  let ref = link + '#' + hash
  ref = ref.replaceAll('<code>', '').replaceAll('</code>', '')
  return tag(`a.${cls}`, { href: ref }, text)
}

function findChildren(titles, chapters, i) {
  let titleIndexes = [1]
  for (let j = 1; j < chapters.length + 1; j++) {
    if (titles.includes(chapters[j])) {
      titleIndexes.push(j)
    }
  }
  let children = chapters.slice(titleIndexes[i] + 1, titleIndexes[i + 1])
  return children
}

function getName(string) {
  if (typeof string === 'string') {
    string = string
      .toLowerCase()
      .replaceAll(' ', '-')
      .replaceAll(/[0-9]/g, '')
      .replaceAll('.', '')
    while (string.charAt(0) === '-') {
      string = string.substring(1)
    }
    return string
  }
  return ''
}

async function run() {
  await downloadProject('postcss')
  let [docs, layout] = await Promise.all([readDocs(), buildLayout()])

  let fileNames = docs.map(doc =>
    getName(doc.children[0].children[0].children[0].value)
  )

  let sidemenu
  let body = []
  for (let i = 0; i !== docs.length; i++) {
    body[i] = await makeHTML(docs[i])
    if (i === fileNames.indexOf('documentation')) {
      sidemenu = makeSidemenu(body[i])
      body[i] = makeIndex(body[i])
    }
  }

  for (let i = 0; i < body.length; i++) {
    await saveFile(
      layout
        // TODO find better way to replace smiley
        .replace(
          '</nav>',
          '</nav>' + sidemenu + body[i].replace(':smiley:', '&#128512')
        )
        .replace(/\/assets/g, '/docs/assets'),
      fileNames[i]
    )
  }
  await rm(join(DIST, 'docs/docs.html'))
}

run().catch(e => {
  if (e.stack) {
    process.stderr.write(e.stack + '\n')
  } else {
    process.stderr.write(e + '\n')
  }
  process.exit(1)
})
