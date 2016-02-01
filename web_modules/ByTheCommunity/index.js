import React from "react"

import styles from "./index.css"

export default function ByTheCommunity() {

  /* eslint-disable max-len */
  return (
    <section className={ styles.root } role="banner">
      <h2 className={ styles.title }>{ "Built by community for community" }</h2>
      <p className={ styles.body }>
        { "PostCSS developed and maintained by hundreds of open source contributors. Become part of the family — " }
        <a
          className={ styles.submit }
          href="https://github.com/postcss/postcss/compare"
        >
          { "submit your first Pull\u00A0Request!" }
        </a>
      </p>
    </section>
  )
}
