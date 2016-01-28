import React, { Component } from "react"
import { PropTypes } from "react"
import Helmet from "react-helmet"
import invariant from "invariant"
import Hero from "Hero"

import styles from "./index.css"

export default class HomePage extends Component {

  static propTypes = {
    children: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
    __url: PropTypes.string.isRequired,
    head: PropTypes.object.isRequired,
    body: PropTypes.string.isRequired,
  }

  static contextTypes = {
    metadata: PropTypes.object.isRequired,
  }

  render() {
    const {
      pkg,
    } = this.context.metadata

    const {
      head,
      body,
    } = this.props

    invariant(typeof head.title === "string", "Your page needs a title")

    const meta = [
      { property: "og:title", content: head.title },
      { property: "og:type", content: "article" },
      { property: "og:url", content: this.props.__url },
      // { property: "og:description", content: pageDescription(body) },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: head.title },
      { name: "twitter:creator", content: `@${ pkg.twitter }` },
      // { name: "twitter:description", content: pageDescription(body) },
    ]

    return (
      <div>
       <section>
          <Helmet
            title={ head.title }
            meta={ meta }
          />

          <Hero />
        </section>

        <section className={ styles.wrapper }>
          {
            body &&
            <div
              dangerouslySetInnerHTML={ { __html: body } }
            />
          }
          { this.props.children }
          </section>
      </div>
    )
  }
}
