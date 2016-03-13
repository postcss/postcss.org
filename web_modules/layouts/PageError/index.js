import React, { Component, PropTypes } from "react"
import Helmet from "react-helmet"

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
      <div>
        <Helmet
          title={ `${error} - ${errorText}` }
        />
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
                  { '404 Not found' }
                </p>
              </div>
          }
      </div>
    )
  }
}
