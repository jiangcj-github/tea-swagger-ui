import React, { Component } from "react"
import PropTypes from "prop-types"
import { Button } from "@tencent/tea-component";

export default class Clear extends Component {

  onClick =() => {
    let { specActions, path, method } = this.props
    specActions.clearResponse( path, method )
    specActions.clearRequest( path, method )
  }

  render(){
    return (
      <Button type="weak" onClick={ this.onClick }>
        重置
      </Button>
    )
  }

  static propTypes = {
    specActions: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
  }
}
