import React from "react";
import ReactDOM from "react-dom";
import SwaggerUI from "./swagger-ui-react";
import "@src/style/main.scss";
import "@tencent/tea-component/dist/tea.css";
import { ApiJSON } from "./swagger";

const App = () => (
  <SwaggerUI spec={ApiJSON} filter={true} />
)

ReactDOM.render(
  <App />,
  document.querySelector("#swagger-ui")
)