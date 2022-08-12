import React from "react"

export default class ServersContainer extends React.Component {

  render () {
    const {specSelectors, oas3Selectors, oas3Actions, getComponent} = this.props
    const servers = specSelectors.servers()
    const Servers = getComponent("Servers");

    return servers && servers.size ?
        <Servers
          servers={servers}
          currentServer={oas3Selectors.selectedServer()}
          setSelectedServer={oas3Actions.setSelectedServer}
          setServerVariableValue={oas3Actions.setServerVariableValue}
          getServerVariable={oas3Selectors.serverVariableValue}
          getEffectiveServerValue={oas3Selectors.serverEffectiveValue}
        />
      : null;
  }
}