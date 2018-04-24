---
title: HipChat Alert Handler

menu:
  kapacitor_1_5:
    name: HipChat
    weight: 4
    parent: alert-handlers
---

#### Hipchat

Send alert events to a Hipchat room.

Options:

| Name  | Type   | Description                                                                               |
| ----  | ----   | -----------                                                                               |
| room  | string | HipChat room in which to post messages. If empty uses the channel from the configuration. |
| token | string | HipChat authentication token. If empty uses the token from the configuration.             |

Example:

```yaml
kind: hipchat
options:
    room: '#alerts'
```
