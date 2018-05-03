---
title: TCP Event Handler
description: The "tcp" event handler allows you to send Kapacitor alert data to a TCP endpoint. This doc includes options and usage examples.
menu:
  kapacitor_1_5:
    name: TCP
    weight: 1800
    parent: event-handlers
---

The TCP event handler sends JSON encoded alert data to a TCP endpoint.

## Options
The following TCP event handler options can be set in a [handler file](/kapacitor/v1.5/event_handlers/#handler-file) or when using `.tcp()` in a TICKscript.

| Name    | Type   | Description              |
| ----    | ----   | -----------              |
| address | string | Address of TCP endpoint. |

### Example Handler File
```yaml
id: handler-id
topic: topic-name
kind: tcp
options:
  address: 127.0.0.1:7777
```

### Example TICKscript
```js
|alert()
  // ...
  .tcp('127.0.0.1:7777')
```

## Using the TCP event handler
The TCP event handler can be used in both TICKscripts and handler files to send
alert data to TCP endpoint.

### Send alert data to a TCP endpoint from a TICKscript
The following TICKscript uses the `.tcp()` event handler to send alert data
whenever idle CPU usage drops below 10%.

_**tcp-cpu-alert.tick**_  
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 10)
    .message('Hey, check your CPU')
    .tcp('127.0.0.1:7777')
```

### Send alert data to a TCP endpoint from a defined handler
The following setup sends an alert to the `cpu` topic with the message,
"Hey, check your CPU". A TCP handler is added that subscribes to the `cpu` topic
and sends all alert messages to a TCP endpoint.

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

Create a handler file that subscribes to the `cpu` topic and uses the TCP event
handler to send alert data to a TCP endpoint.

_**tcp\_cpu\_handler.yaml**_
```yaml
id: tcp-cpu-alert
topic: cpu
kind: tcp
options:
  address: 127.0.0.1:7777
```

Add the handler:

```bash
kapacitor define-topic-handler tcp_cpu_handler.yaml
```
