import React, { Component } from "react"
import { PropTypes } from "react"

// function pageDescription(text) {
//   return text
// }

export default class Page extends Component {

  static propTypes = {
    children: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
    __url: PropTypes.string,
    head: PropTypes.object.isRequired,
    body: PropTypes.string.isRequired,
  };

  static contextTypes = {
    metadata: PropTypes.object.isRequired,
  };

  render() {
    const {
      head,
      body,
    } = this.props

    return (
      <div>

        <h1>{ head.title }</h1>
        {
          body &&
          <div
            dangerouslySetInnerHTML={ { __html: body } }
          />
        }
        { this.props.children }
      </div>
    )
  }
}
