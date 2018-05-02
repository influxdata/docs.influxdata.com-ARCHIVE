---
title: Aggregate Event Handler
description: The aggregate event handler allows you to aggregate alerts messages over a specified interval. This doc includes aggregate options and usage examples.
menu:
  kapacitor_1_5:
    name: Aggregrate
    weight: 1
    parent: event-handlers
---

The aggregate event handler aggregates multiple events into a single event.
It subscribes to a topic and aggregates published messages within a defined interval into an aggregated topic.

## Options
The following aggregate event handler options can be set in a [handler file](/kapacitor/v1.5/event_handlers/#handler-file).

| Name     | Type            | Description                                                                                                   |
| ----     | ----            | -----------                                                                                                   |
| interval | duration string | How often to aggregate events.                                                                                |
| topic    | string          | A topic into which to publish the aggregate events.                                                           |
| message  | string          | A template string where `{{.Interval}}` and `{{.Count}}` are available for constructing a meaningful message. |

#### Example Handler File
```yaml
id: handler-id
topic: topic-name
kind: aggregate
options:
  interval: 5m
  topic: agg_5m
  message: '{{.Count}} new events in the last {{.Interval}}'
```

## Using the aggregate event handler
The aggregate event handler subscribes to a topic and aggregates messages published to that topic at specified intervals.
The TICKscript below, `cpu_alert.tick`, publishes alerts to the `cpu` topic if CPU idle-usage is less than 10% (or CPU usage is greater than 90%).

#### cpu\_alert.tick
```js
stream
    |from()
      .measurement('cpu')
      .groupby(*)
    |alert()
      .crit(lambda: "usage_idle" < 10)
      .topic('cpu')
```

Add and enable this TICKscript with the following:

```bash
kapacitor define cpu_alert -tick cpu_alert.tick
kapacitor enable cpu_alert
```

Create a new handler file, `aggregated_cpu_alerts.yaml`, using the `aggregate` event handler that subscribes to the `cpu` topic, aggregates alerts from the last 10 minutes, and publishes aggregated messages to a new `aggr_cpu` topic. _Handler files can be YAML or JSON._

#### aggr_cpu_alerts.yaml
```yaml
id: aggr_cpu_alerts_10m
topic: cpu
kind: aggregate
options:
  interval: 10m
  topic: aggr_cpu
  message: '{{.Count}} CPU alerts in the last {{.Interval}}'
```

Add the handler file:

```bash
kapacitor define-topic-handler aggr_cpu_alerts_10m.yaml
```

Aggregated CPU alert messages will be published to the `aggr_cpu` topic every 10 minutes. Further handling of the aggregated events can be configured on the `aggr_cpu` topic.
