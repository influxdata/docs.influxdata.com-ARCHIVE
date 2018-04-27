---
title: Kafka Event Handler

menu:
  kapacitor_1_5:
    name: Kafka
    weight: 5
    parent: event-handlers
---

#### Kafka

Send alert events to an Apache Kafka cluster.

Options:

| Name     | Type   | Description                 |
| ----     | ----   | -----------                 |
| cluster  | string | Name of the Kafka cluster.  |
| topic    | string | Kafka topic.                |
| template | string | Message template.           |

```yaml
kind: hipchat
options:
    cluster: 'kafka-cluster'
    topic: 'topic-name'
    template: 'template-name'
```
