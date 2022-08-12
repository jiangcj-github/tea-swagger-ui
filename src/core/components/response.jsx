import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import cx from "classnames"
import { fromJS, Seq, Iterable, List, Map } from "immutable"
import { getExtensions, getSampleSchema, fromJSOrdered, stringify } from "core/utils"
import { getKnownSyntaxHighlighterLanguage } from "core/utils/jsonParse"
import { H3, Form, Table } from "@tencent/tea-component";


const getExampleComponent = ( sampleResponse, HighlightCode, getConfigs ) => {
  if (
    sampleResponse !== undefined &&
    sampleResponse !== null
  ) {
    let language = null
    let testValueForJson = getKnownSyntaxHighlighterLanguage(sampleResponse)
    if (testValueForJson) {
      language = "json"
    }
    return <div>
      <HighlightCode className="example" getConfigs={ getConfigs } language={ language } value={ stringify(sampleResponse) } />
    </div>
  }
  return null
}

export default class Response extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      responseContentType: "",
    }
  }

  static propTypes = {
    path: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    response: PropTypes.instanceOf(Iterable),
    className: PropTypes.string,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    oas3Actions: PropTypes.object.isRequired,
    specPath: ImPropTypes.list.isRequired,
    fn: PropTypes.object.isRequired,
    contentType: PropTypes.string,
    activeExamplesKey: PropTypes.string,
    controlsAcceptHeader: PropTypes.bool,
    onContentTypeChange: PropTypes.func
  }

  static defaultProps = {
    response: fromJS({}),
    onContentTypeChange: () => {}
  }

  _onContentTypeChange = (value) => {
    const { onContentTypeChange, controlsAcceptHeader } = this.props
    this.setState({ responseContentType: value })
    onContentTypeChange({
      value: value,
      controlsAcceptHeader
    })
  }

  getTargetExamplesKey = () => {
    const { response, contentType, activeExamplesKey } = this.props

    const activeContentType = this.state.responseContentType || contentType
    const activeMediaType = response.getIn(["content", activeContentType], Map({}))
    const examplesForMediaType = activeMediaType.get("examples", null)

    const firstExamplesKey = examplesForMediaType.keySeq().first()
    return activeExamplesKey || firstExamplesKey
  }

  render() {
    let {
      path,
      method,
      code,
      response,
      className,
      specPath,
      fn,
      getComponent,
      getConfigs,
      specSelectors,
      contentType,
      controlsAcceptHeader,
      oas3Actions,
    } = this.props

    let { inferSchema } = fn
    let isOAS3 = specSelectors.isOAS3()
    const { showExtensions } = getConfigs()

    let extensions = showExtensions ? getExtensions(response) : null
    let headers = response.get("headers")
    let links = response.get("links")
    const ResponseExtension = getComponent("ResponseExtension")
    const Headers = getComponent("headers")
    const HighlightCode = getComponent("highlightCode")
    const ModelExample = getComponent("modelExample")
    const Markdown = getComponent("Markdown", true)
    const OperationLink = getComponent("operationLink")
    const ContentType = getComponent("contentType")
    const ExamplesSelect = getComponent("ExamplesSelect")
    const Example = getComponent("Example")


    var schema, specPathWithPossibleSchema

    const activeContentType = this.state.responseContentType || contentType
    const activeMediaType = response.getIn(["content", activeContentType], Map({}))
    const examplesForMediaType = activeMediaType.get("examples", null)

    // Goal: find a schema value for `schema`
    if(isOAS3) {
      const oas3SchemaForContentType = activeMediaType.get("schema")

      schema = oas3SchemaForContentType ? inferSchema(oas3SchemaForContentType.toJS()) : null
      specPathWithPossibleSchema = oas3SchemaForContentType ? List(["content", this.state.responseContentType, "schema"]) : specPath
    } else {
      schema = response.get("schema")
      specPathWithPossibleSchema = response.has("schema") ? specPath.push("schema") : specPath
    }

    let mediaTypeExample
    let shouldOverrideSchemaExample = false
    let sampleSchema
    let sampleGenConfig = {
      includeReadOnly: true
    }

    // Goal: find an example value for `sampleResponse`
    if(isOAS3) {
      sampleSchema = activeMediaType.get("schema")?.toJS()
      if(examplesForMediaType) {
        const targetExamplesKey = this.getTargetExamplesKey()
        const targetExample = examplesForMediaType
          .get(targetExamplesKey, Map({}))
        const getMediaTypeExample = (targetExample) =>
          targetExample.get("value")
        mediaTypeExample = getMediaTypeExample(targetExample)
        if(mediaTypeExample === undefined) {
          mediaTypeExample = getMediaTypeExample(examplesForMediaType.values().next().value)
        }
        shouldOverrideSchemaExample = true
      } else if(activeMediaType.get("example") !== undefined) {
        // use the example key's value
        mediaTypeExample = activeMediaType.get("example")
        shouldOverrideSchemaExample = true
      }
    } else {
      sampleSchema = schema
      sampleGenConfig = {...sampleGenConfig, includeWriteOnly: true}
      const oldOASMediaTypeExample = response.getIn(["examples", activeContentType])
      if(oldOASMediaTypeExample) {
        mediaTypeExample = oldOASMediaTypeExample
        shouldOverrideSchemaExample = true
      }
    }

    const sampleResponse = getSampleSchema(
      sampleSchema,
      activeContentType,
      sampleGenConfig,
      shouldOverrideSchemaExample ? mediaTypeExample : undefined
    )

    let example = getExampleComponent( sampleResponse, HighlightCode, getConfigs )

    return (
      <div>
        <div>
          <Markdown source={ response.get( "description" ) } />
        </div>
        { !showExtensions || !extensions.size ? null : extensions.entrySeq().map(([key, v]) => 
          <ResponseExtension key={`${key}-${v}`} xKey={key} xVal={v} /> )}
        {isOAS3 && response.get("content") && (
          <Form style={{marginTop: "12px"}}>
            <Form.Item 
              label="Media type" 
              message={controlsAcceptHeader ? <span>Controls <code>Accept</code> header.</span> : null}>
              <ContentType
                value={this.state.responseContentType}
                contentTypes={
                  response.get("content")
                    ? response.get("content").keySeq()
                    : Seq()
                }
                onChange={this._onContentTypeChange}
                ariaLabel="Media Type"
              />
            </Form.Item>
            {examplesForMediaType && 
              <Form.Item 
                label="Examples" 
                message={controlsAcceptHeader ? <span>Controls <code>Accept</code> header.</span> : null}>
                <ExamplesSelect
                  examples={examplesForMediaType}
                  currentExampleKey={this.getTargetExamplesKey()}
                  onSelect={key =>
                    oas3Actions.setActiveExamplesMember({
                      name: key,
                      pathMethod: [path, method],
                      contextType: "responses",
                      contextName: code
                    })
                  }
                  showLabels={false}
                />
              </Form.Item>}
          </Form>
        )}

        { example || schema ? (
          <div style={{marginTop: "12px"}}>
            <ModelExample
              specPath={specPathWithPossibleSchema}
              getComponent={ getComponent }
              getConfigs={ getConfigs }
              specSelectors={ specSelectors }
              schema={ fromJSOrdered(schema) }
              example={ example }
              includeReadOnly={ true }
            />
          </div>
        ) : null }

        {isOAS3 && examplesForMediaType ? (
          <div style={{marginTop: "12px"}}>
            <Example
              example={examplesForMediaType.get(this.getTargetExamplesKey(), Map({}))}
              getComponent={getComponent}
              getConfigs={getConfigs}
              omitValue={true}
            />
          </div>
        ) : null} 

        { headers ? (
          <div style={{marginTop: "12px"}}>
            <Headers
              headers={ headers }
              getComponent={ getComponent }
            />
          </div>
        ) : null}
      </div>
    )
  }
}
