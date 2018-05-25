---
title: Kapacitor alerts overview

menu:
  kapacitor_1_5:
    name: Alerts overview
    weight: 3
    parent: work-w-kapacitor
---

Kapacitor makes it possible to handle alert messages in two different ways.

* The messages can be pushed directly to an event handler exposed through the
[Alert](/kapacitor/v1.5/nodes/alert_node/) node.
* The messages can be published to a topic namespace to which one or more alert
handlers can subscribe.

<!--
In addition to defining alert handler in TICKscript Kapacitor supports an alert system that follows a publish subscribe design pattern.
Alerts are published to a `topic` and `handlers` subscribe to a topic.
-->

No matter which approach is used, the handlers need to be enabled and configured
in the [configuration](/kapacitor/v1.5/administration/configuration/#optional-table-groupings)
file.  If the handler requires sensitive information such as tokens and
passwords, it can also be configured using the [Kapacitor HTTP API](/kapacitor/v1.5/working/api/#overriding-configurations).

## Push to handler

Pushing messages to a handler is the basic approach presented in the
[Getting started with Kapacitor](/kapacitor/v1.5/introduction/getting-started/#triggering-alerts-from-stream-data)
guide. This involves simply calling the relevant chaining method made available
through the `alert` node.  Messages can be pushed to `log()` files, the `email()`
service, the `httpOut()` cache and many [third party services](#list-of-handlers).

## Publish and subscribe

An alert topic is simply a namespace where alerts are grouped.
When an alert event fires it can be published to a topic.
Multiple handlers can subscribe (can be bound) to that topic and all handlers
process each alert event for the topic.  Handlers get bound to topics through
the `kapacitor` command line client and handler binding files.  Handler binding
files can be written in `yaml` or `json`.  They contain four key fields and one
optional one.


* `topic`: declares the topic to which the handler will subscribe.
* `id`: declares the identity of the binding.
* `kind`: declares the type of event handler to be used.  Note that this
needs to be enabled in the `kapacitord` configuration.
* `match`: (optional) declares a match expression used to filter which
alert events will be processed. See the [Match Expressions](#match-expressions)
section below.
* `options`: options specific to the handler in question. These are
listed below in the section [List of handlers](#list-of-handlers)


**Example 1: A handler binding file for the _slack_ handler and _cpu_ topic**
```
topic: cpu
id: slack
kind: slack
options:
  channel: '#kapacitor'
```

Example 1 could be saved into a file named `slack_cpu_handler.yaml`.

This can then be generated into a Kapacitor topic handler through the command
line client.

```
$ kapacitor define-topic-handler slack_cpu_handler.yaml
```

Handler bindings can also be created over the HTTP API.  See the
[Create a Handler](/kapacitor/v1.5/working/api/#creating-handlers) section of
the HTTP API document.

For a walk through on defining and using alert topics see the
[Using Alert Topics](/kapacitor/v1.5/working/using_alert_topics) walk-through.

## Handlers

A handler takes action on incoming alert events for a specific topic.
Each handler operates on exactly one topic.

### List of handlers

The following is a list of available alert event handlers:

| Handler                       | Description                                                                           |
| -------                       | -----------                                                                           |
| [Alerta](/kapacitor/v1.5/event_handlers/alerta)             | Post alert message to Alerta.                                                         |
| [email](/kapacitor/v1.5/event_handlers/email)               | Send and email with alert data.                                                       |
| [exec](/kapacitor/v1.5/event_handlers/exec)                 | Execute a command passing alert data over STDIN.                                      |
| [HipChat](/kapacitor/v1.5/event_handlers/hipchat)           | Post alert message to HipChat room.                                                   |
| [Kafka](/kapacitor/v1.5/event_handlers/kafka)               | Send alert to a Apache Kafka cluster.                                                 |
| [log](/kapacitor/v1.5/event_handlers/log)                   | Log alert data to file.                                                               |
| [MQTT](/kapacitor/v1.5/event_handlers/mqtt)                 | Post alert message to MQTT.                                                           |
| [OpsGenie v1](/kapacitor/v1.5/event_handlers/opsgenie/v1)   | Send alert to OpsGenie using their v1 API. <em style="opacity: .5">(Deprecated)</em>  |
| [OpsGenie v2](/kapacitor/v1.5/event_handlers/opsgenie/v2)   | Send alert to OpsGenie using their v2 API.                                            |
| [PagerDuty v1](/kapacitor/v1.5/event_handlers/pagerduty/v1) | Send alert to PagerDuty using their v1 API. <em style="opacity: .5">(Deprecated)</em> |
| [PagerDuty v2](/kapacitor/v1.5/event_handlers/pagerduty/v2) | Send alert to PagerDuty using their v2 API.                                           |
| [post](/kapacitor/v1.5/event_handlers/post)                 | HTTP POST data to a specified URL.                                                    |
| [Pushover](/kapacitor/v1.5/event_handlers/pushover)         | Send alert to Pushover.                                                               |
| [Sensu](/kapacitor/v1.5/event_handlers/sensu)               | Post alert message to Sensu client.                                                   |
| [Slack](/kapacitor/v1.5/event_handlers/slack)               | Post alert message to Slack channel.                                                  |
| [SNMPTrap](/kapacitor/v1.5/event_handlers/snmptrap)         | Trigger SNMP traps.                                                                   |
| [Talk](/kapacitor/v1.5/event_handlers/talk)                 | Post alert message to Talk client.                                                    |
| [tcp](/kapacitor/v1.5/event_handlers/tcp)                   | Send data to a specified address via raw TCP.                                         |
| [Telegram](/kapacitor/v1.5/event_handlers/telegram)         | Post alert message to Telegram client.                                                |
| [VictorOps](/kapacitor/v1.5/event_handlers/victorops)       | Send alert to VictorOps.                                                              |


## Match expressions

Alert handlers support match expressions that filter which alert events the handler processes.

A match expression is a TICKscript lambda expression.
The data that triggered the alert is available to the match expression, including all fields and tags.

In addition to the data that triggered the alert metadata about the alert is available.
This alert metadata is available via various functions.

| Name     | Type     | Description                                                                                                                |
| ----     | ----     | -----------                                                                                                                |
| level    | int      | The alert level of the event, one of '0', '1', '2', or '3' corresponding to 'OK', 'INFO', 'WARNING', and 'CRITICAL'.       |
| changed  | bool     | Indicates whether the alert level changed with this event.                                                                 |
| name     | string   | Returns the measurement name of the triggering data.                                                                       |
| taskName | string   | Returns the task name that generated the alert event.                                                                      |
| duration | duration | Returns the duration of the event in a non  OK state.                                                                      |


Additionally the vars `OK`, `INFO`, `WARNING`, and `CRITICAL` have been defined to correspond with the return value of the `level` function.

For example to send only critical alerts to a handler, use this match expression:

```yaml
match: level() == CRITICAL
```


### Examples

Send only changed events to the handler:

```yaml
match: changed() == TRUE
```


Send only WARNING and CRITICAL events to the handler:

```yaml
match: level() >= WARNING
```

Send events with the tag "host" equal to `s001.example.com` to the handler:

```yaml
match: "host" == 's001.example.com'
```

#### Alert event data

Each alert event that gets sent to a handler contains the following alert data:

| Name            | Description                                                                                                                                      |
| ----            | -----------                                                                                                                                      |
| **ID**          | The ID of the alert, user defined.                                                                                                               |
| **Message**     | The alert message, user defined.                                                                                                                 |
| **Details**     | The alert details, user defined HTML content.                                                                                                    |
| **Time**        | The time the alert occurred.                                                                                                                     |
| **Duration**    | The duration of the alert in nanoseconds.                                                                                                        |
| **Level**       | One of OK, INFO, WARNING or CRITICAL.                                                                                                            |
| **Data**        | influxql.Result containing the data that triggered the alert.                                                                                    |
| **Recoverable** | Indicates whether the alert is auto-recoverable. Determined by the [`.noRecoveries()`](/kapacitor/v1.5/nodes/alert_node/#norecoveries) property. |

This data is used by [event handlers](/kapacitor/v1.5/event_handlers) in their
handling of alert events.

Alert messages use [Golang Template](https://golang.org/pkg/text/template/) and
have access to the alert data.

```js
|alert()
  // ...
  .message('{{ .ID }} is {{ .Level }} value:{{ index .Fields "value" }}, {{ if not .Recoverable }}non-recoverable{{ end }}')
```
