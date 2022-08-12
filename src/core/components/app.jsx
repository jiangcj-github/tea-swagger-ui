import React from "react"
import { Layout } from "@tencent/tea-component";
const { Body, Content } = Layout;

export default class App extends React.Component {

  getLayout() {
    let { getComponent, layoutSelectors } = this.props
    const layoutName = layoutSelectors.current()
    const Component = getComponent(layoutName, true)
    return Component ? Component : ()=> <h1> No layout defined for &quot;{layoutName}&quot; </h1>
  }

  render() {
    const Inner = this.getLayout()
    return (
      <Layout>
        <Body>
          <Content>
            <Content.Header title="Tea Swagger UI" />
            <Content.Body>
              <Inner />
            </Content.Body>
          </Content>
        </Body>
      </Layout>
    )
  }
}
