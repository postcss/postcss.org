import React, { Component } from "react"

import styles from "./index.css"

export default class Footer extends Component {

  render() {
    return (
      <footer className={ styles.footer }>
        <section>
          <p>{ "Distributed under the MIT License." }</p>
          <p>{ "Found an issue?" }
            <a href="https://github.com/postcss/postcss.org">
              { "Report it!" }
            </a>
          </p>
        </section>
        <section>
          <img alt="Evil Martians Logo" />
        </section>
      </footer>
    )
  }
}
