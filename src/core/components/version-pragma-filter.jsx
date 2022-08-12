import React from "react";

const Error = ({ msg }) => (
  <div className="version-pragma">
    <div className="version-pragma__message version-pragma__message--ambiguous">
      <div>
        <h3>渲染出错</h3>
        <p style={{marginTop: "20px"}}>{msg}</p>
      </div>
    </div>
  </div>
)

export default (props) => {
  const { isSwagger2, isOAS3 } = props
  if(isSwagger2 && isOAS3) {
    return (
      <Error 
        msg={
          <span>
            <code>swagger: 2.0</code> 与 <code>openapi: 3.0.n</code> 不能同时出现
          </span>
        }
      />
    )
  }
  if(!isSwagger2 && !isOAS3) {
    return (
      <Error 
        msg={
          <span>
            缺少版本描述，<code>swagger: 2.0</code> 与 <code>openapi: 3.0.n</code> 至少出现一项。
          </span>
        } 
      />
    )
  }
  return <div>{props.children}</div>
}
