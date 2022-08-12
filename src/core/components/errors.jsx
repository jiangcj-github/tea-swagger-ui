import React from "react"
import PropTypes from "prop-types"
import { List as ImmList } from "immutable";
import { Alert, List, Button } from "@tencent/tea-component";

export default class Errors extends React.Component {

  static propTypes = {
    editorActions: PropTypes.object,
    errSelectors: PropTypes.object.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
  }

  render() {
    let { editorActions, errSelectors, layoutSelectors, layoutActions, getComponent } = this.props
    
    if(editorActions && editorActions.jumpToLine) {
      var jumpToLine = editorActions.jumpToLine
    }

    let errors = errSelectors.allErrors()

    // all thrown errors, plus error-level everything else
    let allErrorsToDisplay = errors.filter(err => err.get("type") === "thrown" ? true :err.get("level") === "error")

    if(!allErrorsToDisplay || allErrorsToDisplay.count() < 1) {
      return null
    }

    let isVisible = layoutSelectors.isShown(["errorPane"], true)
    let toggleVisibility = () => layoutActions.show(["errorPane"], !isVisible)
    let sortedJSErrors = allErrorsToDisplay.sortBy(err => err.get("line"))

    return (
      <Alert type="warning" extra={
        <Button type="link" onClick={toggleVisibility}>
          {isVisible ? "收起" : "展开"}
        </Button>
      }>
        <h4>错误提示</h4>
        {isVisible && 
          <List type="bullet">
            {sortedJSErrors.map((err, i) => {
              let type = err.get("type")
              if(type === "thrown" || type === "auth") {
                return <ThrownErrorItem key={ i } error={ err.get("error") || err } jumpToLine={jumpToLine} />
              }
              if(type === "spec") {
                return <SpecErrorItem key={ i } error={ err } jumpToLine={jumpToLine} />
              }
            })}
          </List>}
      </Alert>
    )
  }
}

const ThrownErrorItem = ( { error, jumpToLine } ) => {
  if(!error) {
    return null
  }
  let errorLine = error.get("line")
  return (
    <List.Item>
      { !error ? null :
        <div>
          <p>
            {(error.get("source") && error.get("level")) ? 
              toTitleCase(error.get("source")) + " " + error.get("level") : 
              "" }
            {error.get("path") ? 
              <small> at {error.get("path")}</small>: 
              null }
          </p>
          <p>
            {error.get("message") }
          </p>
          <div>
            { errorLine && jumpToLine ? 
              <a onClick={jumpToLine.bind(null, errorLine)}>跳转到 { errorLine }</a> : null }
          </div>
        </div>
      }
    </List.Item>
    )
  }

const SpecErrorItem = ( { error, jumpToLine } ) => {
  let locationMessage = null

  if(error.get("path")) {
    if(ImmList.isList(error.get("path"))) {
      locationMessage = <small>at { error.get("path").join(".") }</small>
    } else {
      locationMessage = <small>at { error.get("path") }</small>
    }
  } else if(error.get("line") && !jumpToLine) {
    locationMessage = <small>on line { error.get("line") }</small>
  }

  return (
    <List.Item>
      { !error ? null :
        <div>
          <p>{ toTitleCase(error.get("source")) + " " + error.get("level") }&nbsp;{ locationMessage }</p>
          <p>{ error.get("message") }</p>
          <div>
            { jumpToLine ? (
              <a onClick={jumpToLine.bind(null, error.get("line"))}>跳转到 { error.get("line") }</a>
            ) : null }
          </div>
        </div>
      }
    </List.Item>
  )
}

function toTitleCase(str) {
  return (str || "")
    .split(" ")
    .map(substr => substr[0].toUpperCase() + substr.slice(1))
    .join(" ")
}

ThrownErrorItem.propTypes = {
  error: PropTypes.object.isRequired,
  jumpToLine: PropTypes.func
}

ThrownErrorItem.defaultProps = {
  jumpToLine: null
}

SpecErrorItem.propTypes = {
  error: PropTypes.object.isRequired,
  jumpToLine: PropTypes.func
}
