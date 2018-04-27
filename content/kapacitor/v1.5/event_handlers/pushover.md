---
title: Pushover Event Handler

menu:
  kapacitor_1_5:
    name: Pushover
    weight: 11
    parent: event-handlers
---

#### Pushover

Send alert events to Pushover.

Options:

| Name      | Type   | Description                                                                                                           |
| ----      | ----   | -----------                                                                                                           |
| device    | string | Specific list of user'devices rather than all of a user's devices (multiple device names may be separated by a comma) |
| title     | string | The message title, otherwise the apps name is used.                                                               |
| url       | string | A supplementary URL to show with the message.                                                                        |
| url-title | string | A title for a supplementary URL, otherwise just the URL is shown.                                                      |
| sound     | string | The name of one of the sounds supported by the device clients to override the user's default sound choice.            |


Example:

```yaml
kind: pushover
options:
    title: Alert from Kapacitor
```
