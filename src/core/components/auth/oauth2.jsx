import React from "react"
import oauth2Authorize from "core/oauth2-authorize"
import { Select, Form, Justify, H4, Input, Checkbox, Button } from "@tencent/tea-component";

export default class Oauth2 extends React.Component {

  constructor(props, context) {
    super(props, context)
    let { name, schema, authorized, authSelectors } = this.props
    let auth = authorized && authorized.get(name)
    let authConfigs = authSelectors.getConfigs() || {}
    let username = auth && auth.get("username") || ""
    let clientId = auth && auth.get("clientId") || authConfigs.clientId || ""
    let clientSecret = auth && auth.get("clientSecret") || authConfigs.clientSecret || ""
    let passwordType = auth && auth.get("passwordType") || "basic"
    let scopes = auth && auth.get("scopes") || authConfigs.scopes || []
    if (typeof scopes === "string") {
      scopes = scopes.split(authConfigs.scopeSeparator || " ")
    }

    this.state = {
      appName: authConfigs.appName,
      name: name,
      schema: schema,
      scopes: scopes,
      clientId: clientId,
      clientSecret: clientSecret,
      username: username,
      password: "",
      passwordType: passwordType
    }
  }

  close = (e) => {
    e.preventDefault()
    let { authActions } = this.props
    authActions.showDefinitions(false)
  }

  authorize =() => {
    let { authActions, errActions, getConfigs, authSelectors, oas3Selectors } = this.props
    let configs = getConfigs()
    let authConfigs = authSelectors.getConfigs()

    errActions.clear({authId: name,type: "auth", source: "auth"})
    oauth2Authorize({
      auth: this.state,
      currentServer: oas3Selectors.serverEffectiveValue(oas3Selectors.selectedServer()),
      authActions,
      errActions,
      configs,
      authConfigs
    })
  }

  onScopeChange =(values) => {
    console.log(values);
    this.setState({ scopes: values })
  }

  onInputChange =(name, value) => {
    let state = { [name]: value }
    this.setState(state)
  }

  // selectScopes =(e) => {
  //   if (e.target.dataset.all) {
  //     this.setState({
  //       scopes: Array.from((this.props.schema.get("allowedScopes") || this.props.schema.get("scopes")).keys())
  //     })
  //   } else {
  //     this.setState({ scopes: [] })
  //   }
  // }

  logout =(e) => {
    e.preventDefault()
    let { authActions, errActions, name } = this.props
    errActions.clear({authId: name, type: "auth", source: "auth"})
    authActions.logoutWithPersistOption([ name ])
  }

