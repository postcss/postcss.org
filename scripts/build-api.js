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
  await exec(`git clone --depth 1 ${url} "${dir}"`)
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

function toHTML (nodes, markdown) {
  if (!markdown) return ''
  let html = unified()
    .use(remarkParse)
    .use(remarkHighlight, { prefix: 'code_' })
    .use(remarkHtml)
    .processSync(markdown).contents
  return html
    .replace(/hljs language-js/g, 'code')
    .replace(/<code>[A-Z]\w+(#\w+)?<\/code>/g, str => {
      let cls = str.match(/[A-Z]\w+/)[0]
      if (nodes.some(i => i.name === cls)) {
        if (str.includes('#')) {
          let method = str.match(/#(\w+)/)[1]
          return tag(
            'code',
            tag(
              'a',
              { href: `#${cls.toLowerCase()}-${method.toLowerCase()}` },
              cls + '#' + method
            )
          )
        } else {
          return tag('code', tag('a', { href: `#${cls.toLowerCase()}` }, cls))
        }
      } else {
        return str
      }
    })
}

function commentHtml (nodes, node) {
  let comment = node.comment
  if (node.signatures && node.signatures[0].comment) {
    comment = node.signatures[0].comment
  }
  if (!comment) return ''
  return toHTML(nodes, comment.shortText + '\n\n' + comment.text)
}

function functionString (node) {
  let signature = node.signatures[0]
  return (
    '(' +
    (signature.parameters || [])
      .map(param => param.name + ': ' + typeString(param.type))
      .join(', ') +
    ') => ' +
    typeString(signature.type)
  )
}

function typeString (type) {
  if (type.type === 'union') {
    return type.types.map(i => typeString(i)).join(' | ')
  }
  let string = type.toString()
  if (string === 'object' && type.declaration) {
    let decl = type.declaration
    if (decl.indexSignature) {
      let param = decl.indexSignature.parameters[0]
      return (
        '{ [' +
        param.name +
        ': ' +
        typeString(param.type) +
        ']: ' +
        typeString(decl.indexSignature.type) +
        '}'
      )
    } else {
      return (
        '{ ' +
        decl.children
          .map(i => {
            if (i.kindString === 'Function') {
              return i.name + ': ' + functionString(i)
            } else {
              return i.name + ': ' + typeString(i.type)
            }
          })
          .join(', ') +
        ' }'
      )
    }
  } else if (string === 'function') {
    return functionString(type.declaration)
  } else {
    return string
  }
}

function typeHtml (nodes, type) {
  return typeString(type)
    .replace(/<>/g, '')
    .replace(
      'DeclarationProps | Declaration | AtRule | Rule | Comment | AtRuleProps' +
        ' | RuleProps | CommentProps',
      'ChildProps | ChildNode'
    )
    .replace(
      /\(DeclarationProps \| At(?:RuleProps \| ){2}CommentProps\)/g,
      'ChildProps'
    )
    .replace(/\(Declaration \| AtRule \| Rule \| Comment\)/g, 'ChildNode')
    .replace(
      /DeclarationProps \| Node \| At(?:RuleProps \| ){2}Com{2}entProps/g,
      'ChildProps | Node'
    )
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/[A-Z]\w+(?!:)/g, cls => {
      if (nodes.some(i => i.name === cls)) {
        return tag('a', { href: `#${cls.toLowerCase()}` }, cls)
      } else {
        return cls
      }
    })
}

function varHtml (nodes, type) {
  if (!type) return ''
  return tag('p', 'Type: ' + typeHtml(nodes, type) + '.')
}

function tableHtml (nodes, title, values) {
  let comments = values.map((i, index) => {
    let comment = i
    if (!comment.comment && i.parent.parent.signatures) {
      comment = i.parent.parent.signatures[0].parameters[index] || {}
    }
    if (!comment.comment && i.parent.overwrites) {
      comment = i.parent.overwrites.reflection.signatures[0].parameters[index]
    }
    return commentHtml(nodes, comment).replace(/<\/?p>/g, '')
  })
  let hasComment = comments.some(i => i)
  return tag('table', [
    tag('tr', [
      tag('th', title),
      tag('th', 'Type'),
      hasComment ? tag('th', 'Description') : ''
    ]),
    ...values.map((i, index) => {
      let name = i.name
      if (i.flags.isRest) name += '…'
      if (i.isOptional) name += '?'
      return tag('tr', [
        tag('td', tag('code', name)),
        tag('td', typeHtml(nodes, i.type)),
        hasComment ? tag('td', comments[index]) : ''
      ])
    })
  ])
}

function signaturesHtml (nodes, node) {
  if (!node.signatures) return ''
  let comment = node.comment || node.signatures[0].comment || {}
  let returns
  if (node.signatures[0].type.name === 'this') {
    returns = tag('p', 'Returns itself for methods chain.')
  } else if (/^(walk|each)/.test(node.name)) {
    return (
      tableHtml(nodes, 'Argument', node.signatures[0].parameters).replace(
        ' => void',
        ' => void | false'
      ) +
      tag('p', [
        'Returns ',
        tag('code', 'void | false'),
        '. ',
        toHTML(nodes, comment.returns).replace(/<\/?p>/g, '')
      ])
    )
  } else if (node.signatures[0].type.name === 'void') {
    returns = ''
  } else {
    returns = tag('p', [
      'Returns ',
      tag('code', typeHtml(nodes, node.signatures[0].type)),
      '. ',
      toHTML(nodes, comment.returns).replace(/<\/?p>/g, '')
    ])
  }
  return (
    node.signatures
      .filter(signature => signature.parameters)
      .map(signature => {
        return tableHtml(nodes, 'Argument', signature.parameters)
      })
      .join('') + returns
  )
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
      if (node.name === 'postcss' || node.name === 'list') {
        type = node.type.reflection
      }
      let title =
        tag('h1.doc_title', { id }, node.name) + commentHtml(nodes, type)

      if (
        /(Options|Raws|Props|Source|Position|Message|Syntax)$/.test(
          node.name
        ) &&
        node.name !== 'ChildProps'
      ) {
        return tag('section.doc', [
          title,
          tableHtml(nodes, 'Property', type.children)
        ])
      }

      let content = type.type
      let children = type.children || []
      if (type.type && type.type.toString() === 'object') {
        content = false
        children = type.type.declaration.children
      }
      return tag('section.doc', [
        title,
        varHtml(nodes, content),
        signaturesHtml(nodes, type),
        ...children
          .filter(member => member.name !== 'constructor')
          .map(member => {
            let memberId = id + '-' + member.name.toLowerCase()
            let prefix = node.name
            if (node.name === 'postcss' || node.name === 'list') {
              prefix += '.'
            } else {
              prefix += '#'
            }
            let postfix = ''
            if (member.kindString === 'Method') postfix += '()'
            let memberContent
            if (member.type && member.type.toString() === 'object') {
              children = tableHtml(
                nodes,
                'Property',
                member.type.declaration.children
              )
            } else {
              memberContent = varHtml(nodes, member.type)
            }
            return (
              tag(
                'h2.doc_subtitle',
                { id: memberId },
                tag('span.doc_prefix', prefix) + member.name + postfix
              ) +
              commentHtml(nodes, member) +
              memberContent +
              signaturesHtml(nodes, member)
            )
          })
      ])
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
