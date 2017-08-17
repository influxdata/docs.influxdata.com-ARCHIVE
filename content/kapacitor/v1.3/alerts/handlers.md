---
title: Alert Handlers

menu:
  kapacitor_1_3:
    name: Alert Handlers
    identifier: handlers
    weight: 10
    parent: alerts
---

The following is a list of available alert handlers and their options.

## Aggregate

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

## Alerta

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

## Exec

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

## Hipchat

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

## Log

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

## Opsgenie

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

## Pagerduty

Send alert events to PagerDuty.

Options:

| Name        | Type   | Description      |
| ----        | ----   | -----------      |
| service-key | string | The service key. |

Example:

```yaml
kind: pageduty
```

## Pushover

Send alert events to Pushover.

Options:

| Name      | Type   | Description                                                                                                           |
| ----      | ----   | -----------                                                                                                           |
| device    | string | Specific list of user'devices rather than all of a user's devices (multiple device names may be separated by a comma) |
| title     | string | Your message's title, otherwise your apps name is used.                                                               |
| url       | string | A supplementary URL to show with your message.                                                                        |
| url-title | string | A title for your supplementary URL, otherwise just URL is shown.                                                      |
| sound     | string | The name of one of the sounds supported by the device clients to override the user's default sound choice.            |


Example:

```yaml
kind: pushover
options:
    title: Alert from Kapacitor
```

## Post

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

## Publish

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


## Sensu

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

## Slack

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

## SMTP

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

## Snmptrap

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

## Talk

Send alert events to a Talk instance.
No options are available.
See the Talk service configuration.

Example:

```yaml
kind: talk
```

## TCP

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

## Telegram

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

## VictorOps

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
