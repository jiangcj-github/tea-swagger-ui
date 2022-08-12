import React from "react";
import { Button } from "@tencent/tea-component";

export default class AuthorizeBtn extends React.Component {

  render() {
    let { isAuthorized, showPopup, onClick, getComponent } = this.props
    const AuthorizationPopup = getComponent("authorizationPopup", true);

    return (
      <div>
        <Button 
          type={isAuthorized ? "weak" : "primary"} 
          onClick={onClick}>
          {isAuthorized ? "已认证" : "去认证"}
        </Button>
      { showPopup && <AuthorizationPopup /> }
      </div>
    )
  }
}
