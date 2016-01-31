import React, { Component } from "react"

import styles from "./index.css"

export default class Footer extends Component {

  render() {
    return (
      <footer className={ styles.root }>
        <div className={ styles.inner }>
          <section className={ styles.info }>
            <p>{ "Distributed under the MIT License." }</p>
            <p>{ "Found an issue?" }
              <a
                className={ styles.report }
                href="https://github.com/postcss/postcss.org"
              >
                { "Report it!" }
              </a>
            </p>
          </section>
          <section>
            <img className={ styles.logo } alt="Evil Martians Logo" />
          </section>
        </div>
      </footer>
    )
  }
}
