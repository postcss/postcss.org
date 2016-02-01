import React from "react"

import style from "./index.css"

import logo from "./postcss.svg"

export default function Hero() {

  return (
    <header className={ style.root } role="banner">
      <h1 className={ style.title }>
        <img
          alt="PostCSS"
          className={ style.logo }
          src={ logo }
        />
      </h1>
      <p className={ style.tagline }>
        { "A tool for transforming CSS with\u00A0JavaScript" }
      </p>
    </header>
  )
}
