import React from "react"
import { PropTypes } from "react"
import styles from "./index.css"

export default function Button({
  color,
  className,
  children,
}) {
  const styles = {
    color: color,
    background: Button.types[className],
  }

  return (
    <button className={ styles.root } style={ styles }>{ children }</button>
  )
}
Button.propTypes = {
  color: PropTypes.string,
  /**
   * inherit from className
   */
  background: PropTypes.string,
}
Button.defaultProps = {
  color: "#FFF",
  background: "",
}
Button.types = {
  primary: "#50617A",
  secondary: "#75325A",
}
