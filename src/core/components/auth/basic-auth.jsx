import React from "react"
import { H4, Justify, Text, Input, Form } from "@tencent/tea-component";

export default class BasicAuth extends React.Component {

  constructor(props, context) {
    super(props, context)
    let { schema, name } = this.props

    let value = this.getValue()
    let username = value.username

    this.state = {
      name: name,
      schema: schema,
      value: !username ? {} : {
        username: username
      }
    }
  }

  getValue () {
    let { authorized, name } = this.props
    return authorized && authorized.getIn([name, "value"]) || {}
  }

  onChange = (name, value) => {
    let { onChange } = this.props
    let newValue = this.state.value
    newValue[name] = value
    this.setState({ value: newValue })
    onChange(this.state)
  }

  render() {
    let { schema, getComponent, name, errSelectors } = this.props
    // const Input = getComponent("Input")
    // const Row = getComponent("Row")
    // const Col = getComponent("Col")
    const AuthError = getComponent("authError")
    // const JumpToPath = getComponent("JumpToPath", true)
    const Markdown = getComponent("Markdown", true)
    let username = this.getValue().username
    let errors = errSelectors.allErrors().filter( err => err.get("authId") === name)

    return (
      <div>
        <Justify
          left={<H4>Basic authorization</H4>}
          right={username && <Text theme="success" style={{fontSize: "13px"}}>已授权</Text>}
        />
        <Form readonly className="form-line-20" layout="fixed" fixedLabelWidth={110}>
          {schema.get("description") &&
            <Form.Item label="描述">
              <Form.Text>
                <Markdown source={ schema.get("description") } />
              </Form.Text>
            </Form.Item>}
          <Form.Item label="用户名">
            <Form.Text>
              {username ? <code>{username}</code> : 
                <Input 
                  placeholder="请输入"
                  onChange={(val) => this.onChange("username", val)} 
                />
              }
            </Form.Text>
          </Form.Item>
          <Form.Item label="密码">
            <Form.Text>
              {username ? <code>******</code> : 
                <Input 
                  placeholder="请输入"
                  onChange={(val) => this.onChange("password", val)} 
                />
              }
            </Form.Text>
          </Form.Item>
        </Form>
        {errors.valueSeq().map( (error, key) => {
          return <AuthError error={error} key={key}/>})
        }
      </div>
    )
  }

}
