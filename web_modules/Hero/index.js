import React, { Component } from "react"

import styles from "./index.css"

export default class Hero extends Component {

  render() {
    return (
      <section className={ styles.hero }>
        <img alt="PostCSS Logo" />
        <button>{ "Github" }</button>
      </section>
    )
  }
}
