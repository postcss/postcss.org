import React from "react"

import styles from "./index.css"

import logo from "./postcss.svg"

export default function Hero() {

  return (
    <header className={ styles.root } role="banner">
      <h1 className={ styles.title }>
        <img
          alt="PostCSS"
          className={ styles.logo }
          src={ logo }
        />
      </h1>
      <p className={ styles.tagline }>
        { "A tool for transforming CSS with\u00A0JavaScript" }
      </p>
    </header>
  )
}
