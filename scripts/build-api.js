#!/usr/bin/env node
import childProcess from 'child_process'
import { existsSync } from 'fs'
import { mkdir, rm, writeFile } from 'fs/promises'
import { globby } from 'globby'
import { join } from 'path'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import TypeDoc, { Converter, ReflectionKind } from 'typedoc'
import { unified } from 'unified'
import { promisify } from 'util'
import { build } from 'vite'

import { DIST, PROJECTS, SRC } from './lib/dir.js'

let SIDEMENU_IGNORE = ['LazyResult', 'Processor', 'Container', 'Node']

let exec = promisify(childProcess.exec)

function signatureComparator(a, b) {
  if (getName(a) === 'postcss') {
    return -1
  } else if (getName(b) === 'postcss') {
    return 1
  } else if (
    a.kind === ReflectionKind.Class &&
    b.kind !== ReflectionKind.Class
  ) {
    return -1
  } else if (
    b.kind === ReflectionKind.Class &&
    a.kind !== ReflectionKind.Class
  ) {
    return 1
  } else if (getName(a) < getName(b)) {
    return -1
  } else if (getName(b) < getName(a)) {
    return 1
  } else {
    return 0
  }
}

async function buildLayout() {
  let data = await build({
    build: {
      assetsInlineLimit: 0,
      outDir: join(DIST, 'api'),
      rollupOptions: {
        input: join(SRC, 'api.html')
      }
    },
    mode: 'production'
  })
  return data.output.find(file => file.fileName === 'api.html').source
}

async function downloadProject(name) {
  let dir = join(PROJECTS, name)
  if (existsSync(dir)) return
  let url = `https://github.com/postcss/${name}.git`
  await exec(`git clone --depth 1 ${url} "${dir}"`)
  await exec('yarn install', { cwd: dir })
}

