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
import { visit } from 'unist-util-visit'
import remarkHighlight from 'remark-highlight.js'
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

function highlightLines(node, cb) {
  if (!node.data) node.data = {}
  node.data.hChildren = node.value
    .split('\n')
    .map(cb)
    .flatMap((line, i) => (i === 0 ? line : [text('\n'), ...line]))
}

function span(cls, value) {
  return {
    type: 'element',
    tagName: 'span',
    properties: { className: [cls] },
    children: [text(value)]
  }
}

function text(value) {
  return { type: 'text', value }
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
            i.editUrl = `https://github.com/logux/docs/edit/main/${file}`
            i.noSlug = true
          }
          return i.type !== 'text' || i.value !== '\n'
        })
      }
    ]
  }
}

function iniandBashHighlight() {
  return tree => {
    visit(tree, 'code', node => {
      if (node.lang === 'sh' || node.lang === 'bash') {
        highlightLines(node, line =>
          line
            .split(' ')
            .map((word, i, all) => {
              if (i === 0 && (word === 'npx' || word === 'sudo')) {
                return span('code-block_keyword', word)
              } else if (
                i === 0 ||
                (i === 1 && all[0] === 'npx') ||
                (i === 1 && all[0] === 'npm' && word === 'i') ||
                (i === 1 && all[0] === 'yarn' && word === 'add') ||
                (i === 1 && all[0] === 'pnpm' && word === 'add')
              ) {
                return span('code-block_literal', word)
              } else {
                return text(word)
              }
            })
            .flatMap((word, i) => (i === 0 ? word : [text(' '), word]))
        )
      } else if (node.lang === 'ini') {
        highlightLines(node, line => {
          let [name, value] = line.split('=')
          return [
            span('code-block_params', name),
            text('='),
            span('code-block_string', value)
          ]
        })
      } else if (node.lang === 'diff') {
        highlightLines(node, line => {
          let code = line.slice(2)
          if (line[0] === '+') {
            return [span('code-block_addition', code)]
          } else if (line[0] === '-') {
            return [span('code-block_deletion', code)]
          } else {
            return [span('code-block_untouched', code)]
          }
        })
      }
    })
  }
}

async function readDocs() {
  let files = await globby('../**/docs/*.md', { cwd: ROOT })
  let docs = await Promise.all(
    files.map(async file => {
      let md = await readFile(join(ROOT, file))
      let tree = await unified()().use(remarkParse).parse(md)
      tree = await unified()
        .use(iniandBashHighlight)
        .use(remarkHighlight, {
          exclude: ['bash', 'sh', 'ini', 'diff', 'pcss'],
          prefix: 'code-block_'
        })
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
  await writeFile(join(docs, 'index.html'), html)
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

async function run() {
    await downloadProject('postcss')
    let [docs, layout] = await Promise.all([readDocs(), buildLayout()])
    let body = []
    for (let i = 0; i !== docs.length; i++) {
      body[i] = await (makeHTML(docs[i]))
    }
    body = body.join(" ")
    await saveFile(
      layout
        .replace('</nav>', '</nav>' + body)
        .replace(/\/assets/g, '/docs/assets')
    )
  
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