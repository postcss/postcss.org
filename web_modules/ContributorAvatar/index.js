import React, { PropTypes } from "react"
import LazyLoad from "react-lazy-load"

const ContributorItem = ({ avatar_url, login, size = 48 }) => {
  return (
    <LazyLoad>
      <img
        src={ avatar_url }
        alt={ login }
        title={ login }
        width={ size }
        height={ size }
      />
    </LazyLoad>
  )
}

ContributorItem.propTypes = {
  avatar_url: PropTypes.string,
  login: PropTypes.string,
  size: PropTypes.number,
}

export default ContributorItem
