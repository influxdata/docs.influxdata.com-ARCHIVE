---
title: Slack Event Handler

menu:
  kapacitor_1_5:
    name: Slack
    weight: 13
    parent: event-handlers
---

#### Slack

Send alert events to Slack.

Options:

| Name       | Type   | Description                                                                                                                   |
| ----       | ----   | -----------                                                                                                                   |
| channel    | string | Slack channel in which to post messages.  If empty uses the channel from the configuration.                                   |
| username   | string | Username of the Slack bot. If empty uses the username from the configuration.                                                 |
| icon-emoji | string | IconEmoji is an emoji name surrounded in ':' characters. The emoji image will replace the normal user icon for the slack bot. |

Example:

```yaml
kind: slack
options:
    channel: '#alerts'
```
