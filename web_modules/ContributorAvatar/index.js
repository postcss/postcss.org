import React from "react"

const ContributorItem = ({ avatar_url, login, size = 48 }) => {
  return (
    <img
      src={ avatar_url }
      alt={ login }
      title={ login }
      width={ size }
      height={ size }
    />
  )
}

export default ContributorItem
