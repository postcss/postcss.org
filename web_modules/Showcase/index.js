import React from "react"

import styles from "./index.css"
import google from "./google.svg"
import wordpress from "./wordpress.svg"
import taobao from "./taobao.svg"
import webpack from "./webpack.svg"

export default function Showcase() {

  /* eslint-disable max-len */
  return (
    <section className={ styles.root }>
      <h2 className={ styles.title }>{ "Trusted by industry leaders" }</h2>
      <ul className={ styles.items }>
        <li className={ styles.item }>
          <img
            alt="Google"
            className={ styles.logo }
            src={ google }
          />
        </li>
        <li className={ styles.item }>
          <img
            alt="Wordpress"
            className={ styles.logo }
            src={ wordpress }
          />
        </li>
        <li className={ styles.item }>
          <img
            alt="Webpack"
            className={ styles.logo }
            src={ webpack }
          />
        </li>
        <li className={ styles.item }>
          <img
            alt="Taobao"
            className={ styles.logo }
            src={ taobao }
          />
        </li>
      </ul>
      <p className={ styles.callToAction }>
        { "Is your company using PostCSS? " }
        <a
          className={ styles.letUsKnow }
          href="https://twitter.com/postcss"
        >
          { "Let us\u00A0know!" }
        </a>
      </p>
    </section>
  )
}
