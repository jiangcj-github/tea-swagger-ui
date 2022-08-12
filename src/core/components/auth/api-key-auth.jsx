import React from "react"
import PropTypes from "prop-types";
import { H4, Justify, Text, Input, Form } from "@tencent/tea-component";

export default class ApiKeyAuth extends React.Component {
  static propTypes = {
    authorized: PropTypes.object,
    getComponent: PropTypes.func.isRequired,
    errSelectors: PropTypes.object.isRequired,
    schema: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func
  }

  constructor(props, context) {
    super(props, context)
    let { name, schema } = this.props
    let value = this.getValue()

    this.state = {
      name: name,
      schema: schema,
      value: value
    }
  }

  getValue () {
    let { name, authorized } = this.props

    return authorized && authorized.getIn([name, "value"])
  }

  onChange = (value) => {
    let { onChange } = this.props
    let newState = Object.assign({}, this.state, { value: value })
    this.setState(newState)
    onChange(newState)
  }

  render() {
    let { schema, getComponent, errSelectors, name } = this.props
    // const Input = getComponent("Input")
    // const Row = getComponent("Row")
    // const Col = getComponent("Col")
    const AuthError = getComponent("authError")
    const Markdown = getComponent("Markdown", true)
    // const JumpToPath = getComponent("JumpToPath", true)
    let value = this.getValue()
    let errors = errSelectors.allErrors().filter( err => err.get("authId") === name)

    return (
      <>
        <Justify
          left={<H4><code>{ name || schema.get("name") }</code>&nbsp;(apiKey)</H4>}
          right={value && <Text theme="success" style={{fontSize: "13px"}}>已授权</Text>}
        />
        <Form readonly className="form-line-20" layout="fixed" fixedLabelWidth={110}>
          {schema.get("description") &&
            <Form.Item label="描述">
              <Form.Text>
                <Markdown source={ schema.get("description") } />
              </Form.Text>
            </Form.Item>}
          <Form.Item label="Name">
            <Form.Text>
              <code>{ schema.get("name") }</code>
            </Form.Text>
          </Form.Item>
          <Form.Item label="In">
            <Form.Text>
              <code>{ schema.get("in") }</code>
            </Form.Text>
          </Form.Item>
          <Form.Item label="Value">
            <Form.Text>
              {value ? <code> ****** </code> : 
                <Input 
                  placeholder="请输入"
                  onChange={(val) => this.onChange(val)} 
                />
              }
            </Form.Text>
          </Form.Item>
        </Form>
        {errors.valueSeq().map( (error, key) => {
          return <AuthError error={error} key={key}/>})
        }
      </>
    )
  }
}
