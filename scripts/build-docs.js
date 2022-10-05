#!/usr/bin/env node
import console from 'console'
import addClasses from 'rehype-add-classes';
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
  let ignore = ['../postcss/docs/README-cn.md', '../postcss/CHANGELOG.md']
  // TODO: exclude node_modules in a different way
  let files = (await globby('../postcss/**/**/*.md')).filter(file => !file.match(/node_modules/g))
  let docs = await Promise.all(
    files.filter(file => !ignore.includes(file)).map(async file => {
      let md = await readFile(join(ROOT, file))
      let tree = await unified()().use(remarkParse).parse(md)
      tree = await unified()
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(articler, file)
        // TODO add class through properties?
        .use(addClasses, {
          h1: "doc_title",
          h2: "doc_subtitle",
          h3: "doc_subtitle",
          //pre: "code"
        })
        .use(rehypeHighlight, { prefix: 'code-', ignoreMissing: true })
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
  for (let i = 0; i < tree.children[0].children.length; i++) {
    if (tree.children[0].children[i].tagName === "h2" || tree.children[0].children[i].tagName === "h3") {
      for (let j in tree.children[0].children[i].children) {
        let wow = []
        if (tree.children[0].children[i].children[j].value !== undefined) {
          wow[j] = tree.children[0].children[i].children[j].value.toLowerCase().replaceAll(" ", "-")

          if (tree.children[0].children[i].children[1] !== undefined) {
            wow[j] = wow[j] + tree.children[0].children[i].children[1].children[0].value
          }
          tree.children[0].children[i].properties = { ...tree.children[0].children[i].properties, id: wow.join() }
        }
      }
    }
  }

  let html = await unified().use(rehypeStringify).stringify(tree)
  html = tag('section.doc', html)

  //let titles = 


  return html
}

async function saveFile(html, fileName) {
  let docs = join(DIST, 'docs')
  if (!existsSync(docs)) await mkdir(docs)
  let fileTitle

  //TODO find a better way to search for README
  let readmeRegex = /PostCSS <a href="https:\/\/gitter.im\/postcss\/postcss"><img src="https:\/\/img.shields.io\/badge\/Gitter-Join_the_PostCSS_chat-brightgreen.svg" alt="Gitter"><\/a>/g
  if (html.match(readmeRegex)) {
    fileTitle = 'index.html'
  }
  else {
    // TODO eliminate one undefined filename
    fileTitle = fileName + '.html'
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

  let titles = contents.match(/(?<=<p><a(?:.*?)>)(.*?)(?=<)/gm).filter(title => title !== "")
  let chapters = contents.match(/(?<=<p><a(?:.*?)>)(.*?)(?=<)|(?<=<li><a(?:.*?)>)(.*)(?=<\/a)/gm).filter(title => title !== "")
  // TODO: make sidebar links
  let i = 0
  let sidemenu = tag(
    'nav.sidemenu',
    tag(
      'ul',
      titles.map(title => {
        let name = linkHeadings('sidemenu_section', title.toLowerCase().replaceAll(' ', '-'), title)
        let children = findChildren(titles, chapters, i)
        i++
        // TODO stop if there are no children
        // TODO link subheadings and make hashes inside pages
        return tag(
          'li.sidemenu_item',
          tag('div.sidemenu_bar', [
            name,
            tag(`button.sidemenu_controller`, {}, ``)
          ]) +
          tag(
            'ul.sidemenu_children', children.map(child => {
              return tag(
                //'li', tag(
                //'a.sidemenu_child', child))
                //})
                'li', linkSubHeadings(
                  'sidemenu_child', getName(title), getName(child), child))
            })
          )
        )
      })
    )
  )
  return sidemenu
}

function linkHeadings(cls, link, text) {
  return tag(`a.${cls}`, { href: `${link}` }, text)
}

function linkSubHeadings(cls, link, hash, text) {
  let ref = link + '#' + hash
  ref.replaceAll("<code>", "").replaceAll("</code>", "")
  return tag(`a.${cls}`, { href: ref }, text)
}

function findChildren(titles, chapters, i) {
  let titleIndexes = [1,]
  for (let j = 1; j < chapters.length + 1; j++) {
    if (titles.includes(chapters[j])) {
      titleIndexes.push(j)
    }
  }
  let children = chapters.slice(titleIndexes[i] + 1, titleIndexes[i + 1])
  return children
}

function getName(string) {
  return string.toLowerCase().replaceAll(" ", "-")
}

async function run() {
  await downloadProject('postcss')
  let [docs, layout] = await Promise.all([readDocs(), buildLayout()])
  let contents = []
  let sidemenu
  let fileNames = []
  for (let i = 0; i < docs.length; i++) {

    fileNames[i] = docs[i].children[0].children[0].children[0].value.toLowerCase().replaceAll(" ", "-")

    if (docs[i].children[0].children[0].children[0].value === "Documentation") {
      //TODO stop making this html twice and not make index at all
      contents[i] = await makeHTML(docs[i])
      sidemenu = makeSidemenu(contents[i])
    }
  }

  let body = []
  for (let i = 0; i !== docs.length; i++) {
    body[i] = await (makeHTML(docs[i]))
  }

  for (let i = 0; i < body.length + 1; i++) {
    //TODO make sure undefined does not appear all the way up here
    if (body[i] !== undefined) {
      await saveFile(
        layout
          .replace('</nav>', '</nav>' + sidemenu + body[i])
          .replace(/\/assets/g, '/docs/assets'),
        fileNames[i]
      )
      //await rm(join(DIST, 'docs/docs.html'))
    }
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
