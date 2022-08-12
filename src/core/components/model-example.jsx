import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import cx from "classnames"
import randomBytes from "randombytes"
import { H3, Segment, Table } from "@tencent/tea-component";

export default class ModelExample extends React.Component {
  static propTypes = {
    getComponent: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    schema: PropTypes.object.isRequired,
    example: PropTypes.any.isRequired,
    isExecute: PropTypes.bool,
    getConfigs: PropTypes.func.isRequired,
    specPath: ImPropTypes.list.isRequired,
    includeReadOnly: PropTypes.bool,
    includeWriteOnly: PropTypes.bool,
  }

  constructor(props, context) {
    super(props, context)
    let { getConfigs, isExecute } = this.props
    let { defaultModelRendering } = getConfigs()

    let activeTab = defaultModelRendering

    if (defaultModelRendering !== "example" && defaultModelRendering !== "model") {
      activeTab = "example"
    }

    if(isExecute) {
      activeTab = "example"
    }

    this.state = {
      activeTab,
    }
  }

  activeTab = (value) => {
    this.setState({
      activeTab: value
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.isExecute &&
      !this.props.isExecute &&
      this.props.example
    ) {
      this.setState({ activeTab: "example" })
    }
  }

  render() {
    let { getComponent, specSelectors, schema, example, isExecute, getConfigs, specPath, includeReadOnly, includeWriteOnly } = this.props
    let { defaultModelExpandDepth } = getConfigs()
    const ModelWrapper = getComponent("ModelWrapper")
    const HighlightCode = getComponent("highlightCode")
    const exampleTabId = randomBytes(5).toString("base64")
    const examplePanelId = randomBytes(5).toString("base64")
    const modelTabId = randomBytes(5).toString("base64")
    const modelPanelId = randomBytes(5).toString("base64")

    let isOAS3 = specSelectors.isOAS3()

    return (
      <div style={{marginTop: "12px"}}>
        <Segment 
          rimless={true}
          value={this.state.activeTab}
          onChange={val => this.activeTab(val)}
          options={[
            { value: "example", text: isExecute ? "配置请求数据" : "请求示例" },
            schema ? { value: "model", text: isOAS3 ? "请求数据模型" : "请求数据模型" } : null,
          ].filter(Boolean)}
          style={{marginBottom: "10px"}}
        />
        {this.state.activeTab === "example" && (
          <div
            aria-hidden={this.state.activeTab !== "example"}
            aria-labelledby={exampleTabId}
            data-name="examplePanel"
            id={examplePanelId}
            role="tabpanel"
            tabIndex="0"
          >
            {example ? example : (
              <HighlightCode value="(no example available)" getConfigs={ getConfigs } />
            )}
          </div>
        )}
        {this.state.activeTab === "model" && (
          <div
            aria-hidden={this.state.activeTab === "example"}
            aria-labelledby={modelTabId}
            data-name="modelPanel"
            id={modelPanelId}
            role="tabpanel"
            tabIndex="0"
          >
            <ModelWrapper
              schema={ schema }
              getComponent={ getComponent }
              getConfigs={ getConfigs }
              specSelectors={ specSelectors }
              expandDepth={ defaultModelExpandDepth }
              specPath={specPath}
              includeReadOnly = {includeReadOnly}
              includeWriteOnly = {includeWriteOnly}
            />
          </div>
        )}
      </div>
    )
  }

}
