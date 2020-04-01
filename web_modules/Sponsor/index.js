import React from "react"

import styles from "./index.css"
import tailwind from "./tailwind-logo.svg"

export default function Sponsor() {

  /* eslint-disable max-len */
  return (
    <section className={ styles.root }>
      <h2 className={ styles.title }>{ "Sponsors" }</h2>
      <ul className={ styles.items }>
        <li className={ styles.item }>
          <a href="https://tailwindcss.com/">
            <img
              alt="Tailwind"
              className={ styles.logo }
              src={ tailwind }
            />
          </a>
        </li>
      </ul>
    </section>
  )
}
