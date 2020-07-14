#!/usr/bin/env node

let { readFile, writeFile, unlink, mkdir } = require('fs').promises
let remarkHighlight = require('remark-highlight.js')
let { existsSync } = require('fs')
let { promisify } = require('util')
let childProcess = require('child_process')
let remarkParse = require('remark-parse')
let remarkHtml = require('remark-html')
let { join } = require('path')
let Bundler = require('parcel-bundler')
let { red } = require('colorette')
let unified = require('unified')
let TypeDoc = require('typedoc')
let globby = require('globby')

let exec = promisify(childProcess.exec)

const PROJECTS = join(__dirname, '..', '..')
const DIST = join(__dirname, '..', 'dist')
const SRC = join(__dirname, '..', 'src')

async function buildLayout () {
  let bundler = new Bundler(join(SRC, 'api.pug'), { sourceMaps: false })
  await bundler.bundle()
  let htmlFile = join(DIST, 'api.html')
  let html = await readFile(htmlFile)
  await unlink(htmlFile)
  return html.toString()
}

async function downloadProject (name) {
  let dir = join(PROJECTS, name)
  if (existsSync(dir)) return
  let url = `https://github.com/postcss/${name}.git`
  // await exec(`git clone --depth 1 ${url} "${dir}"`)
  await exec(`git clone ${url} "${dir}"`)
  await exec(`git pull`)
  await exec(`git checkout ose`)
  await exec('yarn install', { cwd: dir })
}

async function readTypedoc () {
  let files = await globby('lib/*.d.ts', {
    absolute: true,
    cwd: join(PROJECTS, 'postcss')
  })

  let app = new TypeDoc.Application()
  app.bootstrap({
    includeDeclarations: true,
    excludeExternals: true,
    esModuleInterop: true
  })
  let { errors, project } = app.converter.convert(files.flat())
  if (errors.length > 0) {
    console.error(`Error during API types generation`)
    throw new Error(errors[0].messageText)
  }
  if (!project.children) {
    throw new Error(JSON.stringify(project))
  }
  let nodes = []
  for (let file of project.children) {
    nodes.push(...file.children)
  }

  return nodes
}

function tag (prefix, attrs, body) {
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

function link (cls, hash, text) {
  return tag(`a.${cls}`, { href: `#${hash}` }, text)
}

function generateSidemenu (nodes) {
  let ignore = ['LazyResult', 'Processor', 'Container', 'Node']
  let classes = nodes
    .filter(
      i =>
        (i.kindString === 'Class' && !ignore.includes(i.name)) ||
        i.name === 'postcss'
    )
    .sort((a, b) => {
      if (a.name === 'postcss') {
        return -1
      } else if (b.name === 'postcss') {
        return 1
      } else if (a.name < b.name) {
        return -1
      } else if (b.name < a.name) {
        return 1
      } else {
        return 0
      }
    })
  let html = tag(
    'nav.sidemenu',
    tag(
      'ul',
      classes.map(cls => {
        let clsSlug = cls.name.toLowerCase()
        let name = link('sidemenu_section', clsSlug, cls.name)
        let children = cls.children
        if (cls.name === 'postcss') {
          children = cls.type.reflection.children
        }
        return tag(
          'li',
          name +
            tag(
              'ul',
              children
                .filter(child => child.name !== 'constructor')
                .map(child => {
                  let childName = child.name
                  if (
                    child.kindString === 'Method' ||
                    child.name === 'parse' ||
                    child.name === 'stringify'
                  ) {
                    childName += '()'
                  }
                  let childSlug = clsSlug + '-' + child.name.toLowerCase()
                  return tag('li', link('sidemenu_child', childSlug, childName))
                })
            )
        )
      })
    )
  )
  return html
}

function toHTML (markdown) {
  return unified()
    .use(remarkParse)
    .use(remarkHighlight, { prefix: 'code_' })
    .use(remarkHtml)
    .processSync(markdown)
    .contents.replace(/hljs language-js/g, 'code')
}

function commentHtml (node) {
  let comment = node.comment
  if (node.name === 'Postcss') {
    comment = node.signatures[0].comment
  }
  if (!comment) return ''
  return toHTML(comment.shortText + '\n\n' + comment.text)
}

function generateBody (nodes) {
  let ignore = [
    'Postcss',
    'List',
    'stringify',
    'space',
    'rule',
    'root',
    'plugin',
    'parse',
    'decl',
    'comma',
    'atRule'
  ]
  return nodes
    .filter(node => !ignore.includes(node.name))
    .sort((a, b) => {
      if (a.name === 'postcss') {
        return -1
      } else if (b.name === 'postcss') {
        return 1
      } else if (a.kindString === 'Class' && b.kindString !== 'Class') {
        return -1
      } else if (b.kindString === 'Class' && a.kindString !== 'Class') {
        return 1
      } else if (a.name < b.name) {
        return -1
      } else if (b.name < a.name) {
        return 1
      } else {
        return 0
      }
    })
    .map(node => {
      let id = node.name.toLowerCase()
      let type = node
      if (node.name === 'postcss') {
        type = node.type.reflection
      }
      return tag(
        'section.doc',
        tag('h1.doc_title', { id }, node.name) + commentHtml(type)
      )
    })
    .join('')
}

async function saveFile (html) {
  let api = join(DIST, 'api')
  if (!existsSync(api)) await mkdir(api)
  await writeFile(join(api, 'index.html'), html)
}

async function build () {
  await downloadProject('postcss')
  let [nodes, layout] = await Promise.all([readTypedoc(), buildLayout()])
  let submenu = generateSidemenu(nodes)
  let body = generateBody(nodes)
  await saveFile(layout.replace('<main>', submenu + '<main>' + body))
}

build().catch(e => {
  process.stderr.write(red(e.stack) + '\n')
  process.exit(1)
})
