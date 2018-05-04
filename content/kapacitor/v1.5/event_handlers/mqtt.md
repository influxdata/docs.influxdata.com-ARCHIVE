---
title: MQTT event handler
description: The MQTT event handler allows you to send Kapacitor alert messages to an MQTT handler. This doc includes configuration options and usage examples.
menu:
  kapacitor_1_5:
    name: MQTT
    weight: 800
    parent: event-handlers
---

[MQTT](http://mqtt.org/) is a lightweight messaging protocol for small sensors and mobile devices.
Kapacitor can be configured to send alert messages to an MQTT broker.

## Configuration
Configuration as well as default [option](#options) values for the MQTT
event handler are set in your `kapacitor.conf`.
Below is an example config:

```toml
[[mqtt]]
  enabled = true
  name = "localhost"
  default = true
  url = "tcp://localhost:1883"
  ssl-ca = "/etc/kapacitor/ca.pem"
  ssl-cert = "/etc/kapacitor/cert.pem"
  ssl-key = "/etc/kapacitor/key.pem"
  client-id = "xxxx"
  username = "xxxx"
  password = "xxxx"
```

> Multiple MQTT brokers may be configured by repeating `[[mqtt]]` sections.
> The `name` acts as a unique identifier for each configured MQTT client.

#### `enabled`
Set to `true` to enable the MQTT event handler.

#### `name`
Unique name for this broker configuration.

#### `default`
When using multiple MQTT configurations, sets the current configuration as
the default.

#### `url`
URL of the MQTT broker.
Possible protocols include:

**tcp** - Raw TCP network connection   
**ssl** - TLS protected TCP network connection  
**ws** - Websocket network connection  

#### `ssl-ca`
Absolute path to certificate autority (CA) file.
_A CA can be provided without a key/certificate pair._

#### `ssl-cert`
Absolute path to pem encoded certificate file.

#### `ssl-key`
Absolute path to pem encoded key file.

#### `client-id`
Unique ID for this MQTT client.
If empty, the value of `name` is used.

#### `username`
MQTT username.

#### `password`
MQTT password.


## Options
The following MQTT event handler options can be set in a
[handler file](/kapacitor/v1.5/event_handlers/#handler-file) or when using
`.mqtt()` in a TICKscript.

| Name        | Type   | Description                                                                                                                  |
| ----        | ----   | -----------                                                                                                                  |
| broker-name | string | The name of the configured MQTT broker to use when publishing the alert. If empty defaults to the configured default broker. |
|	topic       | string | The MQTT topic to which alerts will be dispatched                                                                            |
| qos         | int64  | The [QoS](http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc398718099) that will be used to deliver the alerts. Valid values include: <br><br><code>0</code> : At most once delivery<br><code>1</code> : At least once delivery<br><code>2</code> : Exactly once delivery |
|	retained    | bool   | Indicates whether this alert should be delivered to clients that were not connected to the broker at the time of the alert.  |

### Example: handler file
```yaml
id: handler-id
topic: topic-name
kind: mqtt
options:
  broker-name: 'name'
  topic: 'topic-name'
  qos: 1
  retained: true
```

### Example: TICKscript
```js
|alert()
  // ...
  .mqtt('topic-name')
    .brokerName('name')
    .qos(1)
    .retained()
```

## Using the MQTT event handler
The MQTT event handler can be used in both TICKscripts and handler files to send
alerts to an MQTT broker.

The examples below use the following MQTT broker configurations defined in the
`kapacitor.conf`:

_**MQTT settings in kapacitor.conf**_
```toml
[[mqtt]]
  enabled = true
  name = "localhost"
  default = true
  url = "tcp://localhost:1883"

[[mqtt]]
  enabled = true
  name = "alerts-broker"
  default = false
  url = "ssl://123.45.67.89:1883"
  ssl-ca = "/etc/kapacitor/ca.pem"
  ssl-cert = "/etc/kapacitor/cert.pem"
  ssl-key = "/etc/kapacitor/key.pem"
  client-id = "alerts-broker"
  username = "myuser"
  password = "mysupersecretpassw0rd"
```

### Send alerts to an MQTT broker from a TICKscript

The following TICKscript uses the `.mqtt()` event handler to send alerts to the
`alerts` MQTT topic of the default MQTT broker defined in the `kapacitor.confi`
whenever idle CPU usage drops below 10%.

_**log-cpu-alert.tick**_  
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 10)
    .message('{{ .Time }}: CPU usage over 90%')
    .mqtt('alerts')
      .qos(2)
```

### Send alerts to an MQTT broker from a defined handler

The following setup sends an alert to the `cpu` topic.
An MQTT handler is added that subscribes to the `cpu` topic and sends messages
to `alerts` MQTT topic of the `alerts-broker` whenever a new message is published.

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
    .message('{{ .Time }}: CPU usage over 90%')
    .topic('cpu')
```

Add and enable the TICKscript:

```bash
kapacitor define cpu_alert -tick cpu_alert.tick
kapacitor enable cpu_alert
```

Create a handler file that subscribes to the `cpu` topic and uses the MQTT event
handler to send alerts to the `alerts-broker`.

_**log\_cpu\_handler.yaml**_
```yaml
id: log-cpu-alert
topic: cpu
kind: mqtt
options:
  broker-name: 'alerts-broker'
  topic: 'alerts'
  qos: 2
```

Add the handler:

```bash
kapacitor define-topic-handler log_cpu_handler.yaml
```
