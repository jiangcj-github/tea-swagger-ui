import React, { Component } from "react"
import cx from "classnames"
import PropTypes from "prop-types"


const noop = () => { }

const ParameterIncludeEmptyPropTypes = {
  isIncluded: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  isIncludedOptions: PropTypes.object,
  onChange: PropTypes.func.isRequired,
}

const ParameterIncludeEmptyDefaultProps = {
  onChange: noop,
  isIncludedOptions: {},
}
export default class ParameterIncludeEmpty extends Component {
  static propTypes = ParameterIncludeEmptyPropTypes
  static defaultProps = ParameterIncludeEmptyDefaultProps

  componentDidMount() {
    const { isIncludedOptions, onChange } = this.props
    const { shouldDispatchInit, defaultValue } = isIncludedOptions
    if (shouldDispatchInit) {
      onChange(defaultValue)
    }
  }

  onCheckboxChange = (val) => {
    const { onChange } = this.props
    onChange(val)
  }

  render() {
    let { isIncluded, isDisabled } = this.props

    return (
      <Checkbox 
        onChange={(val) => this.onCheckboxChange(val)}
        disabled={isDisabled} 
        value={!isDisabled && isIncluded}>
        送空数据
      </Checkbox>
    )
  }
}
