/**
 * @prettier
 */

import React from "react"
import Im from "immutable"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import { Select } from "@tencent/tea-component";

export default class ExamplesSelect extends React.PureComponent {
  static propTypes = {
    examples: ImPropTypes.map.isRequired,
    onSelect: PropTypes.func,
    currentExampleKey: PropTypes.string,
    isModifiedValueAvailable: PropTypes.bool,
    isValueModified: PropTypes.bool,
    showLabels: PropTypes.bool,
  }

  static defaultProps = {
    examples: Im.Map({}),
    onSelect: (...args) =>
      console.log( // eslint-disable-line no-console
        // FIXME: remove before merging to master...
        `DEBUG: ExamplesSelect was not given an onSelect callback`,
        ...args
      ),
    currentExampleKey: null,
    showLabels: true,
  }

  _onSelect = (key, { isSyntheticChange = false } = {}) => {
    if (typeof this.props.onSelect === "function") {
      this.props.onSelect(key, {
        isSyntheticChange,
      })
    }
  }

  _onDomSelect = (val) => {
    if (typeof this.props.onSelect === "function") {
      this._onSelect(val, {
        isSyntheticChange: false,
      })
    }
  }

  getCurrentExample = () => {
    const { examples, currentExampleKey } = this.props

    const currentExamplePerProps = examples.get(currentExampleKey)

    const firstExamplesKey = examples.keySeq().first()
    const firstExample = examples.get(firstExamplesKey)

    return currentExamplePerProps || firstExample || Map({})
  }

  componentDidMount() {
    // this is the not-so-great part of ExamplesSelect... here we're
    // artificially kicking off an onSelect event in order to set a default
    // value in state. the consumer has the option to avoid this by checking
    // `isSyntheticEvent`, but we should really be doing this in a selector.
    // TODO: clean this up
    // FIXME: should this only trigger if `currentExamplesKey` is nullish?
    const { onSelect, examples } = this.props

    if (typeof onSelect === "function") {
      const firstExample = examples.first()
      const firstExampleKey = examples.keyOf(firstExample)

      this._onSelect(firstExampleKey, {
        isSyntheticChange: true,
      })
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { currentExampleKey, examples } = nextProps
    if (examples !== this.props.examples && !examples.has(currentExampleKey)) {
      // examples have changed from under us, and the currentExampleKey is no longer
      // valid.
      const firstExample = examples.first()
      const firstExampleKey = examples.keyOf(firstExample)

      this._onSelect(firstExampleKey, {
        isSyntheticChange: true,
      })
    }
  }

  render() {
    const {
      examples,
      currentExampleKey,
      isValueModified,
      isModifiedValueAvailable,
      showLabels,
    } = this.props

    const options = [
      isModifiedValueAvailable ? { text: "[Modified value]", value: "__MODIFIED__VALUE__" } : null,
      ...examples.map((example, exampleName) => ({ 
        text: example.get("summary") || exampleName,
        value: exampleName,
      }))
    ].filter(Boolean);

    return (
      <Select
        options={options}
        onChange={this._onDomSelect}
        value={
          isModifiedValueAvailable && isValueModified
            ? "__MODIFIED__VALUE__"
            : (currentExampleKey || "")
        }
        appearance="button"
        matchButtonWidth={true}
        style={{width: "200px"}}
      />
    )
  }
}
