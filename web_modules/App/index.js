import React, { Component } from "react"
import { PropTypes } from "react"
import Helmet from "react-helmet"

import Navigation from "Navigation"
import Social from "Social"
import Footer from "Footer"

import styles from "./index.css"

export default class Wrapper extends Component {

  static propTypes = {
    children: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
  };

  static contextTypes = {
    metadata: PropTypes.object.isRequired,
  };

  render() {
    const {
      pkg,
    } = this.context.metadata

    return (
      <div className={ styles.root }>
          <Helmet
            meta={ [
              { property: "og:site_name", content: pkg.name },
              { name: "twitter:site", content: `@${ pkg.twitter }` },
            ] }
          />
          <div className={ styles.children }>
            { this.props.children }
          </div>
          <Navigation />
          <Social />
          <Footer />
      </div>
    )
  }
}
