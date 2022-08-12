import React from "react";
import { sanitizeUrl } from "core/utils";
import { safeBuildUrl } from "core/utils/url";
import { Row, Col, Form, H1, Badge, ExternalLink } from "@tencent/tea-component";

const Contact = (props) => {
  let { data, selectedServer, url: specUrl} = props;
  let name = data.get("name") || "the developer"
  let url = safeBuildUrl(data.get("url"), specUrl, {selectedServer})
  let email = data.get("email")
  return (
    <>
      <Form.Item label="联系人">
        <Form.Text>{name}</Form.Text>
      </Form.Item>
      {url && 
        <Form.Item label="联系人主页">
          <Form.Text>
            <ExternalLink href={sanitizeUrl(url)}>{url}</ExternalLink>
          </Form.Text>
        </Form.Item>}
      {email && 
        <Form.Item label="联系人邮箱">
          <Form.Text>
            <ExternalLink href={sanitizeUrl(`mailto:${email}`)}>{email}</ExternalLink>
          </Form.Text>
        </Form.Item>}
    </>
  )
}

const License = (props) => {
  let { license, selectedServer, url: specUrl } = props
  let name = license.get("name") || "License"
  let url = safeBuildUrl(license.get("url"), specUrl, {selectedServer})
  return (
    <>
      {(name || url) && 
        <Form.Item label="许可证">
          <Form.Text>
            <ExternalLink href={sanitizeUrl(url)}>{name || url}</ExternalLink>
          </Form.Text>
        </Form.Item>}
    </>
  )
}

export default (props) => {
  let { info, url, host, basePath, getComponent, externalDocs, selectedServer, url: specUrl } = props
  let version = info.get("version")
  let description = info.get("description")
  let title = info.get("title")
  let termsOfServiceUrl = safeBuildUrl(info.get("termsOfService"), specUrl, {selectedServer})
  let contact = info.get("contact")
  let license = info.get("license")
  let rawExternalDocsUrl = externalDocs && externalDocs.get("url")
  let externalDocsUrl = safeBuildUrl(rawExternalDocsUrl, specUrl, {selectedServer})
  let externalDocsDescription = externalDocs && externalDocs.get("description")
  const Markdown = getComponent("Markdown", true)

  return (
    <Row className="form-line-20">
      <Col>
        <H1>
          {title}&nbsp;
          <Badge dark theme="success" style={{verticalAlign: "middle"}}>{version}</Badge>
        </H1>
        <Form readonly>
          {host && basePath && 
            <Form.Item label="基础路径">
              <Form.Text>
                {host}{basePath}
              </Form.Text>
            </Form.Item>}
          {url && 
            <Form.Item label="URL">
              <Form.Text>
                <ExternalLink href={sanitizeUrl(url)}>{url}</ExternalLink>
              </Form.Text>
            </Form.Item>}
          <Form.Item label="描述">
            <Form.Text>
              <Markdown source={ description } />
            </Form.Text>
          </Form.Item>
          {termsOfServiceUrl && 
            <Form.Item label="服务条款">
              <Form.Text>
                <ExternalLink href={sanitizeUrl(termsOfServiceUrl)}>{termsOfServiceUrl}</ExternalLink>
              </Form.Text>
            </Form.Item>}
          {contact && contact.size ? <Contact getComponent={getComponent} data={ contact } selectedServer={selectedServer} url={url} /> : null }
          {license && license.size ? <License getComponent={getComponent} license={ license } selectedServer={selectedServer} url={url}/> : null }
          {externalDocsUrl && 
            <Form.Item label="附加文档">
              <Form.Text>
                <ExternalLink href={sanitizeUrl(externalDocsUrl)}>{externalDocsDescription || externalDocsUrl}</ExternalLink>
              </Form.Text>
            </Form.Item>}
        </Form>
      </Col>
    </Row>
  )
}