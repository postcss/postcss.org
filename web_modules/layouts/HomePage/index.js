import React, { Component } from "react"
import { PropTypes } from "react"
import Helmet from "react-helmet"

import Hero from "../../Hero"
import InANutshell from "../../InANutshell"
import WayFinder from "../../WayFinder"
import Sponsor from "../../Sponsor"
import Showcase from "../../Showcase"
import ByTheCommunity from "../../ByTheCommunity"

import styles from "./index.css"

export default class HomePage extends Component {

  static propTypes = {
    children: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
    __url: PropTypes.string,
    head: PropTypes.object.isRequired,
    body: PropTypes.string,
  };

  static contextTypes = {
    metadata: PropTypes.object.isRequired,
  };

  render() {
    const {
      pkg,
      __url,
    } = this.context.metadata

    const {
      head,
    } = this.props

    return (
      <main className={ styles.root } role="main">
        <Helmet
          title={ head.title }
          meta={ meta }
        />
        <div className={ styles.hero }>
          <Hero />
        </div>
        <div className={ styles.inANutshell }>
          <InANutshell />
        </div>
        <div className={ styles.wayFinder }>
          <WayFinder />
        </div>
        <div className={ styles.sponsor }>
          <Sponsor />
        </div>
        <div className={ styles.showcase }>
          <Showcase />
        </div>
        <div className={ styles.byTheCommunity }>
          <ByTheCommunity />
        </div>
        { this.props.children }
      </main>
    )
  }
}
