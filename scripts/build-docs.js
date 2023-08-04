#!/usr/bin/env node
import childProcess from 'child_process'
import { existsSync } from 'fs'
import { mkdir, readFile, rm, writeFile } from 'fs/promises'
import { globby } from 'globby'
import { join } from 'path'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse/lib/index.js'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { promisify } from 'util'
import { build } from 'vite'

import { DIST, PROJECTS, ROOT, SRC } from './lib/dir.js'

let exec = promisify(childProcess.exec)

async function downloadProject(name) {
  let dir = join(PROJECTS, name)
  if (existsSync(dir)) return
  let url = `https://github.com/postcss/${name}.git`
  await exec(`git clone --depth 1 ${url} "${dir}"`)
}

function prepareTree() {
  let removeDub = false
  let removeToc = false
  let removeTocCount = 0

  return tree => {
    tree.children = [
      {
        children: tree.children.filter(i => {
          if (removeToc && removeTocCount < 2) {
            if (removeTocCount === 1) {
              i.children = ''
              i.tagName = 'delete'
            }
            removeTocCount++
            if (removeTocCount === 2) {
              removeToc = false
              removeTocCount = 0
            }
          }
          if (
            i.tagName === 'p' &&
            i.children[0].tagName === 'strong' &&
            i.children[0].children[0].value === 'Table of Contents'
          ) {
            i.children[0].children[0].value = ''
            removeToc = true
          }

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

            if (removeDub && elementID === 'main-theory') {
              elementID = 'main-theory-1'
            }
            if (elementID === 'main-theory') {
              removeDub = true
            }
            i.properties = { class: 'doc_subtitle', id: elementID }
          }
          return i.type !== 'text' || i.value !== '\n'
        }),
        properties: { class: 'doc' },
        tagName: 'article',
        type: 'element'
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
          .use(prepareTree)
          .use(rehypeHighlight, { aliases: { css: 'pcss' }, prefix: 'code-' })
          .run(tree)
        return tree
      })
  )
  return docs
}

async function buildLayout() {
  let data = await build({
    build: {
      assetsInlineLimit: 0,
      outDir: join(DIST, 'docs'),
      rollupOptions: {
        input: join(SRC, 'docs.html')
      }
    },
    mode: 'production'
  })
  return data.output.find(file => file.fileName === 'docs.html').source
}

async function makeHTML(tree) {
  let html = await unified().use(rehypeStringify).stringify(tree)
  return html
}

async function saveFile(html, fileName) {
  let docTitle = html.match(/(?<="doc_title">)(.*)(?=<\/h1)/gm)
  let fileTitle
  if (fileName === 'documentation') {
    fileTitle = 'index.html'
  } else {
    html = html.replace(/PostCSS Documentation/gm, docTitle)
    fileTitle = fileName + '.html'
  }
  let docs = join(DIST, 'docs')
  if (!existsSync(docs)) await mkdir(docs)
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

function generateSidemenu(body, fileName) {
  let h2Regex = /(?<=<h2(?:.*?)>)(.*?)(?=<\/h2)/gm
  let h3Regex = /(?<=<h3(?:.*?)>)(.*?)(?=<\/h3)/gm
  let h23Regex =
    /(?<=<h2(?:.*?)>)(.*?)(?=<\/h2)|(?<=<h3(?:.*?)>)(.*?)(?=<\/h3)/gm

  let headers = body.match(h23Regex)

  let h2 = body.match(h2Regex)

  let h3 = body.match(h3Regex)

  //TODO remove this when architecture.md is corrected
  if (fileName === 'postcss-architecture') {
    h2 = h3
  }

  let i = 0
  let dub = false

  if (headers !== null) {
    let sidemenu = tag(
      'nav.sidemenu',
      tag(
        'ul',
        h2.map(hdr => {
          let name = linkSubHeadings(
            'sidemenu_section',
            getName(fileName),
            getName(hdr),
            hdr
          )
          let children = findChildren(h2, headers, i)
          i++
          if (children[0] === undefined) {
            return name
          }
          return tag(
            'li.sidemenu_item',
            tag('div.sidemenu_bar', [
              name,
              tag(`button.sidemenu_controller`, {}, ``)
            ]) +
              tag(
                'ul.sidemenu_children',
                children.map(child => {
                  if (getName(child) === 'main-theory') {
                    dub = !dub
                  }
                  return tag(
                    'li',
                    linkSubHeadings(
                      'sidemenu_child',
                      getName(fileName),
                      dub && getName(fileName) === 'main-theory'
                        ? 'main-theory-1'
                        : getName(child),
                      child
                    )
                  )
                })
              )
          )
        })
      )
    )
    return sidemenu.replaceAll('<code>', '').replaceAll('</code>', '')
  } else {
    return ''
  }
}

function getName(string) {
  if (typeof string === 'string') {
    string = string
      .toLowerCase()
      .replaceAll(' ', '-')
      .replaceAll(/[0-9]/g, '')
      .replaceAll('.', '')
      .replaceAll(':', '')
      .replaceAll('--', '-')
    while (string.charAt(0) === '-') {
      string = string.substring(1)
    }
    return string
  }
  return ''
}

function prepareHTML(html) {
  return html
    .replace(':smiley:', '&#128512')
    .replace('<p><strong></strong></p><delete></delete>', '')
}

async function run() {
  await downloadProject('postcss')
  let [docs, layout] = await Promise.all([readDocs(), buildLayout()])

  let fileNames = docs.map(doc =>
    getName(doc.children[0].children[0].children[0].value)
  )

  let html = []
  for (let i = 0; i !== docs.length; i++) {
    html[i] = await makeHTML(docs[i])
    if (i === fileNames.indexOf('documentation')) {
      html[i] = makeIndex(html[i])
    }
  }

  for (let i = 0; i < html.length; i++) {
    html[i] = prepareHTML(html[i])

    await saveFile(
      layout
        .replace(
          '</nav>',
          '</nav>' + generateSidemenu(html[i], fileNames[i]) + html[i]
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
