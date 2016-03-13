import React, { Component, PropTypes } from "react"
import Helmet from "react-helmet"
import Hero from "../../Hero"

import styles from "./index.css"

export default class PageError extends Component {
  static propTypes = {
    error: PropTypes.number,
    errorText: PropTypes.string,
  };

  static defaultProps = {
    error: 404,
    errorText: "Page Not Found",
  };

  render() {
    const {
      error,
      errorText,
    } = this.props

    return (
      <main className={ styles.root }>

        <Helmet
          title={ `${error} - ${errorText}` }
        />

        <div className={ styles.hero }>
          <Hero />
        </div>

        <div className={ styles.inner }>
          <h2>{ 'Whooops!' }</h2>
            <p>
              <strong>{ error }</strong>
              { ' ' }
              { errorText }
            </p>
            {
              error === 404 &&
                <div>
                  <p>
                    { 'The page you requested was not found.' }
                  </p>
                </div>
            }
        </div>
      </main>
    )
  }
}
