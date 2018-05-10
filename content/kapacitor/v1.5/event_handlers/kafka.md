---
title: Kafka event handler
description: The Kafka event handler allows you to send Kapacitor alerts to an Apache Kafka cluster. This page includes configuration options and usage examples.
menu:
  kapacitor_1_5:
    name: Kafka
    weight: 600
    parent: event-handlers
---

[Apache Kafka](https://kafka.apache.org/) is distributed streaming platform
designed for building real-time data pipelines and streaming apps.
Kapacitor can be configured to send alert messages to a Kafka cluster.

## Configuration
Configuration as well as default [option](#options) values for the Kafka event
handler are set in your `kapacitor.conf`.
Below is an example config:

```toml
[[kafka]]
  enabled = true
  id = "localhost"
  brokers = []
  timeout = "10s"
  batch-size = 100
  batch-timeout = "1s"
  use-ssl = false
  ssl-ca = ""
  ssl-cert = ""
  ssl-key = ""
  insecure-skip-verify = false
```

> Multiple Kafka clients may be configured by repeating `[[kafka]]` sections.
> The `id` acts as a unique identifier for each configured Kafka client.

#### `enabled`
Set to `true` to enable the Kafka event handler.

#### `id`
A unique identifier for the Kafka cluster.

#### `brokers`
List of Kafka broker addresses using the `host:port` format.

#### `timeout`
Timeout on network operations with the Kafka brokers.
If 0 a default of 10s is used.

#### `batch-size`
The number of messages batched before being sent to Kafka.
If 0 a default of 100 is used.

#### `batch-timeout`
The maximum amount of time to wait before flushing an incomplete batch.
If 0 a default of 1s is used.

#### `use-ssl`
Enable ssl communication.
Must be `true` for other ssl options to take effect.

#### `ssl-ca`
Path to certificate authority file.

#### `ssl-cert`
Path to host certificate file.

#### `ssl-key`
Path to certificate private key file.

#### `insecure-skip-verify`
Use SSL but skip chain and host verification.
_This is necessary if using a self-signed certificate._

## Options
The following Kafka event handler options can be set in a
[handler file](/kapacitor/v1.5/event_handlers/#handler-file) or when using
`.kafka()` in a TICKscript.

| Name     | Type   | Description                                                       |
| ----     | ----   | -----------                                                       |
| cluster  | string | Name of the Kafka cluster.                                        |
| topic    | string | Kafka topic. _In TICKscripts, this is set using `.kafkaTopic()`._ |
| template | string | Message template.                                                 |

### Example: handler file
```yaml
id: kafka-event-handler
topic: kapacitor-topic-name
kind: kafka
options:
  cluster: 'kafka-cluster'
  topic: 'kafka-topic-name'
  template: 'kafka-template-name'
```

### Example: TICKscript
```js
|alert()
  // ...
  .kafka()
    .cluster('kafka-cluster')
    .kafkaTopic('kafka-topic-name')
    .template('kafka-template-name')
```

##  Using the Kafka Event Handler
With the Kafka event handler enabled in your `kapacitor.conf`, use the `.kafka()`
attribute in your TICKscripts to send alerts to a Kafka cluster or define a
Kafka handler that subscribes to a topic and sends published alerts to Kafka.

The examples below use the same Kafka configuration defined in the `kapacitor.conf`:

_**Kafka settings in kapacitor.conf**_  
```toml
[[kafka]]
  enabled = true
  id = "infra-monitoring"
  brokers = ["123.45.67.89:9092", "123.45.67.90:9092"]
  timeout = "10s"
  batch-size = 100
  batch-timeout = "1s"
  use-ssl = true
  ssl-ca = "/etc/ssl/certs/ca.crt"
  ssl-cert = "/etc/ssl/certs/cert.crt"
  ssl-key = "/etc/ssl/certs/cert-key.key"
  insecure-skip-verify = true
```

### Send alerts to a Kafka cluster from a TICKscript

The following TICKscript uses the `.kafka()` event handler to send the message,
"Hey, check your CPU", whenever idle CPU usage drops below 10%.
It publishes the messages to the `cpu-alerts` topic in the `infra-monitoring`
Kafka cluster defined in the `kapacitor.conf`.

_**kafka-cpu-alert.tick**_  
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 10)
    .message('Hey, check your CPU')
    .kafka()
      .kafkaTopic('cpu-alerts')
```

### Send alerts to a Kafka cluster from a defined handler

The following setup sends an alert to the `cpu` topic with the message, "Hey,
check your CPU". A Kafka handler is added that subscribes to the `cpu` topic and
publishes all alert messages to the `cpu-alerts` topic associated with the
`infra-monitoring` Kafka cluster defined in the `kapacitor.conf`.

Create a TICKscript that publishes alert messages to a topic.
The TICKscript below sends an alert message to the `cpu` topic any time CPU
idle usage drops below 10% _(or CPU usage is above 90%)_.

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

Create a handler file that subscribes to the `cpu` topic and uses the Kafka
event handler to send alerts to the `alerts` channel in Kafka.

_**kafka\_cpu\_handler.yaml**_
```yaml
id: kafka-cpu-alert
topic: cpu
kind: kafka
options:
  topic: 'cpu-alerts'
```

Add the handler:

```bash
kapacitor define-topic-handler kafka_cpu_handler.yaml
```
