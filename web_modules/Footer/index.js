import React, { Component } from "react"

import styles from "./index.css"
import logo from "./evilmartians.svg"

export default class Footer extends Component {

  render() {
    return (
      <footer className={ styles.root } role="contentinfo">
        <div className={ styles.inner }>
          <div className={ styles.info }>
            <p className={ styles.license }>
              { "Distributed under the MIT License." }
            </p>
            <p className={ styles.issue }>{ "Found an issue?" }
              <a
                className={ styles.report }
                href="https://github.com/postcss/postcss.org/issues"
              >
                { "Report it!" }
              </a>
            </p>
          </div>
          <div className={ styles.logo }>
            <a
              className={ styles.logoLink }
              href="https://evilmartians.com/"
            >
              <img
                alt="Evil Martians"
                className={ styles.logoInner }
                src={ logo }
              />
            </a>
          </div>
        </div>
      </footer>
    )
  }
}
