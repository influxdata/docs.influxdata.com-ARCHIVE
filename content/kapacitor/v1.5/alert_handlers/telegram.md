---
title: Telegram Alert Handler

menu:
  kapacitor_1_5:
    name: Telegram
    weight: 18
    parent: alert-handlers
---

#### Telegram

Send alert events to a Telegram instance.

Options:

| Name                     | Type   | Description                                                                                   |
| ----                     | ----   | -----------                                                                                   |
| chat-id                  | string | Telegram user/group ID to post messages to. If empty uses the chati-d from the configuration. |
| parse-mode               | string | Parse node, defaults to Mardown. If empty uses the parse-mode from the configuration.         |
| disable-web-page-preview | bool   | Web Page preview. If empty uses the disable-web-page-preview from the configuration.          |
| disable-notification     | bool   | Disables Notification. If empty uses the disable-notification from the configuration.         |

Example:

```yaml
kind: telegram
```
