---
title: Exec Event Handler

menu:
  kapacitor_1_5:
    name: Exec
    weight: 3
    parent: event-handlers
---

#### Exec

Execute an external program, the event data is passed over STDIN to the process.

Options:

| Name | Type           | Description                       |
| ---- | ----           | -----------                       |
| prog | string         | Path to program to execute.       |
| args | list of string | List of arguments to the program. |

Example:

```yaml
kind: exec
options:
    prog: /path/to/executable
```
