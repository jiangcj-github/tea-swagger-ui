import React from "react";
import Im from "immutable";
import { Collapse, Card, H3, Tag } from "@tencent/tea-component";

const SWAGGER2_OPERATION_METHODS = [
  "get", "put", "post", "delete", "options", "head", "patch"
]

const OAS3_OPERATION_METHODS = SWAGGER2_OPERATION_METHODS.concat(["trace"])


export default class Operations extends React.Component {

  render() {
    let {
      specSelectors,
    } = this.props

    const taggedOps = specSelectors.taggedOperations()

    if(taggedOps.size < 1) {
      return <H3>暂无数据!</H3>
    }
    return (
      <div>
        { taggedOps.map(this.renderOperationTag).toArray() }
      </div>
    )
  }

  renderOperationTag = (tagObj, tag) => {
    const {
      specSelectors,
      getComponent,
      oas3Selectors,
      layoutSelectors,
      layoutActions,
      getConfigs,
    } = this.props
    const OperationContainer = getComponent("OperationContainer", true)
    const OperationTag = getComponent("OperationTag")
    const operations = tagObj.get("operations")

    return (
      <Card key={"operation-" + tag}>
        <OperationTag
          tagObj={tagObj}
          tag={tag}
          oas3Selectors={oas3Selectors}
          layoutSelectors={layoutSelectors}
          layoutActions={layoutActions}
          getConfigs={getConfigs}
          getComponent={getComponent}
          specUrl={specSelectors.url()}>
          {
            operations.map((op, idx) => {
              const path = op.get("path")
              const method = op.get("method")
              const specPath = Im.List(["paths", path, method])


              // FIXME: (someday) this logic should probably be in a selector,
              // but doing so would require further opening up
              // selectors to the plugin system, to allow for dynamic
              // overriding of low-level selectors that other selectors
              // rely on. --KS, 12/17
              const validMethods = specSelectors.isOAS3() ?
                OAS3_OPERATION_METHODS : SWAGGER2_OPERATION_METHODS

              if (validMethods.indexOf(method) === -1) {
                return null
              }

              return (
                <OperationContainer
                  key={idx}
                  specPath={specPath}
                  op={op}
                  path={path}
                  method={method}
                  tag={tag} />
              )
            }).toArray()
          }
        </OperationTag>
      </Card>
     
    )
  }

}