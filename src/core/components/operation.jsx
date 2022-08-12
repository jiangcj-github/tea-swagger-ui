import React, { PureComponent } from "react"
import { getList } from "core/utils"
import { getExtensions, sanitizeUrl, escapeDeepLinkPath } from "core/utils"
import { safeBuildUrl } from "core/utils/url"
import { Iterable, List } from "immutable"
import { Collapse, Form, Badge, Tag, StatusTip, ExternalLink } from "@tencent/tea-component";
const { LoadingTip } = StatusTip;

export default class Operation extends PureComponent {

  static defaultProps = {
    operation: null,
    response: null,
    request: null,
    specPath: List(),
    summary: ""
  }

  render() {
    let {
      specPath,
      response,
      request,
      toggleShown,
      onTryoutClick,
      onCancelClick,
      onExecute,
      fn,
      getComponent,
      getConfigs,
      specActions,
      specSelectors,
      authActions,
      authSelectors,
      oas3Actions,
      oas3Selectors
    } = this.props
    let operationProps = this.props.operation

    let {
      deprecated,
      isShown,
      path,
      method,
      op,
      tag,
      operationId,
      allowTryItOut,
      displayRequestDuration,
      tryItOutEnabled,
      executeInProgress
    } = operationProps.toJS()

    let {
      description,
      externalDocs,
      schemes
    } = op

    const externalDocsUrl = externalDocs ? safeBuildUrl(externalDocs.url, specSelectors.url(), { selectedServer: oas3Selectors.selectedServer() }) : ""
    let operation = operationProps.getIn(["op"])
    let responses = operation.get("responses")
    let parameters = getList(operation, ["parameters"])
    let operationScheme = specSelectors.operationScheme(path, method)
    let isShownKey = ["operations", tag, operationId]
    let extensions = getExtensions(operation)

    const Responses = getComponent("responses")
    const Parameters = getComponent( "parameters" )
    const Execute = getComponent( "execute" )
    const Clear = getComponent( "clear" )
    const CollapseSW = getComponent( "Collapse" )
    const Markdown = getComponent("Markdown", true)
    const Schemes = getComponent( "schemes" )
    const OperationServers = getComponent( "OperationServers" )
    const OperationExt = getComponent( "OperationExt" )
    const OperationSummary = getComponent( "OperationSummary" )
    const Link = getComponent( "Link" )

    const { showExtensions } = getConfigs()

    // Merge in Live Response
    if(responses && response && response.size > 0) {
      let notDocumented = !responses.get(String(response.get("status"))) && !responses.get("default")
      response = response.set("notDocumented", notDocumented)
    }

    let onChangeKey = [ path, method ] // Used to add values to _this_ operation ( indexed by path and method )
    const noExec = !tryItOutEnabled || !allowTryItOut;

    return (
      <Collapse onActive={toggleShown} className="operation-collapse">
        <Collapse.Panel
          title={
            <div style={{display: "flex", alignItems: "center", height: "34px"}}>
              <Tag theme="primary" style={{margin: "0 8px 0 0"}}>{method}</Tag>
              {path}
              {deprecated && <Badge dark theme="warning" style={{marginLeft: "8px"}}>已废弃</Badge>}
            </div>
          } 
          id={escapeDeepLinkPath(isShownKey.join("-"))}>
          <div style={{padding: "0 18px"}}>
            <OperationSummary 
              operationProps={operationProps} 
              getComponent={getComponent} 
              authActions={authActions} 
              authSelectors={authSelectors} 
              specPath={specPath} 
            />
            <div style={{margin: "12px 0 20px 0"}}>
              {(operation && operation.size) || operation === null ? null : <LoadingTip />}
              <Form readonly className="form-line-20">
                {description && 
                  <Form.Item label="操作描述">
                    <Form.Text>
                      <Markdown source={description} />
                    </Form.Text>
                  </Form.Item>}
                {externalDocsUrl && 
                  <Form.Item label="外部文档">
                    <Form.Text>
                      <Markdown source={externalDocs?.description} />
                      <ExternalLink href={sanitizeUrl(externalDocsUrl)}>{externalDocsUrl}</ExternalLink>
                    </Form.Text>
                  </Form.Item>}
              </Form>
              {!operation || !operation.size ? null :
                <Parameters
                  parameters={parameters}
                  specPath={specPath.push("parameters")}
                  operation={operation}
                  onChangeKey={onChangeKey}
                  onTryoutClick = { onTryoutClick }
                  onCancelClick = { onCancelClick }
                  tryItOutEnabled = { tryItOutEnabled }
                  allowTryItOut={allowTryItOut}

                  fn={fn}
                  getComponent={ getComponent }
                  specActions={ specActions }
                  specSelectors={ specSelectors }
                  pathMethod={ [path, method] }
                  getConfigs={ getConfigs }
                  oas3Actions={ oas3Actions }
                  oas3Selectors={ oas3Selectors }
                />
              }
              {!tryItOutEnabled ? null :
                <OperationServers
                  getComponent={getComponent}
                  path={path}
                  method={method}
                  operationServers={operation.get("servers")}
                  pathServers={specSelectors.paths().getIn([path, "servers"])}
                  getSelectedServer={oas3Selectors.selectedServer}
                  setSelectedServer={oas3Actions.setSelectedServer}
                  setServerVariableValue={oas3Actions.setServerVariableValue}
                  getServerVariable={oas3Selectors.serverVariableValue}
                  getEffectiveServerValue={oas3Selectors.serverEffectiveValue}
                />
              }
              {noExec ? null : schemes && schemes.size ? 
                <Form>
                  <Form.Item label="传输协议" align="middle">
                    <Schemes schemes={ schemes }
                      path={ path }
                      method={ method }
                      specActions={ specActions }
                      currentScheme={ operationScheme }
                    />
                  </Form.Item>
                </Form> : null}
              {!noExec && <div>
                <Execute
                  operation={ operation }
                  specActions={ specActions }
                  specSelectors={ specSelectors }
                  oas3Selectors={ oas3Selectors }
                  oas3Actions={ oas3Actions }
                  path={ path }
                  method={ method }
                  onExecute={ onExecute }
                  disabled={executeInProgress}
                />
                <span style={{display: "inline-block", width: "12px"}}/>
                {!response ? null :
                  <Clear
                    specActions={ specActions }
                    path={ path }
                    method={ method }
                  />}
              </div>}
              <hr/>
              {!responses ? null :
                <Responses
                  responses={ responses }
                  request={ request }
                  tryItOutResponse={ response }
                  getComponent={ getComponent }
                  getConfigs={ getConfigs }
                  specSelectors={ specSelectors }
                  oas3Actions={oas3Actions}
                  oas3Selectors={oas3Selectors}
                  specActions={ specActions }
                  produces={specSelectors.producesOptionsFor([path, method]) }
                  producesValue={ specSelectors.currentProducesFor([path, method]) }
                  specPath={specPath.push("responses")}
                  path={ path }
                  method={ method }
                  displayRequestDuration={ displayRequestDuration }
                  fn={fn} 
                />}
              {!showExtensions || !extensions.size ? null :
                <OperationExt extensions={ extensions } getComponent={ getComponent } />}
            </div>
          </div>
          
        </Collapse.Panel>
      </Collapse>
    )
  }

}
