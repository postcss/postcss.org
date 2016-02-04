import React from "react"

import styles from "./index.css"
import autoprefixer from "./autoprefixer.svg"
import cssnext from "./cssnext.svg"
import cssModules from "./css-modules.svg"
import stylelint from "./stylelint.svg"

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
              <pre className={ styles.code }>
                <code>
                  { ":fullscreen {" }<br/>
                  { "}" }
                </code>
              </pre>
              <figcaption className={ styles.caption }>
                { "CSS input" }
              </figcaption>
            </figure>
            <figure className={ styles.figureOutput }>
              <pre className={ styles.code }>
                <code>
                  { ":" }
                  <span className={ styles.highlight }>
                    { "-webkit-" }
                  </span>
                  { ":full-screen {" }<br/>
                  { "}" }<br/>
                  { ":" }
                  <span className={ styles.highlight }>
                    { "-moz-" }
                  </span>
                  { ":full-screen {" }<br/>
                  { "}" }<br/>
                  { ":full-screen {" }<br/>
                  { "}" }<br/>
                </code>
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
                src={ cssnext }
              />
              <h2 className={ styles.title }>
                { "Use tomorrows CSS,\u00A0today!" }
              </h2>
            </header>
            <p className={ styles.body }>
              { "Write future-proof CSS and forget old preprocessor specific syntax. Use the latest CSS syntax today with " }
              <a
                className={ styles.tool }
                href="http://cssnext.io/"
              >
                { "cssnext" }
              </a>
              { ". It transforms CSS specs into more compatible CSS so you don’t need to wait for browser\u00A0support." }
            </p>
          </div>
          <div className={ styles.example }>
            <figure className={ styles.figure }>
              <pre className={ styles.code }>
                <code>
                  { ":root { " }<br/>
                  { "\u00A0\u00A0--red: #d33;" }<br/>
                  { "}" }<br/>
                  { "a { " }<br/>
                  { "\u00A0\u00A0&:hover {" }<br/>
                  { "\u00A0\u00A0\u00A0\u00A0color: color(var(--red) a(54%));" }<br/>
                  { "\u00A0\u00A0}" }<br/>
                  { "}" }
                </code>
              </pre>
              <figcaption className={ styles.caption }>
                { "CSS input" }
              </figcaption>
            </figure>
            <figure className={ styles.figureOutput }>
              <pre className={ styles.code }>
                <code>
                  <span className={ styles.highlight }>
                    { "a:hover" }
                  </span>
                  { " { " }
                  <br/>
                  { "\u00A0\u00A0color: " }
                  <span className={ styles.highlight }>
                    { "#dd3333" }
                  </span>
                  { ";" }<br/>
                  { "\u00A0\u00A0color: " }
                  <span className={ styles.highlight }>
                    { "rgba(221, 51, 51, 0.54)" }
                  </span>
                  { ";" }<br/>
                  { "}" }<br/>
                </code>
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
                { "The end of the global\u00A0CSS" }
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
              <pre className={ styles.code }>
                <code>
                  { ".name {" }<br/>
                  { "\u00A0\u00A0color: gray;" }<br/>
                  { "}" }
                </code>
              </pre>
              <figcaption className={ styles.caption }>
                { "CSS input" }
              </figcaption>
            </figure>
            <figure className={ styles.figureOutput }>
              <pre className={ styles.code }>
                <code>
                  <span className={ styles.highlight }>
                    { ".Logo" }
                  </span>
                  { "__name__" }
                  <span className={ styles.highlight }>
                    { "SVK0g" }
                  </span>
                  { " {" }<br/>
                  { "\u00A0\u00A0color: gray;" }<br/>
                  { "}" }
                </code>
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
              <pre className={ styles.code }>
                <code>
                  { "a { " }<br/>
                  { "\u00A0\u00A0color: #d3;" }<br/>
                  { "}" }<br/>
                </code>
              </pre>
              <figcaption className={ styles.caption }>
                { "CSS input" }
              </figcaption>
            </figure>
            <figure className={ styles.figureOutput }>
              <pre className={ styles.code }>
                <code>
                  <u>{ "app.css" }</u><br/>
                  { "2:10 Invalid hex color" }
                </code>
              </pre>
              <figcaption className={ styles.captionOutput }>
                { "Console output" }
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
    </div>
  )
}
