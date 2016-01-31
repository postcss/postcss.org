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
      </nav>
    )
  }
}
