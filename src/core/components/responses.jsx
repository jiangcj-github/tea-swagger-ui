import React from "react"
import { fromJS, Iterable } from "immutable"
import { defaultStatusCode, getAcceptControllingResponse } from "core/utils"
import createHtmlReadyId from "../../helpers/create-html-ready-id";
import { H3, Form, Table } from "@tencent/tea-component";

export default class Responses extends React.Component {

  static defaultProps = {
    tryItOutResponse: null,
    produces: fromJS(["application/json"]),
    displayRequestDuration: false
  }

  // These performance-enhancing checks were disabled as part of Multiple Examples
  // because they were causing data-consistency issues
  //
  // shouldComponentUpdate(nextProps) {
  //   // BUG: props.tryItOutResponse is always coming back as a new Immutable instance
  //   let render = this.props.tryItOutResponse !== nextProps.tryItOutResponse
  //   || this.props.responses !== nextProps.responses
  //   || this.props.produces !== nextProps.produces
  //   || this.props.producesValue !== nextProps.producesValue
  //   || this.props.displayRequestDuration !== nextProps.displayRequestDuration
  //   || this.props.path !== nextProps.path
  //   || this.props.method !== nextProps.method
  //   return render
  // }

	onChangeProducesWrapper = ( val ) => this.props.specActions.changeProducesValue([this.props.path, this.props.method], val)

  onResponseContentTypeChange = ({ controlsAcceptHeader, value }) => {
    const { oas3Actions, path, method } = this.props
    if(controlsAcceptHeader) {
      oas3Actions.setResponseContentType({
        value,
        path,
        method
      })
    }
  }

  render() {
    let {
      responses,
      tryItOutResponse,
      getComponent,
      getConfigs,
      specSelectors,
      fn,
      producesValue,
      displayRequestDuration,
      specPath,
      path,
      method,
      oas3Selectors,
      oas3Actions,
    } = this.props
    let defaultCode = defaultStatusCode( responses )

    const ContentType = getComponent( "contentType" )
    const LiveResponse = getComponent( "liveResponse" )
    const Response = getComponent( "response" )
    const OperationLink = getComponent("operationLink");

    let produces = this.props.produces && this.props.produces.size ? this.props.produces : Responses.defaultProps.produces

    const isSpecOAS3 = specSelectors.isOAS3()

    const acceptControllingResponse = isSpecOAS3 ?
      getAcceptControllingResponse(responses) : null

    const regionId = createHtmlReadyId(`${method}${path}_responses`)
    const controlId = `${regionId}_select`;


    const render2 = ([code, response]) => (
      <Response key={ code }
        path={path}
        method={method}
        specPath={specPath.push(code)}
        isDefault={defaultCode === code}
        fn={fn}
        code={ code }
        response={ response }
        specSelectors={ specSelectors }
        controlsAcceptHeader={response === acceptControllingResponse}
        onContentTypeChange={this.onResponseContentTypeChange}
        contentType={ producesValue }
        getConfigs={ getConfigs }
        activeExamplesKey={oas3Selectors.activeExamplesMember(
          path,
          method,
          "responses",
          code
        )}
        oas3Actions={oas3Actions}
        getComponent={ getComponent }
      />
    )
  
    const render3 = ([code, response]) => {
      if(!isSpecOAS3) return "-";
      const links = response.get("links");
      return (
        <div>
          {links?.toSeq().entrySeq().map(([key, link]) => {
            return <OperationLink key={key} name={key} link={ link } getComponent={getComponent}/>
          })}
        </div>
      )
    }

    return (
      <div>
        <div>
          <H3 style={{marginBottom: "12px"}}>响应示例</H3>
          {specSelectors.isOAS3() ? null : 
            <Form>
              <Form.Item label="响应类型" align="middle">
                <ContentType value={producesValue}
                  ariaControls={regionId}
                  ariaLabel="Response content type"
                  className="execute-content-type"
                  contentTypes={produces}
                  controlId={controlId}
                  onChange={this.onChangeProducesWrapper}
                />
              </Form.Item>
            </Form>}
          <table className="response-tb">
            <colgroup>
              <col width={"15%"}/>
              <col width={"55%"}/>
              <col width={"30%"}/>
            </colgroup>
            <thead>
              <tr className="res-tb-tr">
                <th>Code</th>
                <th>Description</th>
                <th>Links</th>
              </tr>
            </thead>
            <tbody>
              {[...responses.entrySeq()].map(([code, response]) => {
                return <tr key={code} className="res-tb-tr">
                  <td>{code}</td>
                  <td>{render2([code, response])}</td>
                  <td>{render3([code, response])}</td>
                </tr>
              })}
            </tbody>
          </table>
        </div>
        <div style={{marginTop: "20px"}}>
          {tryItOutResponse && <div>
            <hr/>
            <H3 style={{marginBottom: "12px"}}>服务器响应</H3>
            <LiveResponse 
              response={ tryItOutResponse }
              getComponent={ getComponent }
              getConfigs={ getConfigs }
              specSelectors={ specSelectors }
              path={ this.props.path }
              method={ this.props.method }
              displayRequestDuration={ displayRequestDuration } 
            />
          </div>}
        </div>
      </div>
    )
  }
}
