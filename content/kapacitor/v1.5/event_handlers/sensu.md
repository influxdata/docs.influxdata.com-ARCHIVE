---
title: Sensu Event Handler

menu:
  kapacitor_1_5:
    name: Sensu
    weight: 12
    parent: event-handlers
---

#### Sensu

Send alert events to Sensu.

Options:

| Name     | Type           | Description                                                                               |
| ----     | ----           | -----------                                                                               |
| source   | string         | Sensu source for which to post messages. If empty uses the source from the configuration. |
| handlers | list of string | Sensu handler list. If empty uses the handler list from the configuration.                |

Example:

```yaml
kind: sensu
```
