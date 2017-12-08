---
title: Alert Match Expressions

menu:
  kapacitor_1_4:
    name: Alert Match Expressions
    identifier: match
    weight: 20
    parent: alerts
---

Alert handlers support match expressions that filters which alert events the handler processes.

A match expression is a TICKscript lambda expression.
The data that triggered the alert is available to the match expression, including all fields and tags.

In addition to the data that triggered the alert metadata about the alert is available.
This alert metadata is available via various functions.

| Name     | Type     | Description                                                                                                                |
| ----     | ----     | -----------                                                                                                                |
| level    | int      | The alert level of the alert event, one of '0', '1', '2', or '3' corresponding to 'OK', 'INFO', 'WARNING', and 'CRITICAL'. |
| changed  | bool     | Indicates whether the alert level changed with this event.                                                                 |
| name     | string   | Returns the measurement name of the triggering data.                                                                       |
| taskName | string   | Returns the task name that generated the alert event.                                                                      |
| duration | duration | Returns the duration of the event in a non  OK state.                                                                      |


Additionally the vars `OK`, `INFO`, `WARNING`, and `CRITICAL` have been defined to correspond with the return value of the `level` function.

For example to send only critical alerts to a handler, use this match expression:

```
level() == CRITICAL
```


## Examples

Send only changed events to the handler:

```
changed() == TRUE
```


Send only WARNING and CRITICAL events to the handler:

```
level() >= WARNING
```

Send events with the tag "host" equal to `s001.example.com` to the handler:

```
"host" == 's001.example.com'
```


