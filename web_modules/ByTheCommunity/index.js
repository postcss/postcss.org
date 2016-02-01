import React from "react"

import style from "./index.css"

export default function ByTheCommunity() {

  /* eslint-disable max-len */
  return (
    <section className={ style.root } role="banner">
      <h2 className={ style.title }>{ "Built by community for community" }</h2>
      <p className={ style.body }>
        { "PostCSS developed and maintained by hundreds of open source contributors. Become part of the family — " }
        <a
          className={ style.submit }
          href="https://github.com/postcss/postcss/compare"
        >
          { "submit your first Pull\u00A0Request!" }
        </a>
      </p>
    </section>
  )
}