async function readTypedoc() {
  let files = await globby('lib/*.d.ts', {
    absolute: true,
    cwd: join(PROJECTS, 'postcss')
  })

  let app = new TypeDoc.Application()
  app.bootstrap({
    entryPoints: files.flat(),
    tsconfig: join(PROJECTS, 'postcss', 'tsconfig.json')
  })
  app.options.setCompilerOptions(files.flat(), {
    esModuleInterop: true
  })

  app.converter.on(
    Converter.EVENT_CREATE_DECLARATION,
    (context, reflection) => {
      if (reflection.name !== 'default' && reflection.name !== 'export=') {
        return
      }

      if (reflection.escapedName && reflection.escapedName !== 'default') {
        reflection.name = reflection.escapedName
      }
    }
  )

  let project = app.convert()
  if (!project || app.logger.hasErrors()) {
    process.stderr.write(`Error during API types generation\n`)
    throw new Error('TypeDoc error')
  }
  if (!project.children) {
    throw new Error(`Project is empty`)
  }
  let nodes = []
  for (let file of project.children) {
    nodes.push(...file.children)
  }
  return nodes
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

function link(cls, hash, text) {
  return tag(`a.${cls}`, { href: `#${hash}` }, text)
}

function getName(node) {
  if (node.name === 'default') {
    if (node.kind === ReflectionKind.Class) {
      return (
        node.parent.name[0].toUpperCase() +
        node.parent.name.slice(1).replace(/-\w/g, str => str[1].toUpperCase())
      )
    } else {
      return node.parent.name
    }
  } else {
    return node.name
  }
}

function generateSidemenu(nodes) {
  let classes = nodes
    .filter(
      i =>
        (i.kind === ReflectionKind.Class &&
          !SIDEMENU_IGNORE.includes(i.name)) ||
        (i.name === 'postcss' && i.kind === ReflectionKind.Namespace)
    )
    .sort((a, b) => {
      if (getName(a) === 'postcss') {
        return -1
      } else if (getName(b) === 'postcss') {
        return 1
      } else if (getName(a) < getName(b)) {
        return -1
      } else if (getName(b) < getName(a)) {
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
        let clsSlug = getName(cls).toLowerCase()
        let name = link('sidemenu_section', clsSlug, getName(cls))
        let children = cls.children
        if (cls.name === 'postcss') {
          return []
        }
        return tag(
          'li.sidemenu_item',
          tag('div.sidemenu_bar', [
            name,
            tag(`button.sidemenu_controller`, {}, ``)
          ]) +
            tag(
              'ul.sidemenu_children',
              children
                .filter(child => child.name !== 'constructor')
                .map(child => {
                  let childName = child.name
                  if (
                    child.kind === ReflectionKind.Method ||
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

function toHTML(nodes, markdown) {
  if (!markdown) return ''
  let html = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .use(rehypeHighlight, { prefix: 'code-' })
    .processSync(markdown)
  return String(html)
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

function commentHtml(nodes, node) {
  let comment = node.comment
  if (node.signatures && node.signatures[0].comment) {
    comment = node.signatures[0].comment
  }
  if (!comment) return ''
  return toHTML(nodes, comment.summary.map(c => c.text).join(''))
}

function functionString(node) {
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

function typeString(type) {
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
            if (i.kind === ReflectionKind.Function || i.kind === ReflectionKind.Method) {
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

function typeHtml(nodes, type) {
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

function varHtml(nodes, type) {
  if (!type) return ''
  return tag('p', 'Type: ' + typeHtml(nodes, type) + '.')
}

function tableHtml(nodes, title, values) {
  if (values.length === 0) return ''
  let comments = values.map((i, index) => {
    let comment = i
    if (!comment.comment && i.parent.parent.signatures) {
      comment = i.parent.parent.signatures[0].parameters[index] || {}
    }
    if (!comment.comment && i.parent.overwrites) {
      comment = i.parent.overwrites.reflection.parameters[index]
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

function signaturesHtml(nodes, node) {
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

function generateBody(nodes) {
  let functionDeclaration
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
    .filter(node => {
      let name = getName(node)
      return !(name === 'list' && !node._target)
    })
    .sort(signatureComparator)
    .map(node => {
      let id = getName(node).toLowerCase()
      let type = node
      if (id === 'list') {
        type = node.getTargetReflection()
      }
      if (id === 'postcss') {
        if (node.kind === ReflectionKind.Function) {
          // add constructor declaration to namespace later
          functionDeclaration = node
          return ''
        }
        if (node.kind === ReflectionKind.Namespace) {
          type = functionDeclaration
        }
      }

      let name = getName(node)
      let title = tag('h1.doc_title', { id }, name) + commentHtml(nodes, type)

      if (
        /(Options|Raws|Props|Source|Position|Message|Syntax)$/.test(name) &&
        name !== 'ChildProps' &&
        type.children
      ) {
        return tag('section.doc', [
          title,
          tableHtml(nodes, 'Property', type.children)
        ])
      }

      let children = type.children || []
      if (name === 'postcss' && node.kind === ReflectionKind.Namespace) {
        children = node.children
      } else if (!node.signatures?.length && !node.comment && !node.children?.length) {
        type = node.tryGetTargetReflection();
        children = type.children || [];
        if (!children.length) return ''
      } else if (name !== 'postcss' && node.kind === ReflectionKind.Namespace) {
        return ''
      }

      return tag('section.doc', [
        title,
        signaturesHtml(nodes, type),
        ...children
          .filter(member => member.name !== 'constructor')
          .sort(signatureComparator)
          .map(member => {
            let memberId = id + '-' + member.name.toLowerCase()
            let prefix = name

            // --- catch inline exported postcss.list
            if (memberId === 'postcss-list') {
              member = member.getTargetReflection()
            }

            if (name === 'postcss' || name === 'list') {
              prefix += '.'
            } else {
              prefix += '#'
            }
            let postfix = ''
            if (member.kind === ReflectionKind.Method) postfix += '()'
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

            // --- hide all signatures without content
            if (!memberContent && !member.signatures?.length > 0) {
              return ''
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

async function saveFile(html) {
  let api = join(DIST, 'api')
  if (!existsSync(api)) await mkdir(api)
  await writeFile(join(api, 'index.html'), html)
}

async function run() {
  await downloadProject('postcss')
  let [nodes, layout] = await Promise.all([readTypedoc(), buildLayout()])
  let submenu = generateSidemenu(nodes)
  let body = generateBody(nodes)
  await saveFile(
    layout
      .replace('</nav>', '</nav>' + submenu + body)
      .replace(/\/assets/g, '/api/assets')
  )
  await rm(join(DIST, 'api/api.html'))
}

run().catch(e => {
  if (e.stack) {
    process.stderr.write(e.stack + '\n')
  } else {
    process.stderr.write(e + '\n')
  }
  process.exit(1)
})
