import React from "react"

import styles from "./index.css"
import google from "./google.svg"
import github from "./github.svg"
import facebook from "./facebook.svg"
import wordpress from "./wordpress.svg"
import taobao from "./taobao.svg"
import jetbrains from "./jetbrains.svg"
import wikipedia from "./wikipedia.svg"
import compass from "./compass.svg"

export default function Showcase() {

  /* eslint-disable max-len */
  return (
    <section className={ styles.root }>
      <h2 className={ styles.title }>{ "Trusted by industry leaders" }</h2>
      <ul className={ styles.items }>
        <li className={ styles.item }>
          <img
            alt="Facebook"
            className={ styles.logo }
            src={ facebook }
          />
        </li>
        <li className={ styles.item }>
          <img
            alt="GitHub"
            className={ styles.logo }
            src={ github }
          />
        </li>
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
            alt="Wikipedia"
            className={ styles.logo }
            src={ wikipedia }
          />
        </li>
        <li className={ styles.item }>
          <img
            alt="Jetbrains"
            className={ styles.logo }
            src={ jetbrains }
          />
        </li>
        <li className={ styles.item }>
          <img
            alt="Taobao"
            className={ styles.logo }
            src={ taobao }
          />
        </li>
        <li className={ styles.item }>
          <img
            alt="Compass"
            className={ styles.logo }
            src={ compass }
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
