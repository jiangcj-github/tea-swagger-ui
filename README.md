
## 开始

```bash
npm install
npm run dev
```

## 安装

```bash
npm install tea-swagger-ui
```

```ts
import React from "react";
import ReactDOM from "react-dom";
import SwaggerUI from "tea-swagger-ui";
import "tea-swagger-ui/dist/swagger-ui.css";
import "@tencent/tea-component/dist/tea.css";

const spec = {}

const App = () => (
  <SwaggerUI spec={spec} filter={true} />
)

ReactDOM.render(
  <App />,
  document.querySelector("#app")
)
```