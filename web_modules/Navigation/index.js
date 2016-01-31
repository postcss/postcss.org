import React, { Component } from "react"
import { Link } from "react-router"

import styles from "./index.css"

export default class Navbar extends Component {

  render() {
    return (
      <nav className={ styles.root }>
        <Link
          className={ styles.item }
          to="/"
        >
          { "Setup" }
        </Link>
        <Link
          className={ styles.item }
          to="/"
        >
          { "Learn" }
        </Link>
        <Link
          className={ styles.item }
          to="/"
        >
          { "Documentation" }
        </Link>
        <Link
          className={ styles.item }
          to="/"
        >
          { "Plugins" }
        </Link>
      </nav>
    )
  }
}
