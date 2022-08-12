/**
 * @prettier
 */

import React from "react"
import { stringify } from "core/utils";
import { Form } from "@tencent/tea-component";

export default function Example(props) {
  const { example, showValue, getComponent, getConfigs } = props

  const Markdown = getComponent("Markdown", true)
  const HighlightCode = getComponent("highlightCode")

  if(!example) return null

  return (
    <Form readonly className="form-line-20">
      {example.get("description") && 
      <Form.Item label="Example Description">
        <Form.Text>
          <Markdown source={example.get("description")} />
        </Form.Text>
      </Form.Item>}
      {showValue && example.has("value") && <Form.Item label="Example Value">
        <Form.Text>
          <HighlightCode getConfigs={ getConfigs } value={stringify(example.get("value"))} />
        </Form.Text>
      </Form.Item>}
    </Form>
  )
}