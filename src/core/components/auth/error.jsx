import React from "react"
import PropTypes from "prop-types";
import { Alert, H4 } from "@tencent/tea-component";

export default class AuthError extends React.Component {

  static propTypes = {
    error: PropTypes.object.isRequired
  }

  render() {
    let { error } = this.props

    let level = error.get("level")
    let message = error.get("message")
    let source = error.get("source")

    return (
      <Alert type="error" style={{margin: "20px 0 0 0"}}>
        <H4>{ source } { level }</H4>
        <div>{message}</div>
      </Alert>
    )
  }
}
