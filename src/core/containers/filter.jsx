import React from "react"
import PropTypes from "prop-types";
import { SearchBox } from "@tencent/tea-component";


export default class FilterContainer extends React.Component {

  static propTypes = {
    specSelectors: PropTypes.object.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
  }

  onFilterChange = (val) => {
    this.props.layoutActions.updateFilter(val);
  }

  render () {
    const {specSelectors, layoutSelectors, getComponent} = this.props
    // const Col = getComponent("Col")

    const isLoading = specSelectors.loadingStatus() === "loading"
    const isFailed = specSelectors.loadingStatus() === "failed"
    const filter = layoutSelectors.currentFilter()

    const classNames = ["operation-filter-input"]
    if (isFailed) classNames.push("failed")
    if (isLoading) classNames.push("loading")

    return (
      <div>
        {filter === null || filter === false || filter === "false" ? null :
          <SearchBox 
            style={{width: "260px"}}
            placeholder="输入tag搜索" 
            onChange={this.onFilterChange} 
            value={filter === true || filter === "true" ? "" : filter}
            disabled={isLoading}
          />
        }
      </div>
    )
  }
}
