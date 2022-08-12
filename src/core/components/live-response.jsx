import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import { H3, Form, Copy } from "@tencent/tea-component";


const Duration = ( { duration } ) => {
  return (
    <div>
      <h5>Request duration</h5>
      <pre className="microlight">{duration} ms</pre>
    </div>
  )
}
Duration.propTypes = {
  duration: PropTypes.number.isRequired
}


export default class LiveResponse extends React.Component {
  static propTypes = {
    response: ImPropTypes.map,
    path: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    displayRequestDuration: PropTypes.bool.isRequired,
    specSelectors: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired
  }

  shouldComponentUpdate(nextProps) {
    // BUG: props.response is always coming back as a new Immutable instance
    // same issue as responses.jsx (tryItOutResponse)
    return this.props.response !== nextProps.response
      || this.props.path !== nextProps.path
      || this.props.method !== nextProps.method
      || this.props.displayRequestDuration !== nextProps.displayRequestDuration
  }

  render() {
    const { response, getComponent, getConfigs, displayRequestDuration, specSelectors, path, method } = this.props
    const { showMutatedRequest, requestSnippetsEnabled } = getConfigs()

    const curlRequest = showMutatedRequest ? specSelectors.mutatedRequestFor(path, method) : specSelectors.requestFor(path, method)
    const status = response.get("status")
    const url = curlRequest.get("url")
    const headers = response.get("headers").toJS()
    const notDocumented = response.get("notDocumented")
    const isError = response.get("error")
    const body = response.get("text")
    const duration = response.get("duration")
    const headersKeys = Object.keys(headers)
    const contentType = headers["content-type"] || headers["Content-Type"]

    const ResponseBody = getComponent("responseBody")
    const returnObject = headersKeys.map(key => {
      var joinedHeaders = Array.isArray(headers[key]) ? headers[key].join() : headers[key]
      return <span className="headerline" key={key}> {key}: {joinedHeaders} </span>
    })
    const hasHeaders = returnObject.length !== 0
    const Markdown = getComponent("Markdown", true)
    const RequestSnippets = getComponent("RequestSnippets", true)
    const Curl = getComponent("curl")

    return (
      <div>
        {curlRequest && (requestSnippetsEnabled === true || requestSnippetsEnabled === "true"
          ? <RequestSnippets request={ curlRequest }/>
          : <Curl request={ curlRequest } getConfigs={ getConfigs } />) }
        {url && 
          <div style={{marginTop: "20px"}}>
            <H3>Request URL</H3>
            <div style={{marginTop: "12px"}}>
              <pre style={{background: "rgb(51, 51, 51)", padding: "6px", color: "#fff"}}>{url}</pre>
            </div>
          </div>}
        <div style={{marginTop: "20px"}}>
          <H3>Server Response</H3>
          <div style={{marginTop: "12px"}}>
            <Form readonly className="form-line-20">
              <Form.Item label="Code">
                <Form.Text>
                  {status}
                  {notDocumented && <span style={{marginLeft: "12px"}}>Undocumented</span>}
                </Form.Text>
              </Form.Item>
              {isError && <Form.Item label={response.get("name")}>
                <Form.Text>
                  <Markdown source={response.get("message")}/>
                </Form.Text>
              </Form.Item>}
              {hasHeaders && 
                <Form.Item label="Response headers">
                  <Form.Text>
                    <pre style={{background: "rgb(51, 51, 51)", padding: "6px", color: "#fff"}}>
                      {returnObject}
                    </pre>
                  </Form.Text>
                </Form.Item>}
              {body && 
                <Form.Item label="Response Body">
                  <Form.Text>
                    <ResponseBody 
                      content={ body }
                      contentType={ contentType }
                      url={ url }
                      headers={ headers }
                      getConfigs={ getConfigs }
                      getComponent={ getComponent }
                    />
                  </Form.Text>
                </Form.Item>}
              {displayRequestDuration && duration && 
                <Form.Item label="请求耗时">
                  <Form.Text>
                    <pre>{duration}</pre>
                  </Form.Text>
                </Form.Item>}
            </Form>
          </div>
        </div>
      </div>
    )
  }
}
