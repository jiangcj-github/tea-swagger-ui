import React, { useRef, useEffect, useState } from "react"
import get from "lodash/get"
import isFunction from "lodash/isFunction"
import { SyntaxHighlighter, getStyle } from "core/syntax-highlighting"
import { Collapse, Segment, H3, Copy, Button } from "@tencent/tea-component";

const style = {
  cursor: "pointer",
  lineHeight: 1,
  display: "inline-flex",
  backgroundColor: "rgb(250, 250, 250)",
  paddingBottom: "0",
  paddingTop: "0",
  border: "1px solid rgb(51, 51, 51)",
  borderRadius: "4px 4px 0 0",
  boxShadow: "none",
  borderBottom: "none"
}

const activeStyle = {
  cursor: "pointer",
  lineHeight: 1,
  display: "inline-flex",
  backgroundColor: "rgb(51, 51, 51)",
  boxShadow: "none",
  border: "1px solid rgb(51, 51, 51)",
  paddingBottom: "0",
  paddingTop: "0",
  borderRadius: "4px 4px 0 0",
  marginTop: "-5px",
  marginRight: "-5px",
  marginLeft: "-5px",
  zIndex: "9999",
  borderBottom: "none"
}

const RequestSnippets = ({ request, requestSnippetsSelectors, getConfigs }) => {
  const config = isFunction(getConfigs) ? getConfigs() : null
  const canSyntaxHighlight = get(config, "syntaxHighlight") !== false && get(config, "syntaxHighlight.activated", true)
  const rootRef = useRef(null)

  const [activeLanguage, setActiveLanguage] = useState(requestSnippetsSelectors.getSnippetGenerators()?.keySeq().first())
  const [isExpanded, setIsExpanded] = useState(requestSnippetsSelectors?.getDefaultExpanded())
  useEffect(() => {
    const doIt = () => {

    }
    doIt()
  }, [])
  useEffect(() => {
    const childNodes = Array
      .from(rootRef.current.childNodes)
      .filter(node => !!node.nodeType && node.classList?.contains("curl-command"))
    // eslint-disable-next-line no-use-before-define
    childNodes.forEach(node => node.addEventListener("mousewheel", handlePreventYScrollingBeyondElement, { passive: false }))

    return () => {
      // eslint-disable-next-line no-use-before-define
      childNodes.forEach(node => node.removeEventListener("mousewheel", handlePreventYScrollingBeyondElement))
    }
  }, [request])

  const snippetGenerators = requestSnippetsSelectors.getSnippetGenerators()
  const activeGenerator = snippetGenerators.get(activeLanguage)
  const snippet = activeGenerator.get("fn")(request)

  const handleGenChange = (key) => {
    const needsChange = activeLanguage !== key
    if (needsChange) {
      setActiveLanguage(key)
    }
  }

  const handleSetIsExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const handleGetBtnStyle = (key) => {
    if (key === activeLanguage) {
      return activeStyle
    }
    return style
  }

  const handlePreventYScrollingBeyondElement = (e) => {
    const { target, deltaY } = e
    const { scrollHeight: contentHeight, offsetHeight: visibleHeight, scrollTop } = target
    const scrollOffset = visibleHeight + scrollTop
    const isElementScrollable = contentHeight > visibleHeight
    const isScrollingPastTop = scrollTop === 0 && deltaY < 0
    const isScrollingPastBottom = scrollOffset >= contentHeight && deltaY > 0

    if (isElementScrollable && (isScrollingPastTop || isScrollingPastBottom)) {
      e.preventDefault()
    }
  }

  const SnippetComponent = canSyntaxHighlight ? 
    <SyntaxHighlighter
      language={activeGenerator.get("syntax")}
      className="curl microlight"
      style={getStyle(get(config, "syntaxHighlight.theme"))}
    >
      {snippet}
    </SyntaxHighlighter> :
    <pre style={{background: "rgb(51, 51, 51)", padding: "6px", color: "#fff"}}>
      <code>{snippet}</code>
    </pre>

  return (
    <div ref={rootRef} style={{marginTop: "20px"}}>
      <Collapse defaultActiveIds={["1"]} iconPosition="right" onActive={() => handleSetIsExpanded()}>
        <Collapse.Panel id="1" title={<H3>Curl</H3>}>
          <div style={{marginTop: "12px"}}>
            <Segment
              value={activeLanguage}
              onChange={value => handleGenChange(value)}
              options={snippetGenerators.entrySeq().map(([key, gen]) => { 
                return { text: gen.get("title"), value: key };
              })}
            />
            <div style={{marginTop: "12px"}}>
              {SnippetComponent}
            </div>
            <div style={{marginTop: "12px"}}>
              <Copy text={snippet}>
                <Button type="primary">复制</Button>
              </Copy>
            </div>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  )  
}

export default RequestSnippets
