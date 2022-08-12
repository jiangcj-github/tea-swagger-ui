import React, { useState, useEffect } from "react";
import { Modal } from "@tencent/tea-component";

const AuthorizationPopup = (props) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const close =() => {
    let { authActions } = props;
    setVisible(false);
    setTimeout(() => {
      authActions.showDefinitions(false);
    }, 200);
  }

  let { authSelectors, authActions, getComponent, errSelectors, specSelectors, fn: { AST = {} } } = props;
  let definitions = authSelectors.shownDefinitions();
  const Auths = getComponent("auths");

  return (
    <Modal 
      visible={visible} 
      popupContainer={document.querySelector("#swagger-ui")}
      caption="可用授权信息" 
      onClose={close} >
      <div>
        {
          definitions.valueSeq().map(( definition, key ) => {
            return (
              <Auths 
                key={ key }
                AST={AST}
                definitions={ definition }
                getComponent={ getComponent }
                errSelectors={ errSelectors }
                authSelectors={ authSelectors }
                authActions={ authActions }
                specSelectors={ specSelectors }
              />
            )
          })
        }
      </div>
    </Modal>
  )
}

export default AuthorizationPopup;
