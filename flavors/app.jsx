import React, { useState } from "react";
import ReactDOM from "react-dom";
import SwaggerUI from "./swagger-ui-react";
import "@src/style/main.scss";
import "@tencent/tea-component/dist/tea.css";
import { ApiJson } from "./swagger";
import "./app.scss";
import { MonacoEditor, Layout, H3 } from "@tencent/tea-component";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
const { Content, Body, Header } = Layout;

const Editor = ({ value, onChange }) => (
  <MonacoEditor 
    monaco={monaco}
    options={{
      lineNumbers: "on", 
      wordWrap: "on", 
      wrappingIndent: "indent", 
      contextmenu: false,
      minimap: { enabled: false },
      folding: true,
      theme: "vs-dark",
    }}
    language="json"
    height={"calc(100vh - 52px)"}
    width={"50vw"}
    value={value}
    onChange={onChange}
  />
)

const App = () => {
  const [json, setJson] = useState(JSON.stringify(ApiJson, null, 4));

  const onChange = (val) => {
    console.log(val);
    setJson(val);
  }

  return (
    <Layout>
      <Header>
        <H3>Tea Swagger UI</H3>
      </Header>
      <Body>
        <Content>
          <Content.Body full>
            <div className="layout-col2">
              <div className="ly-col">
                <Editor value={json} onChange={onChange}/>
              </div>
              <div className="ly-col tsu">
                <SwaggerUI spec={json} filter={true} />
              </div>
            </div>
          </Content.Body>
        </Content>
      </Body>
    </Layout>
  )
  
}

ReactDOM.render(
  <App />,
  document.querySelector("#swagger-ui")
)