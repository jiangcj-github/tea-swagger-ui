import React from "react"
import { OrderedMap } from "immutable"
import { Select, H4, Table, Form, Input } from "@tencent/tea-component";

export default class Servers extends React.Component {

  componentDidMount() {
    let { servers, currentServer } = this.props

    if(currentServer) {
      return
    }

    // fire 'change' event to set default 'value' of select
    this.setServer(servers.first()?.get("url"))
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let {
      servers,
      setServerVariableValue,
      getServerVariable
    } = nextProps
    if (this.props.currentServer !== nextProps.currentServer || this.props.servers !== nextProps.servers) {
      // Server has changed, we may need to set default values
      let currentServerDefinition = servers
        .find(v => v.get("url") === nextProps.currentServer)
      let prevServerDefinition = this.props.servers
        .find(v => v.get("url") === this.props.currentServer) || OrderedMap()
      
      if(!currentServerDefinition) {
        return this.setServer(servers.first().get("url"))
      }
      
      let prevServerVariableDefs = prevServerDefinition.get("variables") || OrderedMap()
      let prevServerVariableDefaultKey = prevServerVariableDefs.find(v => v.get("default")) || OrderedMap()
      let prevServerVariableDefaultValue = prevServerVariableDefaultKey.get("default")
      
      let currentServerVariableDefs = currentServerDefinition.get("variables") || OrderedMap()
      let currentServerVariableDefaultKey = currentServerVariableDefs.find(v => v.get("default")) || OrderedMap()
      let currentServerVariableDefaultValue = currentServerVariableDefaultKey.get("default")
      
      currentServerVariableDefs.map((val, key) => {
        let currentValue = getServerVariable(nextProps.currentServer, key)
        
        // note: it is possible for both key/val to be the same across definitions,
        // but we will try to detect a change in default values between definitions
        // only set the default value if the user hasn't set one yet
        // or if the definition appears to have changed
        if (!currentValue || prevServerVariableDefaultValue !== currentServerVariableDefaultValue) {
          setServerVariableValue({
            server: nextProps.currentServer,
            key,
            val: val.get("default") || ""
          })
        }
      })
    }
  }

  onServerChange =(value) => {
    this.setServer(value);
  }

  onServerVariableValueChange = (name, value) => {
    let { setServerVariableValue, currentServer } = this.props
    if(typeof setServerVariableValue === "function") {
      setServerVariableValue({
        server: currentServer,
        key: name,
        val: value
      })
    }
  }

  setServer = ( value ) => {
    let { setSelectedServer } = this.props
    setSelectedServer(value)
  }

  render() {
    let { servers,
      currentServer,
      getServerVariable,
      getEffectiveServerValue
    } = this.props

    let currentServerDefinition = servers.find(s => s.get("url") === currentServer) || OrderedMap()
    let currentServerVariableDefs = currentServerDefinition.get("variables") || OrderedMap()
    let shouldShowVariableUI = currentServerVariableDefs.size !== 0;

    const options = servers.valueSeq().map(server => {
      return {
        value: server.get("url"),
        text: server.get("description") || server.get("url"),
      }
    });

    const columns = [
      {
        key: "name",
        header: "名称",
        width: 140,
        render: (row) => row.name,
      },
      {
        key: "value",
        header: "值",
        width: 200,
        render: (row) => {
          const { name, value } = row;
          if(value.get("enum")) {
            const options = value.get("enum").map(el => {
              return { text: el, value: el }
            });
            return (
              <Select 
                value={getServerVariable(currentServer, name)}
                options={options}
                placeholder="值"
                onChange={(val) => this.onServerVariableValueChange(name, val)}
                matchButtonWidth={true}
                appearance="button"
                style={{width: "150px"}}
              />
            )
          }
          return (
            <Input
              value={getServerVariable(currentServer, name) || ""}
              onChange={(val) => this.onServerVariableValueChange(name, val)}
              placeholder="值"
              style={{width: "150px"}}
            />
          )
        }
      },
    ]

    const records = [...currentServerVariableDefs.entrySeq()].map(([name, value]) => {
      return { name, value }
    });
    return (
      <Form.Item label="服务器" align="middle">
        <Select 
          onChange={this.onServerChange} 
          value={currentServer} 
          placeholder="请选择环境"
          style={{width: "200px"}}
          options={options}
          appearance="button"
          matchButtonWidth={true}
        />
        <div className="tea-form__help-text">{getEffectiveServerValue(currentServer)}</div>
      {shouldShowVariableUI &&
        <div style={{marginTop: "20px"}}>
          <Table.ActionPanel>
            <H4>配置变量</H4>
          </Table.ActionPanel>
          <Table 
            records={records}
            columns={columns}
            recordKey={(_, idx) => idx}
            disableHoverHighlight={true}
            bordered={true}
            compact={true}
            style={{width: "400px"}}
          />
        </div>}
      </Form.Item>
    )
  }
}
