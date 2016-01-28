import React, { Component } from "react"

import styles from "./index.css"

export default class Footer extends Component {

  render() {
    return (
      <footer className={ styles.footer }>
        <div className={ styles.footer_wrap }>
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
        </div>
      </footer>
    )
  }
}
