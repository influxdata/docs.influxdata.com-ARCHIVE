---
title: Log Alert Handler

menu:
  kapacitor_1_5:
    name: Log
    weight: 6
    parent: alert-handlers
---

#### Log

Log alert events to a file.

Options:

| Name | Type   | Description                              |
| ---- | ----   | -----------                              |
| path | string | Path to the log file.                    |
| mode | int    | File mode to use when creating the file. |

Example:

```yaml
kind: log
options:
    path: '/tmp/alerts.log'
```
