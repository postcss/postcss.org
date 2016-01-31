import React, { Component } from "react"

import styles from "./index.css"

export default class Footer extends Component {

  render() {
    return (
      <footer className={ styles.root }>
        <div className={ styles.inner }>
          <div className={ styles.info }>
            <p className={ styles.license }>
              { "Distributed under the MIT License." }
            </p>
            <p className={ styles.issue }>{ "Found an issue?" }
              <a
                className={ styles.report }
                href="https://github.com/postcss/postcss.org"
              >
                { "Report it!" }
              </a>
            </p>
          </div>
          <div className={ styles.logo }>
            <img className={ styles.logoInner } alt="Evil Martians Logo" />
          </div>
        </div>
      </footer>
    )
  }
}