  render() {
    let {
      schema, getComponent, authSelectors, errSelectors, name, specSelectors
    } = this.props
    // const Input = getComponent("Input")
    // const Row = getComponent("Row")
    // const Col = getComponent("Col")
    // const Button = getComponent("Button")
    const AuthError = getComponent("authError")
    // const JumpToPath = getComponent("JumpToPath", true)
    const Markdown = getComponent("Markdown", true)
    // const InitializedInput = getComponent("InitializedInput")

    const { isOAS3 } = specSelectors
    let oidcUrl = isOAS3() ? schema.get("openIdConnectUrl") : null

    // Auth type consts
    const AUTH_FLOW_IMPLICIT = "implicit"
    const AUTH_FLOW_PASSWORD = "password"
    const AUTH_FLOW_ACCESS_CODE = isOAS3() ? (oidcUrl ? "authorization_code" : "authorizationCode") : "accessCode"
    const AUTH_FLOW_APPLICATION = isOAS3() ? (oidcUrl ? "client_credentials" : "clientCredentials") : "application"

    let authConfigs = authSelectors.getConfigs() || {}
    let isPkceCodeGrant = !!authConfigs.usePkceWithAuthorizationCodeGrant

    let flow = schema.get("flow")
    let flowToDisplay = flow === AUTH_FLOW_ACCESS_CODE && isPkceCodeGrant ? flow + " with PKCE" : flow
    let scopes = schema.get("allowedScopes") || schema.get("scopes")
    let authorizedAuth = authSelectors.authorized().get(name)
    let isAuthorized = !!authorizedAuth
    let errors = errSelectors.allErrors().filter( err => err.get("authId") === name)
    let isValid = !errors.filter( err => err.get("source") === "validation").size
    let description = schema.get("description")

    return (
      <div>
        <Justify
          left={<H4>{name} (OAuth2, {flowToDisplay})</H4>}
          right={isAuthorized && <Text theme="success" style={{fontSize: "13px"}}>已授权</Text>}
        />
        <Form readonly className="form-line-20" layout="fixed" fixedLabelWidth={110}>
          {this.state.appName && 
            <Form.Item label="Application">
              <Form.Text>{this.state.appName }</Form.Text>
            </Form.Item>}
          {description && 
            <Form.Item label="描述">
              <Form.Text>
                <Markdown source={ schema.get("description") } />
              </Form.Text>
            </Form.Item>}
          {oidcUrl && 
            <Form.Item label="OpenID Connect URL">
              <Form.Text>{oidcUrl}</Form.Text>
            </Form.Item>}
          {(flow === AUTH_FLOW_IMPLICIT || flow === AUTH_FLOW_ACCESS_CODE) && 
            <Form.Item label="Authorization URL">
              <Form.Text>{schema.get("authorizationUrl")}</Form.Text>
            </Form.Item>}
          {(flow === AUTH_FLOW_PASSWORD || flow === AUTH_FLOW_ACCESS_CODE || flow === AUTH_FLOW_APPLICATION) && 
            <Form.Item label="Flow">
              <Form.Text>{flowToDisplay}</Form.Text>
            </Form.Item>}
        </Form>
        {flow == AUTH_FLOW_PASSWORD && 
          <Form readonly className="form-line-20" layout="fixed" fixedLabelWidth={110}>
            <Form.Item label="username">
              <Form.Text>
                {isAuthorized ? this.state.username :
                  <Input 
                    placeholder="请输入"
                    onChange={(val) => this.onInputChange("username", val)} 
                  />}
              </Form.Text>
            </Form.Item>
            <Form.Item label="password">
              <Form.Text>
                {isAuthorized ? <code>******</code> :
                  <Input 
                    placeholder="请输入"
                    onChange={(val) => this.onInputChange("password", val)} 
                  />}
              </Form.Text>
            </Form.Item>
            <Form.Item label="Credentials In">
              <Form.Text>
                {isAuthorized ? <code>{this.state.passwordType}</code> :
                  <Select 
                    placeholder="请选择"
                    appearance="button"
                    matchButtonWidth={true}
                    onChange={(val) => this.onInputChange("passwordType", val)}
                    options={[
                      {text: "Authorization header", value: "basic"},
                      {text: "Request body", value: "request-body"},
                    ]}
                  />}
              </Form.Text>
            </Form.Item>
          </Form>}
        <Form readonly className="form-line-20" layout="fixed" fixedLabelWidth={110}>
          {(flow === AUTH_FLOW_APPLICATION || flow === AUTH_FLOW_IMPLICIT || flow === AUTH_FLOW_ACCESS_CODE || flow === AUTH_FLOW_PASSWORD) && 
            (!isAuthorized || isAuthorized && this.state.clientId) && 
            <Form.Item label="client_id">
              <Form.Text>
                {isAuthorized ? <code>******</code> :
                  <Input 
                    placeholder="请输入"
                    defaultValue={this.state.clientId}
                    onChange={(val) => this.onInputChange("clientId", val)}
                    required={flow === AUTH_FLOW_PASSWORD}
                  />}
              </Form.Text>
            </Form.Item>}
          {(flow === AUTH_FLOW_APPLICATION || flow === AUTH_FLOW_ACCESS_CODE || flow === AUTH_FLOW_PASSWORD) && !isPkceCodeGrant && 
            <Form.Item label="client_secret">
              <Form.Text>
                {isAuthorized ? <code>******</code> :
                  <Input.Password 
                    placeholder="请输入"
                    defaultValue={this.state.clientSecret}
                    onChange={(val) => this.onInputChange("clientSecret", val)}
                  />}
              </Form.Text>
            </Form.Item>}
          {!isAuthorized && scopes && scopes.size && 
            <Form.Item label="Scopes">
              <Form.Text>
                <Checkbox.Group 
                  layout="column"
                  value={this.state.scopes}
                  disabled={isAuthorized}
                  onChange={(val) => this.onScopeChange(val)}>
                  {[...scopes].map(([name, description]) => 
                    <Checkbox key={name} name={name} tooltip={description}>{name}</Checkbox>)}
                </Checkbox.Group>
              </Form.Text>
            </Form.Item>}
        </Form>
        {errors.valueSeq().map((error, key) => {
          return <AuthError error={error} key={key}/>})
        }
        <Form.Action>
          {isValid &&
            (isAuthorized ? 
              <Button type="error" onClick={this.logout}>取消授权</Button>: 
              <Button type="primary" onClick={this.authorize}>授权</Button>)}
          <Button onClick={this.close}>关闭</Button>
        </Form.Action>
      </div>
    )
  }
}
