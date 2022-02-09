import { join } from 'path'
import { compileFile } from 'pug'

 function transformIndexHtml(html, { filename: htmlfile }) {
  let pugSrc = html.match(/<pug src="(.*)".*?\/.*?>/gi)[0]
    .replace(/<pug src="/gi, '')
    .replace(/".*?\/.*?>/gi, '')
  let filedir = htmlfile.replace(/(.*)[\\/].*\.html$/, '$1')
  let filepath = join(filedir, pugSrc)
  return compileFile(filepath)()
}

export default function pugPlugin () {
  return {
    name: 'vite-plugin-pug',
    transformIndexHtml: {
        enforce: 'pre',
        transform: transformIndexHtml
    }
  }
}
