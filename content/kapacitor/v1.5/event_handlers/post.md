---
title: Post event handler
description: The "post" event handler allows you to POST Kapacitor alert data to an HTTP endpoint. This page includes configuration options and usage examples.
menu:
  kapacitor_1_5:
    name: Post
    weight: 1100
    parent: event-handlers
---

The post event handler posts JSON encoded data to an HTTP endpoint.

## Configuration
Configuration as well as default [option](#options) values for the post event
handler are set in your `kapacitor.conf`.
Below is an example configuration:

### Post Settings in kapacitor.conf
```toml
[[httppost]]
  endpoint = "example"
  url = "http://example.com/path"
  headers = { Example = "your-key" }
  basic-auth = { username = "my-user", password = "my-pass" }
  alert-template = "{{.Message}}:{{range .Data.Series}}{{.Tags}},{{range .Values}}{{.}}{{end}}{{end}}"
  alert-template-file = "/path/to/template/file"
  row-template = "{{.Name}} host={{index .Tags \"host\"}}{{range .Values}} {{index . "time"}} {{index . "value"}}{{end}}"
  row-template-file = "/path/to/template/file"
```

#### `endpoint`
Name of a configured HTTP POST endpoint that acts as an identifier for `[[httppost]]`
configurations when multiple are present.
_Endpoints are identifiers only. They are not appended to HTTP POST URLs._

#### `url`
The URL to which the alert data will be posted.

#### `headers`
Set of extra header values to set on the POST request.

#### `basic-auth`
Set of authentication credentials to set on the POST request.

#### `alert-template`
Alert template for constructing a custom HTTP body.
Alert templates are only used with post [alert](/kapacitor/v1.5/nodes/alert_node/)
handlers as they consume alert data.
_Skip to [alert templating](#alert-templates)._

#### `alert-template-file`
Absolute path to an alert template file.
_Skip to [alert templating](#alert-templates)._

#### `row-template`
Row template for constructing a custom HTTP body.
Row templates are only used with the [httpPost node](/kapacitor/v1.5/nodes/http_post_node/)
pipeline nodes as they consume a row at a time.
_Skip to [row templating](#row-templates)._

#### `row-template-file`
Absolute path to a row template file.
_Skip to [row templating](#row-templates)._

### Defining configuration options with environment variables
The `endpoint`, `url`, and `headers` configuration options can be defined with
environment variables:

```bash
KAPACITOR_HTTPPOST_0_ENDPOINT = "example"
KAPACITOR_HTTPPOST_0_URL = "http://example.com/path"
KAPACITOR_HTTPPOST_0_HEADERS_Example1 = "header1"
KAPACITOR_HTTPPOST_0_HEADERS_Example2 = "header2"
```

### Configuring and using multiple HTTP POST endpoints
The `kapacitor.conf` supports multiple `[[httppost]]` sections.
The [`endpoint`](#endpoint) configuration option of each acts as a unique identifier for that specific configuration.
To use a specific `[[httppost]]` configuration with the Post alert handler,
specify the endpoint in your [post alert handler file](#example-handler-file-using-a-pre-configured-endpoint),
or [your TICKscript](#example-tickscript-using-a-pre-configured-endpoint).

_**kapacitor.conf**_
```toml
[[httppost]]
  endpoint = "endpoint1"
  url = "http://example-1.com/path"
  # ...

[[httppost]]
  endpoint = "endpoint2"
  url = "http://example-2.com/path"
  # ...
```

Multiple HTTP POST endpoint configurations can also be added using environment variables.
Variables values are grouped together using the number in each variable key.

```bash
KAPACITOR_HTTPPOST_0_ENDPOINT = "example0"
KAPACITOR_HTTPPOST_0_URL = "http://example-0.com/path"
KAPACITOR_HTTPPOST_0_HEADERS_Example1 = "header1"
KAPACITOR_HTTPPOST_0_HEADERS_Example2 = "header2"

KAPACITOR_HTTPPOST_1_ENDPOINT = "example1"
KAPACITOR_HTTPPOST_1_URL = "http://example-1.com/path"
KAPACITOR_HTTPPOST_1_HEADERS_Example1 = "header1"
KAPACITOR_HTTPPOST_1_HEADERS_Example2 = "header2"
```

## Options
The following post event handler options can be set in a
[handler file](/kapacitor/v1.5/event_handlers/#handler-file) or when using
`.post()` in a TICKscript.

| Name             | Type                    | Description                                                                                                         |
| ----             | ----                    | -----------                                                                                                         |
| url              | string                  | The URL to which the alert data will be posted.                                                                     |
| endpoint         | string                  | Name of a HTTP POST endpoint (configured in the `kapacitor.conf`) to use. _Cannot be specified in place of the URL._ |
| headers          | map of string to string | Set of extra header values to set on the POST request.                                                              |
| capture‑response | bool                    | If the HTTP status code is not an `2xx` code, read and log the the HTTP response.                                   |
| timeout          | duration                | Timeout for the HTTP POST.                                                                                          |

### Example: Handler file - Using a pre-configured endpoint
```yaml
id: handler-id
topic: topic-name
kind: post
options:
  # Using the 'example' endpoint configured in the kapacitor.conf
  endpoint: example
```

### Example: Handler file - Defining post options "inline"
```yaml
id: handler-id
topic: topic-name
kind: post
options:
  # Defining post options "inline"
  url: http://example.com/path
  headers:
    'Example1': 'example1'
    'Example2': 'example2'
  capture-response: true
  timeout: 10s
```

### Example: TICKscript - Using a pre-configured endpoint
```js
|alert()
  // ...  
  // Using the 'example' endpoint configured in the kapacitor.conf
  .post()
    .endpoint('example')
```

### Example: TICKscript - Defining post options "inline"
```js
|alert()
  // ...
  // Defining post options "inline"
  .post('http://example.com/path')
    .header('Example1', 'example1')
    .header('Example2', 'example2')
    .captureResponse()
    .timeout(10s)
```

## Using the Post event handler
The post event handler can be used in both TICKscripts and handler files to post
alert and HTTP POST data to an HTTP endpoint.
The examples below deal with alerts and use the same `[[httppost]]` configuration
defined in the `kapacitor.conf`:

_**HTTP POST settings in kapacitor.conf**_  
```toml
[[httppost]]
  endpoint = "api-alert"
  url = "http://mydomain.com/api/alerts"
  headers = { From = "alerts@mydomain.com" }
  alert-template = "{{.Message}}:{{range .Data.Series}}{{.Tags}},{{range .Values}}{{.}}{{end}}{{end}}"
```

### Post alerts from a TICKscript
The following TICKscripts use the `.post()` event handler to post the message,
"Hey, check your CPU", whenever idle CPU usage drops below 10%.

_**post-cpu-alert.tick**_  
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 10)
    .message('Hey, check your CPU')
    .post()
      .endpoint('api-alerts')
```

If you don't want to use the `[[httppost]]` settings defined in the `kapacitor.conf`,
you can specify your post options inline.

_**post-cpu-alert.tick**_  
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 10)
    .message('Hey, check your CPU')
    .post('http://example.com/path')
      .header('Example1', 'example1')
      .header('Example2', 'example2')
      .captureResponse()
      .timeout(10s)
```


### Post alerts from a defined handler
The following setup sends an alert to the `cpu` topic with the message, "Hey,
check your CPU".
A post handler is added that subscribes to the `cpu` topic and posts all alert
messages to the url and endpoint defined in the `kapacitor.conf`.

Create a TICKscript that publishes alert messages to a topic.
The TICKscript below sends an alert message to the `cpu` topic any time idle CPU
usage drops below 10%.

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

Create a handler file that subscribes to the `cpu` topic and uses the post event
handler to post alerts to an HTTP endpoint.

_**post\_cpu\_handler.yaml**_
```yaml
id: post-cpu-alert
topic: cpu
kind: post
options:
  url: 'http://example.com/path'
  headers:
    'From': 'alert@mydomain.com'
```

Add the handler:

```bash
kapacitor define-topic-handler post_cpu_handler.yaml
```


## Post templating
The post event handler allows you to customize the content and structure of
POSTs with alert and row templates.

### Alert templates
Alert templates are used to construct a custom HTTP body.
They are only used with post [alert](/kapacitor/v1.5/nodes/alert_node/) handlers
as they consume alert data.
Templates are defined either inline in the `kapacitor.conf` using the
[`alert-template`](#alert-template) configuration or in a separate file and referenced
using the [`alert-template-file`](#alert-template-file) config.

Alert templates use [Golang Template](https://golang.org/pkg/text/template/) and
have access to the following fields:

| Field        | Description                                             |
| -----        | -----------                                             |
| .ID          | The unique ID for the alert.                            |
| .Message     | The message of the alert.                               |
| .Details     | The details of the alert.                               |
| .Time        | The time the alert event occurred.                      |
| .Duration    | The duration of the alert event.                        |
| .Level       | The level of the alert, i.e INFO, WARN, or CRITICAL.    |
| .Data        | The data that triggered the alert.                      |
| .Recoverable | Indicates whether or not the alert is auto-recoverable. |

#### Inline alert template
_**kapacitor.conf**_
```toml
[[httppost]]
  endpoint = "example"
  url = "http://example.com/path"
  alert-template = "{{.Message}}:{{range .Data.Series}}{{.Tags}},{{range .Values}}{{.}}{{end}}{{end}}"
```

#### Alert template file
_**kapacitor.conf**_
```toml
[[httppost]]
  endpoint = "example"
  url = "http://example.com/path"
  alert-template-file = "/etc/templates/alert.html"
```

_**/etc/templates/alert.html**_
```html
{{.Message}}:{{range .Data.Series}}{{.Tags}},{{range .Values}}{{.}}{{end}}{{end}}
```

### Row templates
Row templates are used to construct a custom HTTP body.
They are only used with [httpPost](/kapacitor/v1.5/nodes/http_post_node/)
handlers as they consume a row at a time.
Templates are defined either inline in the `kapacitor.conf` using the
[`row-template`](#row-template) configuration or in a separate file and referenced
using the [`row-template-file`](#row-template-file) config.

Row templates use [Golang Template](https://golang.org/pkg/text/template/) and
have access to the following fields:

| Field   | Description                                                                                                                |
| -----   | -----------                                                                                                                |
| .Name   | The measurement name of the data stream                                                                                    |
| .Tags   | A map of tags on the data.                                                                                                 |
| .Values | A list of values; each a map containing a "time" key for the time of the point and keys for all other fields on the point. |

#### Inline row template
_**kapacitor.conf**_
```toml
[[httppost]]
  endpoint = "example"
  url = "http://example.com/path"
  row-template = '{{.Name}} host={{index .Tags "host"}}{{range .Values}} {{index . "time"}} {{index . "value"}}{{end}}'
```

#### Row template file
_**kapacitor.conf**_
```toml
[[httppost]]
  endpoint = "example"
  url = "http://example.com/path"
  row-template-file = "/etc/templates/row.html"
```

_**/etc/templates/row.html**_
```html
{{.Name}} host={{index .Tags \"host\"}}{{range .Values}} {{index . "time"}} {{index . "value"}}{{end}}
```
