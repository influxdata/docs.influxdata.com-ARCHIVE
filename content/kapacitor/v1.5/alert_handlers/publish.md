---
title: Publish Alert Handler

menu:
  kapacitor_1_5:
    name: Publish
    weight: 10
    parent: alert-handlers
---

#### Publish

Publish events to another topic.

Options:

| Name   | Type           | Description                            |
| ----   | ----           | -----------                            |
| topics | list of string | List of topic names to publish events. |

Example:

```yaml
kind: publish
options:
    topics:
        - system
        - ops_team
```
