import React from "react"
import Highlight from "react-highlight"
import "highlight.js/styles/tomorrow.css"

import styles from "./index.css"
import autoprefixer from "./autoprefixer.svg"
import cssdb from "./cssdb.svg"
import cssModules from "./css-modules.svg"
import stylelint from "./stylelint.svg"
import lostgrid from "./lost-grid.svg"

export default function InANutShell() {

  /* eslint-disable max-len */
  return (
    <div className={ styles.root }>
      <section className={ styles.item }>
        <div className={ styles.itemInner }>
          <div className={ styles.info }>
            <header className={ styles.header }>
              <img
                alt="Autoprefixer"
                className={ styles.logo }
                src={ autoprefixer }
              />
              <h2 className={ styles.title }>
                { "Increase code readability" }
              </h2>
            </header>
            <p className={ styles.body }>
              { "Add vendor prefixes to CSS rules using values from Can I Use. " }
              <a
                className={ styles.tool }
                href="https://github.com/postcss/autoprefixer"
              >
                { "Autoprefixer" }
              </a>
              { " will use the data based on current browser popularity and property support to apply prefixes for\u00A0you." }
            </p>
          </div>
          <div className={ styles.example }>
            <figure className={ styles.figure }>
              <pre className={ styles.pre }>
                <Highlight className={ styles.code + " css" }>
                  { ":fullscreen {" }<br />
                  { "}" }
                </Highlight>
              </pre>
              <figcaption className={ styles.caption }>
                { "CSS input" }
              </figcaption>
            </figure>
            <figure className={ styles.figureOutput }>
              <pre className={ styles.pre }>
                <Highlight className={ styles.code + " css" }>
                  { ":" }
                  <span className={ styles.highlight }>
                    { "-webkit-" }
                  </span>
                  { ":full-screen {" }<br />
                  { "}" }<br />
                  { ":" }
                  <span className={ styles.highlight }>
                    { "-moz-" }
                  </span>
                  { ":full-screen {" }<br />
                  { "}" }<br />
                  { ":full-screen {" }<br />
                  { "}" }<br />
                </Highlight>
              </pre>
              <figcaption className={ styles.captionOutput }>
                { "CSS output" }
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
      <section className={ styles.itemAlt }>
        <div className={ styles.itemInnerAlt }>
          <div className={ styles.infoAlt }>
            <header className={ styles.header }>
              <img
                alt="Cssnext"
                className={ styles.logo }
                src={ cssdb }
              />
              <h2 className={ styles.title }>
                { "Use tomorrow’s CSS today!" }
              </h2>
            </header>
            <p className={ styles.body }>
              <a
                className={ styles.tool }
                href="https://preset-env.cssdb.org/"
                target="_blank"
              >
                { "PostCSS Preset Env" }
              </a>
              { " lets you convert modern CSS into something most browsers can understand, determining the polyfills you need based on your targeted browsers or runtime environments, using " }
              <a
                className={ styles.tool }
                href="https://cssdb.org/"
                target="_blank"
              >
                { "cssdb" }
              </a>
              { "." }
            </p>
          </div>
          <div className={ styles.example }>
            <figure className={ styles.figure }>
              <pre className={ styles.pre }>
                <Highlight className={ styles.code + " css" }>
                  <br />
                  { "@custom-media --med (width <= 50rem);" }<br /><br />
                  { "@media (--med) {" }<br />
                  { "\u00A0\u00A0a { " }<br />
                  { "\u00A0\u00A0\u00A0\u00A0&:hover {" }<br />
                  { "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0color: color-mod(black alpha(54%));" }<br />
                  { "\u00A0\u00A0\u00A0\u00A0}" }<br />
                  { "\u00A0\u00A0}" }<br />
                  { "}" }<br />
                </Highlight>
              </pre>
              <figcaption className={ styles.caption }>
                { "CSS input" }
              </figcaption>
            </figure>
            <figure className={ styles.figureOutput }>
              <pre className={ styles.pre }>
                <Highlight className={ styles.code + " css" }>
                  <span className={ styles.highlight }>
                    { "@media (max-width: 50rem) {" }
                  </span>
                  <br />
                  <span className={ styles.highlight }>
                    { "\u00A0\u00A0a:hover" }
                  </span>
                  { "\u00A0\u00A0{ " }
                  <br />
                  { "\u00A0\u00A0\u00A0\u00A0color: " }
                  <span className={ styles.highlight }>
                    { "rgba(0, 0, 0, 0.54)" }
                  </span>
                  { ";" }<br />
                  { "\u00A0\u00A0}" }<br />
                  { "} " }
                </Highlight>
              </pre>
              <figcaption className={ styles.captionOutput }>
                { "CSS output" }
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
      <section className={ styles.item }>
        <div className={ styles.itemInner }>
          <div className={ styles.info }>
            <header className={ styles.header }>
              <img
                alt="CSS Modules"
                className={ styles.logo }
                src={ cssModules }
              />
              <h2 className={ styles.title }>
                { "The end of global\u00A0CSS" }
              </h2>
            </header>
            <p className={ styles.body }>
              <a
                className={ styles.tool }
                href="https://github.com/css-modules/css-modules"
              >
                { "CSS Modules" }
              </a>
              { " means you never need to worry about your names being too generic, just use whatever makes the most sense." }
            </p>
          </div>
          <div className={ styles.example }>
            <figure className={ styles.figure }>
              <pre className={ styles.pre }>
                <Highlight className={ styles.code + " css" }>
                  { ".name {" }<br />
                  { "\u00A0\u00A0color: gray;" }<br />
                  { "}" }
                </Highlight>
              </pre>
              <figcaption className={ styles.caption }>
                { "CSS input" }
              </figcaption>
            </figure>
            <figure className={ styles.figureOutput }>
              <pre className={ styles.pre }>
                <Highlight className={ styles.code + " css" }>
                  <span className={ styles.highlight }>
                    { ".Logo" }
                  </span>
                  { "__name__" }
                  <span className={ styles.highlight }>
                    { "SVK0g" }
                  </span>
                  { " {" }<br />
                  { "\u00A0\u00A0color: gray;" }<br />
                  { "}" }
                </Highlight>
              </pre>
              <figcaption className={ styles.captionOutput }>
                { "CSS output" }
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
      <section className={ styles.itemAlt }>
        <div className={ styles.itemInnerAlt }>
          <div className={ styles.infoAlt }>
            <header className={ styles.header }>
              <img
                alt="stylelint"
                className={ styles.logo }
                src={ stylelint }
              />
              <h2 className={ styles.title }>
                { "Avoid errors in your\u00A0CSS" }
              </h2>
            </header>
            <p className={ styles.body }>
              { "Enforce consistent conventions and avoid errors in your stylesheets with " }
              <a
                className={ styles.tool }
                href="http://stylelint.io/"
              >
                { "stylelint" }
              </a>
              { ", a modern CSS linter. It supports the latest CSS syntax, as well as CSS-like syntaxes, such as SCSS." }
            </p>
          </div>
          <div className={ styles.example }>
            <figure className={ styles.figure }>
              <pre className={ styles.pre }>
                <Highlight className={ styles.code + " css" }>
                  { "a { " }<br />
                  { "\u00A0\u00A0color: #d3;" }<br />
                  { "}" }<br />
                </Highlight>
              </pre>
              <figcaption className={ styles.caption }>
                { "CSS input" }
              </figcaption>
            </figure>
            <figure className={ styles.figureOutput }>
              <pre className={ styles.pre }>
                <Highlight className={ styles.code + " bash" }>
                  <u>{ "app.css" }</u><br />
                  { "2:10 Invalid hex color" }
                </Highlight>
              </pre>
              <figcaption className={ styles.captionOutput }>
                { "Console output" }
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
      <section className={ styles.item }>
        <div className={ styles.itemInner }>
          <div className={ styles.info }>
            <header className={ styles.header }>
              <img
                alt="LostGrid"
                className={ styles.logo }
                src={ lostgrid }
              />
              <h2 className={ styles.title }>
                { "Powerful grid system" }
              </h2>
            </header>
            <p className={ styles.body }>
              <a
                className={ styles.tool }
                href="https://github.com/peterramsing/lost"
              >
                { "LostGrid" }
              </a>

              { " makes use of calc() to create stunning grids based on fractions you define without having to pass a lot of options." }

            </p>
          </div>
          <div className={ styles.example }>
            <figure className={ styles.figure }>
              <pre className={ styles.pre }>
                <Highlight className={ styles.code + " css" }>
                  { "div {" }<br />
                  { "\u00A0\u00A0lost-column: 1/3"  } <br />
                  { "}" }
                </Highlight>
              </pre>
              <figcaption className={ styles.caption }>
                { "CSS input" }
              </figcaption>
            </figure>
            <figure className={ styles.figureOutput }>
              <pre className={ styles.pre }>
                <Highlight className={ styles.code + " css" }>
                  { "div {" }<br />
                  { "\u00A0\u00A0width: calc(99.9% * 1/3 - " } <br />
                  { "\u00A0\u00A0(30px - 30px * 1/3));" } <br />
                  { "}" }

                  <br />

                  { "div:nth-child(1n) {" }<br />
                  { "\u00A0\u00A0float: left;" } <br />
                  { "\u00A0\u00A0margin-right: 30px;" } <br />
                  { "\u00A0\u00A0clear: none;" } <br />
                  { "}" }

                  <br />

                  { "div:last-child {" }<br />
                  { "\u00A0\u00A0margin-right: 0;" } <br />
                  { "}" }

                  <br />

                  { "div:nth-child(3n) {" }<br />
                  { "\u00A0\u00A0margin-right: 0;" } <br />
                  { "\u00A0\u00A0float: right;" } <br />
                  { "}" }

                  <br />

                  { "div:nth-child(3n + 1) {" }<br />
                  { "\u00A0\u00A0clear: both;" } <br />
                  { "}" }
                </Highlight>
              </pre>
              <figcaption className={ styles.captionOutput }>
                { "CSS output" }
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
    </div>
  )
}
