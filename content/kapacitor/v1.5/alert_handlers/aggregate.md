---
title: Aggregate Alert Handler

menu:
  kapacitor_1_5:
    name: Aggregrate
    weight: 1
    parent: alert-handlers
---

#### Aggregate

Aggregate multiple events into a single event.

Options:

| Name     | Type            | Description                                                                                                     |
| ----     | ----            | -----------                                                                                                     |
| interval | duration string | How often to aggregate events.                                                                                  |
| topic    | string          | A topic into which to publish the aggregate events.                                                             |
| message  | string          | A template string where `{{.Interval}}` and `{{.Count}}` are available for constructing a meaning full message. |

Example:

```yaml
kind: aggregate
options:
    interval: 5m
    topic: agg_5m
```

Send aggregate events of the past `5m` to the `agg_5m` topic.
Further handling of the aggregated events can be configured on the `agg_5m` topic.
