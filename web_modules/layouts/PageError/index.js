import React, { Component, PropTypes } from "react"
import { Link } from "react-router"
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

  renderNotFoundError(error) {
    if (error === 404) {
      return <span>{ "The page you requested was not found." }</span>
    }
  }

  render() {
    const {
      error,
      errorText,
    } = this.props

    return (
      <main>

        <Helmet
          title={ `${error} - ${errorText}` }
        />

        <Hero />

        <section className={ styles.item }>
          <div className={ styles.itemInner }>
            <header>
              <h2 className={ styles.title }>
                { "Whooops!" }
              </h2>
            </header>
            <p className={ styles.body }>
              <strong className={ styles.error }>{ error }</strong>
              { " " }
              { errorText } <br />
              { this.renderNotFoundError(error) } <br />
            </p>
            <p className={ styles.redirectMessage }>
              { "Return to the " }
              <Link
                to="/"
                className={ styles.link }
              >
                { "homepage" }
              </Link>
            </p>
          </div>
        </section>

      </main>
    )
  }
}
