import React, { Component } from "react"
import { Link } from "react-router"

import styles from "./index.css"

export default class Header extends Component {

  render() {
    return (
      <nav className={ styles.nav }>
        <Link
          className={ styles.link }
          to="/"
        >
          { "Learn" }
        </Link>

        <Link
          className={ styles.link }
          to="/"
        >
          { "Get Started" }
        </Link>

        <Link
          className={ styles.link }
          to="/"
        >
          { "Documentation" }
        </Link>

        <Link
          className={ styles.link }
          to="/"
        >
          { "Plugins" }
        </Link>

        <Link
          className={ styles.link }
          to="/"
        >
          { "Blog" }
        </Link>

        <Link
          className={ styles.link }
          to="/"
        >
          { "Get involved" }
        </Link>
      </nav>
    )
  }
}
