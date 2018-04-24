---
title: TCP Alert Handler

menu:
  kapacitor_1_5:
    name: TCP
    weight: 17
    parent: alert-handlers
---

#### TCP

Send JSON encoded alert data to a TCP endpoint.

Options:

| Name    | Type   | Description              |
| ----    | ----   | -----------              |
| address | string | Address of TCP endpoint. |

Example:

```yaml
kind: tcp
options:
    address: 127.0.0.1:7777
```
