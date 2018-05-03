---
title: VictorOps Event Handler
description: The VictorOps event handler allows you to send Kapacitor alerts to VictorOps. This doc includes configuration options and usage examples.
menu:
  kapacitor_1_5:
    name: VictorOps
    weight: 1900
    parent: event-handlers
---

[VictorOps](https://victorops.com/) is an incident management platform that
provides observability, collaboration, & real-time alerting.
Kapacitor can be configured to send alert messages to VictorOps.

## Configuration
Configuration as well as default [option](#options) values for the VictorOps
event handler are set in your `kapacitor.conf`.
Below is an example config:

```toml
[victorops]
  enabled = true
  api-key = "xxxx"
  routing-key = "xxxx"
  url = "https://alert.victorops.com/integrations/generic/20131114/alert"
  json-data = false
  global = false
```

#### `enabled`
Set to `true` to enable the VictorOps event handler.

#### `api-key`
Your VictorOps API Key.

#### `routing-key`
Default VictorOps routing key, can be overridden per alert.

#### `url`
The VictorOps API URL. _**This should not need to be changed.**_

#### `json-data`
Use JSON for the "data" field.

> New VictorOps installations will want to set this to `true` as it makes
the data that triggered the alert available within VictorOps.
The default is `false` for backwards compatibility.

#### `global`
If true the all alerts will be sent to VictorOps without explicitly specifying
VictorOps in the TICKscript.
_The routing key can still be overridden._


## Options
The following VictorOpas event handler options can be set in a
[handler file](/kapacitor/v1.5/event_handlers/#handler-file) or when using
`.victorops()` in a TICKscript.

| Name        | Type   | Description                         |
| ----        | ----   | -----------                         |
| routing-key | string | The routing key of the alert event. |

### Example Handler File
```yaml
id: handler-id
topic: topic-name
kind: victorops
options:
  routing-key: ops_team
```

### Example TICKscript
```js
|alert()
  // ...
  .victorops()
    .routingKey('team_rocket')
```

## VictorOps Setup
To allow Kapacitor to send alerts to VictorOps, do the following:

1. Enable the "Alert Ingestion API" in the "Integrations" section of your
   VictorOps dashboard.
2. Use provided API key as the `api-key` in the `[victorops]` section of your
   `kapacitor.conf`.

## Using the VictorOps event handler
With the VictorOps event handler enabled and configured in your `kapacitor.conf`,
use the `.victorops()` attribute in your TICKscripts to send alerts to VictorOps
or define a VictorOps handler that subscribes to a topic and sends published
alerts to VictorOps.

The examples below use the same VictorOps configuration defined in the `kapacitor.conf`:

_**VictorOps settings in kapacitor.conf**_  
```toml
[victorops]
  enabled = true
  api-key = "mysupersecretapikey"
  routing-key = "team_rocket"
  url = "https://alert.victorops.com/integrations/generic/20131114/alert"
  json-data = true
  global = false
```

### Send alerts to an VictorOps room from a TICKscript

The following TICKscript uses the `.victorops()` event handler to send the
message, "Hey, check your CPU", to VictorOps whenever idle CPU usage drops
below 10%.

_**victorops-cpu-alert.tick**_  
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 10)
    .message('Hey, check your CPU')
    .victorops()
      .routingKey('team_rocket')
```

### Send alerts to an VictorOps room from a defined handler

The following setup sends an alert to the `cpu` topic with the message,
"Hey, check your CPU".
A VictorOps handler is added that subscribes to the `cpu` topic and publishes
all alert messages to VictorOps using default settings defined in the `kapacitor.conf`.

Create a TICKscript that publishes alert messages to a topic.
The TICKscript below sends an alert message to the `cpu` topic any time idle
CPU usage drops below 10%.

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

Create a handler file that subscribes to the `cpu` topic and uses the VictorOps
event handler to send alerts VictorOps.

_**victorops\_cpu\_handler.yaml**_
```yaml
topic: cpu
id: victorops-cpu-alert
kind: victorops
options:
  routing-key: 'team_rocket'
```

Add the handler:

```bash
kapacitor define-topic-handler victorops_cpu_handler.yaml
```
