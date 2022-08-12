import React from "react"
import PropTypes from "prop-types";
import { H4 } from "@tencent/tea-component";

export const OperationExt = ({ extensions, getComponent }) => {
    let OperationExtRow = getComponent("OperationExtRow")
    return (
      <div style={{marginTop: "12px"}}>
        <H4 style={{marginBottom: "12px"}}>Extensions</H4>
        <div className="table-container" style={{width:"300px"}}>
          <table className="tsu-table">
            <thead>
              <tr>
                <td className="col_header">字段</td>
                <td className="col_header">值</td>
              </tr>
            </thead>
            <tbody>
              {
                extensions.entrySeq().map(([k, v]) => <OperationExtRow key={`${k}-${v}`} xKey={k} xVal={v} />)
              }
            </tbody>
          </table>
        </div>
      </div>
    )
}
OperationExt.propTypes = {
  extensions: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired
}

export default OperationExt
