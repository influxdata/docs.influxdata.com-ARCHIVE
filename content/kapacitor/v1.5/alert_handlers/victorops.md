---
title: VictorOps Alert Handler

menu:
  kapacitor_1_5:
    name: VictorOps
    weight: 19
    parent: alert-handlers
---

#### Victorops

Send alert events to a VictorOps instance.

Options:

| Name        | Type   | Description                         |
| ----        | ----   | -----------                         |
| routing-key | string | The routing key of the alert event. |

Example:

```yaml
kind: victorops
options:
    routing-key: ops_team
```
