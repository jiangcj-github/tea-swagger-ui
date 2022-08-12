import React from "react"
import PropTypes from "prop-types"
import { CopyToClipboard } from "react-copy-to-clipboard"
import {SyntaxHighlighter, getStyle} from "core/syntax-highlighting"
import get from "lodash/get"
import { requestSnippetGenerator_curl_bash } from "../plugins/request-snippets/fn"
import { Collapse, Segment, H3, Copy, Button } from "@tencent/tea-component";

export default class Curl extends React.Component {
  static propTypes = {
    getConfigs: PropTypes.func.isRequired,
    request: PropTypes.object.isRequired
  }

  render() {
    let { request, getConfigs } = this.props
    let curl = requestSnippetGenerator_curl_bash(request)

    const config = getConfigs()

    const curlBlock = get(config, "syntaxHighlight.activated")
      ? <SyntaxHighlighter
          language="bash"
          className="curl microlight"
          style={getStyle(get(config, "syntaxHighlight.theme"))}
          >
          {curl}
        </SyntaxHighlighter>
      :
      <pre style={{background: "rgb(51, 51, 51)", padding: "6px", color: "#fff"}}>
        <code>{curl}</code>
      </pre>

    return (
      <div style={{marginTop: "20px"}}>
        <H3>Curl</H3>
        <div style={{marginTop: "12px"}}>
          {curlBlock}
        </div>
        <div style={{marginTop: "12px"}}>
          <Copy text={curl}>
            <Button type="primary">复制</Button>
          </Copy>
        </div>
      </div>
    )
  }

}
