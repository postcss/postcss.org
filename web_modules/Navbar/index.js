import React, { Component } from "react"
import { Link } from "react-router"

import styles from "./index.css"

export default class Navbar extends Component {

  render() {
    return (
      <nav className={ styles.nav }>
        <section className={ styles.left }>
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
        </section>

        <section className={ styles.right }>
          <Link
            className={ styles.item }
            to="/"
          >
            { "Slack" }
          </Link>
          <Link
            className={ styles.item }
            to="/"
          >
            { "Twitter" }
          </Link>
          <Link
            className={ styles.item }
            to="/"
          >
            { "Github" }
          </Link>
        </section>
      </nav>
    )
  }
}
