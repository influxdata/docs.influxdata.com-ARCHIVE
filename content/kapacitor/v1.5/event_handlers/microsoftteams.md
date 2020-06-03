---
title: Microsoft Teams event handler
description: The Microsoft Teams event handler lets you send Kapacitor alerts to a Microsoft Teams channel. This page includes configuration options and usage examples.
menu:
  kapacitor_1_5:
    name: Microsoft Teams
    weight: 1500
    parent: event-handlers
---

[Microsoft Teams](https://www.microsoft.com/en-us/microsoft-365/microsoft-teams/group-chat-software) is a widely used "digital workspace" that facilitates communication among team members. Complete the following steps to configure Kapacitor to send alert messages to one or more Microsoft Teams channels:

## Configure Teams

1. Open your `kapacitor.conf` fileSet configuration options (and see default [option](#options) values) for the Microsoft Teams event
handler in your `kapacitor.conf` file. Below is an example configuration:

```toml
[[teams]]
  enabled = true
  channelurl =  "https://outlook.office.com/webhook/..."
  global = true
  state-changes-only = true
```

> Multiple Microsoft Team clients may be configured by repeating `[teams]` sections.
The `channelurl` acts as a unique identifier for each configured Teams client.

#### `enabled`

Set to `true` to enable the Microsoft Teams event handler.

#### `channelurl`

Specify the Microsoft Team webhook URL to send messages and alerts.

#### `global`

Set to true to send all alerts to Teams without explicitly specifying Microsoft Teams in the TICKscript.

#### `state-changes-only`

Sets to true to send alerts for state-changes-only.
_Only applies if `global` is `true`._

## Options

The following Microsoft Teams event handler options can be set in a
[handler file](/kapacitor/v1.5/event_handlers/#handler-file) or when using
`.teams()` in a TICKscript.

| Name       | Type   | Description                                                                                                                   |
| ----       | ----   | -----------                                                                                                                   |
| team       | string | Specifies which Team configuration to use when there are multiple.                                                            |
| channel    | string | Teams channel to post messages to. If empty uses the channel from the configuration.                                          |
| username   | string | Username of the Slack bot. If empty uses the username from the configuration.                                                 |

## Send an alert to Teams

```js
Example:
|alert()
.teams()
 .channelURL('https://outlook.office.com/webhook/...')
```

### Example: handler file
```yaml
id: handler-id
topic: topic-name
kind: teams
options:
  team: 'teams.microsoft.com/team/'
  channel: '#alerts'
  username: 'kapacitor'
```

### Example: TICKscript
```js
|alert()
  // ...
  .teams()
    .team('teams.microsoft.com/team/')
    .channel('#alerts')
    .username('kapacitor')
```

## Set up Teams

To allow Kapacitor to send alerts to Teams, complete the following steps:

1. Log in to Teams, and then [create a new incoming webhook](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/connectors#setting-up-a-custom-incoming-webhook) for a Teams channel.
2. Add the incoming webhook URL as the `url` in the `[teams]` configuration section of your `kapacitor.conf`.

## Use the Microsoft Teams event handler

With one or more Teams event handlers enabled and configured in your
`kapacitor.conf`, use the `.teams()` attribute in your TICKscripts to send
alerts to Teams or define a Teams handler that subscribes to a topic and sends
published alerts to Teams.

> To avoid posting a message every alert interval, use
> [AlertNode.StateChangesOnly](/kapacitor/v1.5/nodes/alert_node/#statechangesonly)
> so only events where the alert changed state are sent to Teams.

### Send alerts to Teams from a TICKscript

The following TICKscript uses the `.teams()` event handler to send the message,
"Hey, check your CPU", to the `#alerts` Teams channel when idle CPU usage drops below 20%.

_**teams-cpu-alert.tick**_  
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .warn(lambda: "usage_idle" < 20)
    .stateChangesOnly()
    .message('Hey, check your CPU')
    .teams()
```

### Send alerts to Teams from a defined handler

The following example sends an alert to the `cpu` topic with the message,
"Hey, check your CPU".
A Slack handler is added that subscribes to the `cpu` topic and publishes all
alert messages to Teams.

Create a TICKscript that publishes alert messages to a topic.
The TICKscript below sends an critical alert message to the `cpu` topic any time
idle CPU usage drops below 5%.

_**cpu\_alert.tick**_
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 5)
    .stateChangesOnly()
    .message('Hey, check your CPU')
    .topic('cpu')
```

Add and enable the TICKscript:

```bash
kapacitor define cpu_alert -tick cpu_alert.tick
kapacitor enable cpu_alert
```

Create a handler file that subscribes to the `cpu` topic and uses the Slack
event handler to send alerts to Slack. This handler using the non-default Slack
handler, "critical-alerts", which sends messages to the #critical-alerts channel
in Slack.

_**slack\_cpu\_handler.yaml**_
```yaml
id: slack-cpu-alert
topic: cpu
kind: slack
options:
  workspace: 'alerts'
  icon-emoji: ':fire:'
```

Add the handler:

```bash
kapacitor define-topic-handler slack_cpu_handler.yaml
```

### Use multiple Slack configurations

Kapacitor can use multiple Slack integrations, each identified by the value of
the [`workspace`](#workspace) config. The TICKscript below illustrates how
multiple Slack integrations can be used.

In the `kapacitor.conf` [above](#using-the-slack-event-handler), there are two
Slack configurations; one for alerts and the other for daily stats. The
`workspace` configuration for each Slack configuration act as a unique identifiers.

The following TICKscript sends alerts to the `alerts` Slack workspace.

_**slack-cpu-alert.tick**_  
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 5)
    .stateChangesOnly()
    .message('Hey, I think the machine is on fire.')
    .slack()
      .workspace('alerts')
      .iconEmoji(':fire:')
```

Error rates are also being stored in the same InfluxDB instance and we want to
send daily reports of `500` errors to the `error-reports` Slack workspace.
The following TICKscript collects `500` error occurances and publishes them to
the `500-errors` topic.

_**500_errors.tick**_
```js
stream
  |from()
    .measurement('errors')
    .groupBy('500')
  |alert()
    .info(lamda: 'count' > 0)
    .noRecoveries()
    .topic('500-errors')  
```

Below is an [aggregate](/kapacitor/v1.5/event_handlers/aggregate/) handler that
subscribes to the `500-errors` topic, aggregates the number of 500 errors over a
24 hour period, then publishes an aggregate message to the `500-errors-24h` topic.

_**500\_errors\_24h.yaml**_
```yaml
id: 500-errors-24h
topic: 500-errors
kind: aggregate
options:
  interval: 24h
  topic: 500-errors-24h
  message: '{{ .Count }} 500 errors last 24 hours.'
```

Last, but not least, a Slack handler that subscribes to the `500-errors-24h`
topic and publishes aggregated count messages to the `error-reports` Slack workspace:

_**slack\_500\_errors\_daily.yaml**_
```yaml
id: slack-500-errors-daily
topic: 500-errors-24h
kind: slack
options:
  workspace: error-reports
```
