---
title: OpsGenie Alert Handler

menu:
  kapacitor_1_5:
    name: OpsGenie
    weight: 7
    parent: alert-handlers
---

#### Opsgenie

Send alert events to OpsGenie.

Options:

| Name            | Type                | Description    |
| ----            | ----                | -----------    |
| teams-list      | list of string      | List of teams. |
| recipients-list | List of recipients. |

Example:

```yaml
kind: opsgenie
options:
    teams:
        - rocket
```
