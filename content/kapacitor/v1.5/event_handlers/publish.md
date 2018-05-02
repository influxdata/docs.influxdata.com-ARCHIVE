---
title: Publish Event Handler
description: The "publish" event handler allows you to publish Kapacitor alerts messages to mulitple Kapacitor topics. This doc includes options and usage examples.
menu:
  kapacitor_1_5:
    name: Publish
    weight: 10
    parent: event-handlers
---

The publish event handler publishes events to another topic.

## Options
The following publish event handler options can be set in a
[handler file](/kapacitor/v1.5/event_handlers/#handler-file).

| Name   | Type           | Description                            |
| ----   | ----           | -----------                            |
| topics | list of string | List of topic names to publish events. |

### Example Handler File
```yaml
id: handler-id
topic: topic-name
kind: publish
options:
  topics:
    - system
    - ops_team
```

## Using the publish event handler
The following setup sends an alert to the `cpu` topic with the message,
"Hey, check your CPU".
A publish handler is added that subscribes to the `cpu` topic and publishes new
alerts to other topics.

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

Create a handler file that subscribes to the `cpu` topic and uses the publish
event handler to publish alerts to other topics.

_**publish\_cpu\_alerts\_handler.yaml**_
```yaml
id: publish-cpu-alert
topic: cpu
kind: publish
options:
  topics:
    - system
    - ops_team
```

Add the handler:

```bash
kapacitor define-topic-handler publish_cpu_alerts_handler.yaml
```
