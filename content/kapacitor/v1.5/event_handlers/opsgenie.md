---
title: OpsGenie Event Handler

menu:
  kapacitor_1_5:
    name: OpsGenie
    weight: 7
    parent: event-handlers
---

[OpsGenie](https://www.opsgenie.com/) is an incident response orchestration platform for DevOps & ITOps teams.
Kapacitor can be configured to send alert messages to OpsGenie.

## Configuration

## Options
The following OpsGenie event handler options can be set in a [handler file](/kapacitor/v1.5/event_handlers/#handler-file) or when using `.opsgenie()` in a TICKscript.


| Name            | Type                | Description    |
| ----            | ----                | -----------    |
| teams-list      | list of string      | List of teams. |
| recipients-list | List of recipients. |                |

## Example Handler File
```yaml
id: handler-id
topic: topic-name
kind: opsgenie
options:
  teams:
    - rocket
  recipient-list:
    - john@doe.com
```

## Example TICKscript
```js
alert()
  // ...
  .opsgenie()
```
