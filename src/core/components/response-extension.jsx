import React from "react"
import PropTypes from "prop-types"

export const ResponseExtension = ({ xKey, xVal }) => {
    return <div>{ xKey }: { String(xVal) }</div>
}
ResponseExtension.propTypes = {
  xKey: PropTypes.string,
  xVal: PropTypes.any
}

export default ResponseExtension
