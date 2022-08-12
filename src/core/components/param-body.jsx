import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { fromJS, List } from "immutable"
import { getSampleSchema } from "core/utils"
import { getKnownSyntaxHighlighterLanguage } from "core/utils/jsonParse"
import { Input, Button } from "@tencent/tea-component";

const NOOP = Function.prototype

export default class ParamBody extends PureComponent {

  static propTypes = {
    param: PropTypes.object,
    onChange: PropTypes.func,
    onChangeConsumes: PropTypes.func,
    consumes: PropTypes.object,
    consumesValue: PropTypes.string,
    fn: PropTypes.object.isRequired,
    getConfigs: PropTypes.func.isRequired,
    getComponent: PropTypes.func.isRequired,
    isExecute: PropTypes.bool,
    specSelectors: PropTypes.object.isRequired,
    pathMethod: PropTypes.array.isRequired
  }

  static defaultProp = {
    consumes: fromJS(["application/json"]),
    param: fromJS({}),
    onChange: NOOP,
    onChangeConsumes: NOOP,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      isEditBox: false,
      value: ""
    }

  }

  componentDidMount() {
    this.updateValues.call(this, this.props)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.updateValues.call(this, nextProps)
  }

  updateValues = (props) => {
    let { param, isExecute, consumesValue="" } = props
    let isXml = /xml/i.test(consumesValue)
    let isJson = /json/i.test(consumesValue)
    let paramValue = isXml ? param.get("value_xml") : param.get("value")

    if ( paramValue !== undefined ) {
      let val = !paramValue && isJson ? "{}" : paramValue
      this.setState({ value: val })
      this.onChange(val, {isXml: isXml, isEditBox: isExecute})
    } else {
      if (isXml) {
        this.onChange(this.sample("xml"), {isXml: isXml, isEditBox: isExecute})
      } else {
        this.onChange(this.sample(), {isEditBox: isExecute})
      }
    }
  }

  sample = (xml) => {
    let { param, fn:{inferSchema} } = this.props
    let schema = inferSchema(param.toJS())

    return getSampleSchema(schema, xml, {
      includeWriteOnly: true
    })
  }

  onChange = (value, { isEditBox, isXml }) => {
    this.setState({value, isEditBox})
    this._onChange(value, isXml)
  }

  _onChange = (val, isXml) => { (this.props.onChange || NOOP)(val, isXml) }

  handleOnChange = (inputValue) => {
    const {consumesValue} = this.props
    const isXml = /xml/i.test(consumesValue)
    this.onChange(inputValue, {isXml, isEditBox: this.state.isEditBox})
  }

  toggleIsEditBox = () => this.setState( state => ({isEditBox: !state.isEditBox}))

  render() {
    let {
      onChangeConsumes,
      param,
      isExecute,
      specSelectors,
      pathMethod,
      getConfigs,
      getComponent,
    } = this.props

    // const Button = getComponent("Button")
    // const TextArea = getComponent("TextArea")
    const HighlightCode = getComponent("highlightCode")
    const ContentType = getComponent("contentType")
    // for domains where specSelectors not passed
    let parameter = specSelectors ? specSelectors.parameterWithMetaByIdentity(pathMethod, param) : param
    let errors = parameter.get("errors", List())
    let consumesValue = specSelectors.contentTypeValues(pathMethod).get("requestContentType")
    let consumes = this.props.consumes && this.props.consumes.size ? this.props.consumes : ParamBody.defaultProp.consumes

    let { value, isEditBox } = this.state
    let language = null
    let testValueForJson = getKnownSyntaxHighlighterLanguage(value)
    if (testValueForJson) {
      language = "json"
    }

    return (
      <div data-param-name={param.get("name")} data-param-in={param.get("in")}>
        <div style={{marginBottom: "12px"}}>
          <ContentType
            value={ consumesValue }
            contentTypes={ consumes }
            onChange={onChangeConsumes}
            className="body-param-content-type"
            ariaLabel="Parameter content type" 
          />
        </div>
        {
          isEditBox && isExecute
            ? 
            <Input.TextArea 
              className={ "body-param__text" + ( errors.count() ? " invalid" : "")} 
              value={value} 
              onChange={ this.handleOnChange }
              style={{width: "100%", minHeight: "250px", marginBottom: "12px"}}
            />
            : (value && <HighlightCode className="body-param__example"
                          language={ language }
                          getConfigs={ getConfigs }
                          value={ value }/>)
        }
        <div style={{marginBottom: "12px"}}>
          {
            !isExecute ? null : 
            <Button 
              type="primary"
              onClick={this.toggleIsEditBox}>
                { isEditBox ? "取消编辑" : "开始编辑"}
            </Button>          
          }
        </div>
      </div>
    )

  }
}
