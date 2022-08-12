import React from "react"
import ImPropTypes from "react-immutable-proptypes"

const EnumModel = ({ value, getComponent }) => {
  let ModelCollapse = getComponent("ModelCollapse")
  return <span className="prop-enum">
    <span style={{marginRight: "8px"}}>Enum:</span>
    <ModelCollapse expanded={true}>
      [ { value.join(", ") } ]
    </ModelCollapse>
  </span>
}
EnumModel.propTypes = {
  value: ImPropTypes.iterable,
  getComponent: ImPropTypes.func
}

export default EnumModel