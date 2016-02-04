import React, { Component } from "react"

import styles from "./index.css"

export default class WayFinder extends Component {

  render() {
    return (
      <nav className={ styles.root } role="navigation">
        <ul className={ styles.items }>
          <li className={ styles.item }>
            <a
              className={ styles.itemLink }
              href="https://github.com/postcss/postcss#usage"
            >
              { "Installation & Setup" }
            </a>
          </li>
          <li className={ styles.item }>
            <a
              className={ styles.itemLink }
              href="https://github.com/postcss/postcss/tree/master/docs"
            >
              { "Documentation" }
            </a>
          </li>
          <li className={ styles.item }>
            <a
              className={ styles.itemLink }
              href="https://github.com/postcss/postcss#articles"
            >
              { "Learn" }
            </a>
          </li>
          <li className={ styles.item }>
            <a
              className={ styles.itemLink }
              href="http://postcss.parts/"
            >
              { "Plugins" }
            </a>
          </li>
        </ul>
      </nav>
    )
  }
}
