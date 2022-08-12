import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Iterable, List } from "immutable"
import ImPropTypes from "react-immutable-proptypes"
import toString from "lodash/toString"
import { Form, Text, Button } from "@tencent/tea-component";


export default class OperationSummary extends PureComponent {

  static propTypes = {
    specPath: ImPropTypes.list.isRequired,
    operationProps: PropTypes.instanceOf(Iterable).isRequired,
    isShown: PropTypes.bool.isRequired,
    toggleShown: PropTypes.func.isRequired,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired,
    authActions: PropTypes.object,
    authSelectors: PropTypes.object,
  }

  static defaultProps = {
    operationProps: null,
    specPath: List(),
    summary: ""
  }

  render() {

    let {
      isShown,
      toggleShown,
      getComponent,
      authActions,
      authSelectors,
      operationProps,
      specPath,
    } = this.props

    let {
      summary,
      isAuthorized,
      method,
      op,
      showSummary,
      path,
      operationId,
      originalOperationId,
      displayOperationId,
    } = operationProps.toJS()

    let {
      summary: resolvedSummary,
    } = op

    let security = operationProps.get("security")

    // const AuthorizeOperationBtn = getComponent("authorizeOperationBtn")
    // const OperationSummaryMethod = getComponent("OperationSummaryMethod")
    // const OperationSummaryPath = getComponent("OperationSummaryPath")
    // const JumpToPath = getComponent("JumpToPath", true)
    // const CopyToClipboardBtn = getComponent("CopyToClipboardBtn", true)

    const hasSecurity = security && !!security.count()
    const securityIsOptional = hasSecurity && security.size === 1 && security.first().isEmpty()
    const allowAnonymous = !hasSecurity || securityIsOptional
    return (
      <Form readonly className="form-line-20">
        <Form.Item label="请求方法">
          <Form.Text>
            {method?.toUpperCase()}
          </Form.Text>
        </Form.Item>
        <Form.Item label="请求路径">
          <Form.Text>
            <Text copyable>{specPath}</Text>
          </Form.Text>
        </Form.Item>
        {showSummary && 
          <Form.Item label="总结描述">
            <Form.Text>
              {toString(resolvedSummary || summary)}
            </Form.Text>
          </Form.Item>}
        {displayOperationId && (originalOperationId || operationId) && 
          <Form.Item label="操作ID">
            <Form.Text>
              {originalOperationId || operationId}
            </Form.Text>
          </Form.Item>}
        {!allowAnonymous && 
          <Form.Item label="身份认证">
            <Form.Text>
              <Button 
                onClick={(evt) => {
                  const applicableDefinitions = authSelectors.definitionsForRequirements(security)
                  authActions.showDefinitions(applicableDefinitions);
                }}
                type={isAuthorized ? "weak" : "primary"}>
                {isAuthorized ? "已认证" : "去认证"}
              </Button>
            </Form.Text>
          </Form.Item>}
      </Form>
    )
  }
}
