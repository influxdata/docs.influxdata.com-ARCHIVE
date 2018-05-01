---
title: Publish Event Handler

menu:
  kapacitor_1_5:
    name: Publish
    weight: 10
    parent: event-handlers
---

The publish event handler publishes events to another topic.

## Options
The following publish event handler options can be set in a [handler file](/kapacitor/v1.5/event_handlers/#handler-file) or when using `.publish()` in a TICKscript.

| Name   | Type           | Description                            |
| ----   | ----           | -----------                            |
| topics | list of string | List of topic names to publish events. |

### Example Handler File
```yaml
id: alert-id
topic: topic-name
kind: publish
options:
  topics:
    - system
    - ops_team
```

### Example TICKscript
```js
|alert()
  // ...
  .publish('topic1', 'topic2')
```

## Using the publish event handler
The publish event handler can be used in both TICKscripts and handler files to publish alerts to multiple topics.

### Publish to multiple topics from a TICKscript

The following TICKscript uses the `.publish()` event handler to publish alerts to multiple topics whenever idle CPU usage drops below 10% .

_**publish-cpu-alert.tick**_  
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 10)
    .message('Hey, check your CPU')
    .publish('system', 'ops_team')
```

### Publish to multiple topics from a defined handler

The following setup sends an alert to the `cpu` topic with the message, "Hey, check your CPU". An publish handler is added that subscribes to the `cpu` topic and publishes new alerts to other topics.

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

Create a handler file that subscribes to the `cpu` topic and uses the publish event handler to publish alerts to other topics.

_**publish\_cpu\_handler.yaml**_
```yaml
topic: cpu
id: publish-cpu-alert
kind: publish
options:
  topics:
    - system
    - ops_team
```

Add the handler:

```bash
kapacitor define-topic-handler publish_cpu_handler.yaml
```
