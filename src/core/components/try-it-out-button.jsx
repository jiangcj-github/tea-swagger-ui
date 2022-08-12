import React from "react"
import PropTypes from "prop-types"
import { Button, Form } from "@tencent/tea-component";

export default class TryItOutButton extends React.Component {

  static propTypes = {
    onTryoutClick: PropTypes.func,
    onResetClick: PropTypes.func,
    onCancelClick: PropTypes.func,
    enabled: PropTypes.bool, // Try it out is enabled, ie: the user has access to the form
    hasUserEditedBody: PropTypes.bool, // Try it out is enabled, ie: the user has access to the form
    isOAS3: PropTypes.bool, // Try it out is enabled, ie: the user has access to the form
  }

  static defaultProps = {
    onTryoutClick: Function.prototype,
    onCancelClick: Function.prototype,
    onResetClick: Function.prototype,
    enabled: false,
    hasUserEditedBody: false,
    isOAS3: false,
  }

  render() {
    const { onTryoutClick, onCancelClick, onResetClick, enabled, hasUserEditedBody, isOAS3 } = this.props

    const showReset = isOAS3 && hasUserEditedBody
    return (
      <Form.Action style={{marginBottom: "20px"}}>
        {
          enabled ? 
          <Button type="error" onClick={ onCancelClick }>退出调试</Button>: 
          <Button type="primary" onClick={onTryoutClick}>开始调试</Button>
        }
        {
          showReset && 
          <Button type="weak" onClick={ onResetClick }>重置</Button>
        }
      </Form.Action>
    )
  }
}
