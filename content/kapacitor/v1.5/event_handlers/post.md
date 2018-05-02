---
title: Post Event Handler
description: The "post" event handler allows you to POST Kapacitor alert data to an HTTP endpoint. This doc includes configuration options and usage examples.
menu:
  kapacitor_1_5:
    name: Post
    weight: 9
    parent: event-handlers
---

The post event handler posts JSON encoded data to an HTTP endpoint.

## Configuration
Configuration as well as default [option](#options) values for the post event handler are set in your `kapacitor.conf`.
Below is an example config:

### Post Settings in kapacitor.conf
```toml
[[httppost]]
  endpoint = "example"
  url = "http://example.com"
  headers = { Example = "your-key" }
  basic-auth = { username = "my-user", password = "my-pass" }
  alert-template = "{{.Message}}:{{range .Data.Series}}{{.Tags}},{{range .Values}}{{.}}{{end}}{{end}}"
  alert-template-file = "/path/to/template/file"
  row-template = "{{.Name}} host={{index .Tags \"host\"}}{{range .Values}} {{index . "time"}} {{index . "value"}}{{end}}"
  row-template-file = "/path/to/template/file"
```

#### `endpoint`
Name of a configured httppost endpoint. _**Can not be specified in the URL.**_

#### `url`
The URL to which the alert data will be posted.

#### `headers`
Set of extra header values to set on the POST request.

#### `basic-auth`
Set of authentication credentials to set on the POST request.

#### `alert-template`
Alert template for constructing a custom HTTP body.
Alert templates are only used with post [alert](/kapacitor/v1.5/nodes/alert_node/) handlers as they consume alert data.
_Skip to [alert templating](#alert-templates)._

#### `alert-template-file`
Absolute path to an alert template file.
_Skip to [alert templating](#alert-templates)._

#### `row-template`
Row template for constructing a custom HTTP body.
Row templates are only used with [httpPost](/kapacitor/v1.5/nodes/http_post_node/) pipeline nodes as they consume a row at a time.
_Skip to [row templating](#row-templates)._

#### `row-template-file`
Absolute path to a row template file.
_Skip to [row templating](#row-templates)._

### Defining config options with environment variables
The `endpoint`, `url`, and `headers` config options can be defined with environment variables:

```bash
KAPACITOR_HTTPPOST_0_ENDPOINT = "example"
KAPACITOR_HTTPPOST_0_URL = "http://example.com"
KAPACITOR_HTTPPOST_0_HEADERS_Example1 = "header1"
KAPACITOR_HTTPPOST_0_HEADERS_Example2 = "header2"
```

## Options
The following post event handler options can be set in a [handler file](/kapacitor/v1.5/event_handlers/#handler-file) or when using `.post()` in a TICKscript.

| Name     | Type                    | Description                                                             |
| ----     | ----                    | -----------                                                             |
| url      | string                  | The URL to which the alert data will be posted.                         |
| endpoint | string                  | Name of a configured httppost endpoint, cannot be specified in the URL. |
| headers  | map of string to string | Set of extra header values to set on the POST request.                  |

### Example Handler File
```yaml
id: handler-id
topic: topic-name
kind: post
options:
  url: http://example.com
  endpoint: example
  headers:
    'Example1': 'example1'
    'Example2': 'example2'
```

### Example TICKscript
```js
|alert()
  // ...
  .post()
    .url('http://example.com')
    .endpoint('example')
    .headers('Example1': 'example1', 'Example2': 'example2')
```

## Using the Post event handler
The post event handler can be used in both TICKscripts and handler files to post alert and httpPost data to an HTTP endpoint.
The examples below deal with alerts and use the same `httppost` configuration defined in the `kapacitor.conf`:

_**httppost settings in kapacitor.conf**_  
```toml
[[httppost]]
  endpoint = "api/alert"
  url = "http://mydomain.com"
  headers = { From = "alerts@mydomain.com" }
  alert-template = "{{.Message}}:{{range .Data.Series}}{{.Tags}},{{range .Values}}{{.}}{{end}}{{end}}"
```

### Post alerts from a TICKscript
The following TICKscript uses the `.post()` event handler to post the message, "Hey, check your CPU", whenever idle CPU usage drops below 10%.

_**post-cpu-alert.tick**_  
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 10)
    .message('Hey, check your CPU')
    .post()
      .url('http://mydomain.com')
      .endpoint('api/alerts')
```

### Post alerts from a defined handler
The following setup sends an alert to the `cpu` topic with the message, "Hey, check your CPU". A post handler is added that subscribes to the `cpu` topic and posts all alert messages to the url and endpoint defined in the `kapacitor.conf`.

Create a TICKscript that publishes alert messages to a topic.
The TICKscript below sends an alert message to the `cpu` topic any time idle CPU usage drops below 10%.

_**cpu\_alert.tick**_
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 10)
    .message('Hey, check your CPU')
    .topic('cpu')
```

Add and enable the TICKscript:

```bash
kapacitor define cpu_alert -tick cpu_alert.tick
kapacitor enable cpu_alert
```

Create a handler file that subscribes to the `cpu` topic and uses the post event handler to post alerts to an HTTP endpoint.

_**post\_cpu\_handler.yaml**_
```yaml
id: post-cpu-alert
topic: cpu
kind: post
options:
  headers:
    'From': 'alert@mydomain.com'
```

Add the handler:

```bash
kapacitor define-topic-handler post_cpu_handler.yaml
```


## Post Templating
The post event handler allows you to customize the content and structure of POSTs with alert and row templates.

### Alert Templates
Alert templates are used to construct a custom HTTP body. They are only used with post [alert](/kapacitor/v1.5/nodes/alert_node/) handlers as they consume alert data. Templates are defined either inline in the `kapacitor.conf` using the [`alert-template`](#alert-template) config or in a separate file and referenced using the [`alert-template-file`](#alert-template-file) config.

Alert templates use [Golang Template](https://golang.org/pkg/text/template/) and have access to the following fields:

| Field     | Description                                          |
| -----     | -----------                                          |
| .ID       | The unique ID for the alert.                         |
| .Message  | The message of the alert.                            |
| .Details  | The details of the alert.                            |
| .Time     | The time the alert event occurred.                   |
| .Duration | The duration of the alert event.                     |
| .Level    | The level of the alert, i.e INFO, WARN, or CRITICAL. |
| .Data     | The data that triggered the alert.                   |

#### Inline Alert Template
_**kapacitor.conf**_
```toml
[httppost]]
  endpoint = "example"
  url = "http://example.com"
  alert-template = "{{.Message}}:{{range .Data.Series}}{{.Tags}},{{range .Values}}{{.}}{{end}}{{end}}"
```

#### Alert Template File
_**kapacitor.conf**_
```toml
[httppost]]
  endpoint = "example"
  url = "http://example.com"
  alert-template-file = "/etc/templates/alert.html"
```

_**/etc/templates/alert.html**_
```html
{{.Message}}:{{range .Data.Series}}{{.Tags}},{{range .Values}}{{.}}{{end}}{{end}}
```

### Row Templates
Row templates are used to construct a custom HTTP body. They are only used with post [httpPost](/kapacitor/v1.5/nodes/http_post_node/) handlers as they consume a row at a time. Templates are defined either inline in the `kapacitor.conf` using the [`row-template`](#row-template) config or in a separate file and referenced using the [`row-template-file`](#row-template-file) config.

Row templates use [Golang Template](https://golang.org/pkg/text/template/) and have access to the following fields:

| Field   | Description                                                                                                                |
| -----   | -----------                                                                                                                |
| .Name   | The measurement name of the data stream                                                                                    |
| .Tags   | A map of tags on the data.                                                                                                 |
| .Values | A list of values; each a map containing a "time" key for the time of the point and keys for all other fields on the point. |

#### Inline Row Template
_**kapacitor.conf**_
```toml
[httppost]]
  endpoint = "example"
  url = "http://example.com"
  row-template = "{{.Name}} host={{index .Tags \"host\"}}{{range .Values}} {{index . "time"}} {{index . "value"}}{{end}}"
```

#### Row Template File
_**kapacitor.conf**_
```toml
[httppost]]
  endpoint = "example"
  url = "http://example.com"
  row-template-file = "/etc/templates/row.html"
```

_**/etc/templates/row.html**_
```html
{{.Name}} host={{index .Tags \"host\"}}{{range .Values}} {{index . "time"}} {{index . "value"}}{{end}}
```
