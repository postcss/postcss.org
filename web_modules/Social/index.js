import React, { Component } from "react"

import styles from "./index.css"

export default class Social extends Component {

  render() {
    return (
      <aside className={ styles.root } role="complementary">
        <ul className={ styles.items }>
          <li className={ styles.item }>
            <a
              className={ styles.itemLinkTwitter }
              href="https://twitter.com/postcss"
            >
              { "Twitter" }
            </a>
          </li>
          <li className={ styles.item }>
            <a
              className={ styles.itemLinkGitter }
              href="https://gitter.im/postcss/postcss"
            >
              { "Gitter" }
            </a>
          </li>
          <li className={ styles.item }>
            <a
              className={ styles.itemLinkGithub }
              href="https://github.com/postcss/postcss"
            >
              { "Github" }
            </a>
          </li>
        </ul>
      </aside>
    )
  }
}
