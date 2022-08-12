import React, { Component } from "react"
import { Map, List } from "immutable"
import { Tabs, TabPanel, StatusTip, Form, H4 } from "@tencent/tea-component";
const { EmptyTip } = StatusTip;

export default class Parameters extends Component {

  constructor(props) {
    super(props)
    this.state = {
      activeId: "parameter",
    }
  }

  static defaultProps = {
    onTryoutClick: Function.prototype,
    onCancelClick: Function.prototype,
    tryItOutEnabled: false,
    allowTryItOut: true,
    onChangeKey: [],
    specPath: [],
  }

  onChange = (param, value, isXml) => {
    let {
      specActions: { changeParamByIdentity },
      onChangeKey,
    } = this.props

    changeParamByIdentity(onChangeKey, param, value, isXml)
  }

  onChangeConsumesWrapper = (val) => {
    let {
      specActions: { changeConsumesValue },
      onChangeKey,
    } = this.props

    changeConsumesValue(onChangeKey, val)
  }

  onChangeMediaType = ({ value, pathMethod }) => {
    let { specActions, oas3Selectors, oas3Actions } = this.props
    const userHasEditedBody = oas3Selectors.hasUserEditedBody(...pathMethod)
    const shouldRetainRequestBodyValue = oas3Selectors.shouldRetainRequestBodyValue(...pathMethod)
    oas3Actions.setRequestContentType({ value, pathMethod })
    oas3Actions.initRequestBodyValidateError({ pathMethod })
    if (!userHasEditedBody) {
      if(!shouldRetainRequestBodyValue) {
        oas3Actions.setRequestBodyValue({ value: undefined, pathMethod })
      }
      specActions.clearResponse(...pathMethod)
      specActions.clearRequest(...pathMethod)
      specActions.clearValidateParams(pathMethod)
    }
  }

  render() {

    let {
      onTryoutClick,
      parameters,
      allowTryItOut,
      tryItOutEnabled,
      specPath,
      fn,
      getComponent,
      getConfigs,
      specSelectors,
      specActions,
      pathMethod,
      oas3Actions,
      oas3Selectors,
      operation,
    } = this.props

    const ParameterRow = getComponent("parameterRow")
    const TryItOutButton = getComponent("TryItOutButton")
    const ContentType = getComponent("contentType")
    const Callbacks = getComponent("Callbacks", true)
    const RequestBody = getComponent("RequestBody", true)

    const isExecute = tryItOutEnabled && allowTryItOut
    const isOAS3 = specSelectors.isOAS3()


    const requestBody = operation.get("requestBody")

    const groupedParametersArr = Object.values(parameters
      .reduce((acc, x) => {
        const key = x.get("in")
        acc[key] ??= []
        acc[key].push(x)
        return acc
      }, {}))
      .reduce((acc, x) => acc.concat(x), [])

    const retainRequestBodyValueFlagForOperation = (f) => oas3Actions.setRetainRequestBodyValueFlag({ value: f, pathMethod });

    const isShowCallback = isOAS3 && operation.get("callbacks");
    const tabs = isShowCallback ? 
    [
      { id: "parameter", label: "参数配置" },
      { id: "callback", label: "回调配置" },
    ] : 
    [
      { id: "parameter", label: "参数配置" },
    ];

    return (
      <div className="opblock-section" style={{marginTop: "12px"}}>
        <Tabs 
          activeId={this.state.activeId}
          tabs={tabs} 
          onActive={(tab) => this.setState({ activeId: tab.id })}>
          <TabPanel id="parameter">
            <div>
              {!groupedParametersArr.length ? 
                <EmptyTip emptyText="配置为空" /> :
                <Form style={{marginTop: "12px"}}>
                  {groupedParametersArr.map((parameter, i) => (
                    <ParameterRow
                      fn={fn}
                      specPath={specPath.push(i.toString())}
                      getComponent={getComponent}
                      getConfigs={getConfigs}
                      rawParam={parameter}
                      param={specSelectors.parameterWithMetaByIdentity(pathMethod, parameter)}
                      key={`${parameter.get("in")}.${parameter.get("name")}`}
                      onChange={this.onChange}
                      onChangeConsumes={this.onChangeConsumesWrapper}
                      specSelectors={specSelectors}
                      specActions={specActions}
                      oas3Actions={oas3Actions}
                      oas3Selectors={oas3Selectors}
                      pathMethod={pathMethod}
                      isExecute={isExecute} 
                    />
                  ))}
                </Form>}
            </div>
            {isOAS3 && requestBody &&
              <Form style={{marginTop: "12px"}}>
                <Form.Item label="Request Body">
                  <ContentType
                    value={oas3Selectors.requestContentType(...pathMethod)}
                    contentTypes={requestBody.get("content", List()).keySeq()}
                    onChange={(value) => {
                      this.onChangeMediaType({ value, pathMethod })
                    }}
                    className="body-param-content-type" 
                    ariaLabel="Request content type"
                    style={{marginBottom: "12px"}}
                  />
                  <RequestBody
                    setRetainRequestBodyValueFlag={retainRequestBodyValueFlagForOperation}
                    userHasEditedBody={oas3Selectors.hasUserEditedBody(...pathMethod)}
                    specPath={specPath.slice(0, -1).push("requestBody")}
                    requestBody={requestBody}
                    requestBodyValue={oas3Selectors.requestBodyValue(...pathMethod)}
                    requestBodyInclusionSetting={oas3Selectors.requestBodyInclusionSetting(...pathMethod)}
                    requestBodyErrors={oas3Selectors.requestBodyErrors(...pathMethod)}
                    isExecute={isExecute}
                    getConfigs={getConfigs}
                    activeExamplesKey={oas3Selectors.activeExamplesMember(
                      ...pathMethod,
                      "requestBody",
                      "requestBody", // RBs are currently not stored per-mediaType
                    )}
                    updateActiveExamplesKey={key => {
                      this.props.oas3Actions.setActiveExamplesMember({
                        name: key,
                        pathMethod: this.props.pathMethod,
                        contextType: "requestBody",
                        contextName: "requestBody", // RBs are currently not stored per-mediaType
                      })
                    }
                    }
                    onChange={(value, path) => {
                      if (path) {
                        const lastValue = oas3Selectors.requestBodyValue(...pathMethod)
                        const usableValue = Map.isMap(lastValue) ? lastValue : Map()
                        return oas3Actions.setRequestBodyValue({
                          pathMethod,
                          value: usableValue.setIn(path, value),
                        })
                      }
                      oas3Actions.setRequestBodyValue({ value, pathMethod })
                    }}
                    onChangeIncludeEmpty={(name, value) => {
                      oas3Actions.setRequestBodyInclusion({
                        pathMethod,
                        value,
                        name,
                      })
                    }}
                    contentType={oas3Selectors.requestContentType(...pathMethod)} 
                  />
                </Form.Item>
              </Form>
            }
          </TabPanel>
          <TabPanel id="callback">
            <Callbacks
              callbacks={Map(operation.get("callbacks"))}
              specPath={specPath.slice(0, -1).push("callbacks")}
            />
          </TabPanel>
        </Tabs>
        {allowTryItOut ? (
          <TryItOutButton
            isOAS3={specSelectors.isOAS3()}
            hasUserEditedBody={oas3Selectors.hasUserEditedBody(...pathMethod)}
            enabled={tryItOutEnabled}
            onCancelClick={this.props.onCancelClick}
            onTryoutClick={onTryoutClick}
            onResetClick={() => oas3Actions.setRequestBodyValue({ value: undefined, pathMethod })}/>
        ) : null}
      </div>
    )
  }
}
