---
title: Kapacitor alerts overview

menu:
  kapacitor_1_4:
    name: Alerts overview
    weight: 30
    parent: Working with Kapacitor
---

Kapacitor makes it possible to handle alert messages in two different ways.

* The messages can be pushed directly to an event handler exposed through the
[Alert](/kapacitor/v1.4/nodes/alert_node/) node.
* The messages can be published to a topic namespace to which one or more alert
handlers can subscribe.

<!--
In addition to defining alert handler in TICKscript Kapacitor supports an alert system that follows a publish subscribe design pattern.
Alerts are published to a `topic` and `handlers` subscribe to a topic.
-->

No matter which approach is used, the handlers need to be enabled and configured
in the [configuration](/kapacitor/v1.4/administration/configuration/#optional-table-groupings)
file.  If the handler requires sensitive information such as tokens and
passwords, it can also be configured using the [Kapacitor HTTP API](/kapacitor/v1.4/working/api/#overriding-configurations).

## Push to handler

Pushing messages to a handler is the basic approach presented in the
[Getting started with Kapacitor](/kapacitor/v1.4/introduction/getting-started/#triggering-alerts-from-stream-data)
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

<!-- fixes defect 1003 -->

* `topic`: declares the topic to which the handler will subscribe.
* `id`: declares the identity of the binding.
* `kind`: declares the type of event handler to be used.  Note that this
needs to be enabled in the `kapacitord` configuration.
* `match`: (optional) declares a match expression used to filter which
alert events will be processed. See the section [Match Expressions](#match-expressions)
below.
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
[Create a Handler](/kapacitor/v1.4/working/api/#creating-handlers) section of
the HTTP API document.

For a walk through on defining and using alert topics see the
[Using Alert Topics](/kapacitor/v1.4/working/using_alert_topics) walk-through.

## Handlers

A handler takes action on incoming alert events for a specific topic.
Each handler operates on exactly one topic.

<!--
A handler definition has a few properties:

* ID - The unique ID of the handler.
* Kind - The kind of handler, see [handlers](./handlers) for a list of available kinds.
* Match - A lambda expression to filter matching alerts. By default all alerts match, see [matching](./match) for details on the match expression.
* Options - A map of values, differs by kind.
-->

### List of Handlers

The following is a list of available alert handlers and their options.

#### Aggregate

Aggreate multiple events into a single event.

Options:

| Name     | Type            | Description                                                                                                     |
| ----     | ----            | -----------                                                                                                     |
| interval | duration string | How often to aggregate events.                                                                                  |
| topic    | string          | A topic into which to publish the aggregate events.                                                             |
| message  | string          | A template string where `{{.Interval}}` and `{{.Count}}` are available for constructing a meaning full message. |

Example:

```yaml
kind: aggregate
options:
    interval: 5m
    topic: agg_5m
```

Send aggregate events of the past `5m` to the `agg_5m` topic.
Further handling of the aggregated events can be configured on the `agg_5m` topic.

#### Alerta

Send alert events to an Alerta instance.

Options:

| Name         | Type           | Description                                                                                                                                    |
| ----         | ----           | -----------                                                                                                                                    |
| token        | string         | Alerta authentication token. If empty uses the token from the configuration.                                                                   |
| token-prefix | string         | Alerta authentication token prefix. If empty uses Bearer.                                                                                      |
| resource     | string         | Alerta resource. Can be a template and has access to the same data as the AlertNode.Details property. Default: {{ .Name }}                     |
| event        | string         | Alerta event. Can be a template and has access to the same data as the idInfo property. Default: {{ .ID }}.                                    |
| environment  | string         | Alerta environment. Can be a template and has access to the same data as the AlertNode.Details property. Defaut is set from the configuration. |
| group        | string         | Alerta group. Can be a template and has access to the same data as the AlertNode.Details property. Default: {{ .Group }}.                      |
| value        | string         | Alerta value. Can be a template and has access to the same data as the AlertNode.Details property. Default is an empty string.                 |
| origin       | string         | Alerta origin.   If empty uses the origin from the configuration.                                                                              |
| service      | list of string | List of effected Services.                                                                                                                     |

Example:

```yaml
kind: alerta
options:
    resource: system
```

#### Exec

Execute an external program, the alert data is passed over STDIN to the process.

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

#### Log

Log alert events to a file.

Options:

| Name | Type   | Description                              |
| ---- | ----   | -----------                              |
| path | string | Path to the log file.                    |
| mode | int    | File mode to use when creating the file. |

Example:

```yaml
kind: log
options:
    path: '/tmp/alerts.log'
```

#### Opsgenie

Send alert events to OpsGenie.

Options:

| Name            | Type                | Description    |
| ----            | ----                | -----------    |
| teams-list      | list of string      | List of teams. |
| recipients-list | List of recipients. |

Example:

```yaml
kind: opsgenie
options:
    teams:
        - rocket
```

#### Pagerduty

Send alert events to PagerDuty.

Options:

| Name        | Type   | Description      |
| ----        | ----   | -----------      |
| service-key | string | The service key. |

Example:

```yaml
kind: pageduty
```

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

#### Post

Post JSON encoded alert data to an HTTP endpoint.

Options:

| Name     | Type                    | Description                                                                          |
| ----     | ----                    | -----------                                                                          |
| url      | string                  | The URL to which the alert data will be posted.                                      |
| endpoint | string                  | Name of a configured httppost endpoint, cannot be specified in conjunciton with URL. |
| headers  | map of string to string | Set of extra header values to set on the POST request.                               |

Example:

```yaml
kind: post
options:
    url: http://example.com
```

#### Publish

Publish events to another topic.

Options:

| Name   | Type           | Description                            |
| ----   | ----           | -----------                            |
| topics | list of string | List of topic names to publish events. |

Example:

```yaml
kind: publish
options:
    topics:
        - system
        - ops_team
```


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

#### SMTP

Send alert events via email.

Options:

| Name | Type           | Description              |
| ---- | ----           | -----------              |
| to   | list of string | List of email addresses. |

Example:

```yaml
kind: smtp
options:
    to:
        - oncall1@example.com
        - oncall2@example.com
```

#### Snmptrap

Trigger SNMP traps for alert events.

Options:

| Name      | Type   | Description                                                                     |
| ----      | ----   | -----------                                                                     |
| trap-oid  | string | OID of the trap.                                                                |
| data-list | object | Each data object has `oid`, `type`, and `value` fields. Each field is a string. |

Example:

```yaml
kind: snmptrap
options:
    trap-oid: '1.1.1.1'
    data-list:
        oid: '1.3.6.1.2.1.1.7'
        type: i
        value: '{{ index .Field "value" }}'
```

#### Talk

Send alert events to a Talk instance.
No options are available.
See the Talk service configuration.

Example:

```yaml
kind: talk
```

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

#### Victorops

Send alert events to a VictorOps instance.

Options:

| Name        | Type   | Description                         |
| ----        | ----   | -----------                         |
| routing-key | string | The routing key of the alert event. |

Example:

```yaml
kind: victorops
options:
    routing-key: ops_team
```

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
