import React from "react"
import { Select } from "@tencent/tea-component";

export default class Schemes extends React.Component {

  UNSAFE_componentWillMount() {
    let { schemes } = this.props

    //fire 'change' event to set default 'value' of select
    this.setScheme(schemes.first())
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if ( !this.props.currentScheme || !nextProps.schemes.includes(this.props.currentScheme) ) {
      // if we don't have a selected currentScheme or if our selected scheme is no longer an option,
      // then fire 'change' event and select the first scheme in the list of options
      this.setScheme(nextProps.schemes.first())
    }
  }

  onChange =(value) => {
    this.setScheme(value);
  }

  setScheme = ( value ) => {
    let { path, method, specActions } = this.props
    specActions.setScheme( value, path, method )
  }

  render() {
    let { schemes, currentScheme } = this.props
    const options = schemes.valueSeq().map(scheme => {
      return {
        value: scheme,
        text: scheme,
      }
    });
    return (
      <Select 
        onChange={this.onChange} 
        value={currentScheme} 
        placeholder="请选择协议"
        style={{width: "200px"}}
        options={options}
        appearance="button"
        matchButtonWidth={true}
      />
    )
  }
}
