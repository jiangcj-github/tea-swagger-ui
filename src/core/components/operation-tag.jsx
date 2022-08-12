import React from "react"
import Im from "immutable"
import { createDeepLinkPath, escapeDeepLinkPath, sanitizeUrl } from "core/utils"
import { safeBuildUrl } from "core/utils/url"
import { isFunc } from "core/utils"
import { ExternalLink, H3, Row, Col, Justify, Button, Card } from "@tencent/tea-component";

export default class OperationTag extends React.Component {

  static defaultProps = {
    tagObj: Im.fromJS({}),
    tag: "",
  }

  render() {
    const {
      tagObj,
      tag,
      children,
      oas3Selectors,
      layoutSelectors,
      layoutActions,
      getConfigs,
      getComponent,
      specUrl,
    } = this.props

    let {
      docExpansion,
      deepLinking,
    } = getConfigs()

    const isDeepLinkingEnabled = deepLinking && deepLinking !== "false"

    // const Collapse = getComponent("Collapse")
    const Markdown = getComponent("Markdown", true)
    // const DeepLink = getComponent("DeepLink")
    // const Link = getComponent("Link")

    let tagDescription = tagObj.getIn(["tagDetails", "description"], null)
    let tagExternalDocsDescription = tagObj.getIn(["tagDetails", "externalDocs", "description"])
    let rawTagExternalDocsUrl = tagObj.getIn(["tagDetails", "externalDocs", "url"])
    let tagExternalDocsUrl
    if (isFunc(oas3Selectors) && isFunc(oas3Selectors.selectedServer)) {
      tagExternalDocsUrl = safeBuildUrl(rawTagExternalDocsUrl, specUrl, { selectedServer: oas3Selectors.selectedServer() })
    } else {
      tagExternalDocsUrl = rawTagExternalDocsUrl
    }

    let isShownKey = ["operations-tag", tag]
    let showTag = layoutSelectors.isShown(isShownKey, docExpansion === "full" || docExpansion === "list")

    return (
      <>
        <Card.Header>
          <H3
            onClick={() => layoutActions.show(isShownKey, !showTag)}
            id={isShownKey.map(v => escapeDeepLinkPath(v)).join("-")}
          >
            {tag}
            <Button type="link" style={{float:"right"}}>{showTag ? "收起" : "展开"}</Button>
          </H3>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col>
              {tagDescription && <Markdown source={tagDescription} />}
            </Col>
          </Row>
          {tagExternalDocsDescription && <Row>
            <Col>
              {tagExternalDocsDescription}
              {tagExternalDocsUrl ? " : " : null}
              {tagExternalDocsUrl &&
                <ExternalLink
                  href={sanitizeUrl(tagExternalDocsUrl)}
                  onClick={(e) => e.stopPropagation()}>
                  {tagExternalDocsUrl}
                </ExternalLink>}
            </Col>
          </Row>}
          <div style={{display: showTag ? "block" : "none", marginTop: "12px"}}>
            {children}
          </div>
        </Card.Body>
      </>    
 
    )
  }
}
