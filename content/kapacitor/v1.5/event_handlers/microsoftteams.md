---
title: Microsoft Teams event handler
description: The Microsoft Teams event handler lets you send Kapacitor alerts to a Microsoft Teams channel. This page includes configuration options and usage examples.
menu:
  kapacitor_1_5:
    name: Microsoft Teams
    weight: 1500
    parent: event-handlers
---

[Microsoft Teams](https://www.microsoft.com/en-us/microsoft-365/microsoft-teams/group-chat-software) is a widely used "digital workspace" that facilitates communication among team members. To configure Kapacitor to send alerts to one or more Microsoft Teams channels, do the following:

- [Set up a Teams](#set-up-teams)
  - [Configuration](#configuration)
  - [Handler file options](#handler-file-options)
  - [Example Teams handler file](#example-teams-handler-file)
- [Example alerts](#example-alerts)
- [Send an alert to Teams](#send-an-alert-to-teams)

## Set up Teams

1. Log in to Teams, and then [create a new incoming webhook](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/connectors#setting-up-a-custom-incoming-webhook) for a Teams channel.
2. In your `kapacitor.conf` file, add a `[teams]` section with [configuration options](#Teams-configuration-options) for the Microsoft Teams event
handler, including the incoming webhook URL as the `channelurl`. For example:

```toml
[teams]
  enabled = true
  default = true
  channel-url =  "https://outlook.office.com/webhook/..."
  global = true
  state-changes-only = true
```

3. To add multiple Microsoft Teams clients, repeat steps 1-2 to obtain a new web hook and add another `[teams]` section in `kapacitor.conf`.
The `channelurl` acts as a unique identifier for each configured Teams client.

### Configuration

#### `enabled`

Set to `true` to enable the Microsoft Teams event handler.

#### `default`

If there are multiple `teams` configurations, identify one as the default.

#### `channelurl`

Specify the Microsoft Team webhook URL to send messages and alerts.

#### `global`

Set to true to send all alerts to Teams without explicitly specifying Microsoft Teams in the TICKscript.\

#### `state-changes-only`

Set to true to send alerts for state-changes-only.
_Only applies if `global` is `true`._

### Handler file options

The following options can be set in a Microsoft Teams event [handler file](/kapacitor/v1.5/event_handlers/#handler-file) or when using
`.teams()` in a TICKscript.

| Name       | Type   | Description                                                                               |
| ----       | ----   | -----------                                                                               |
| team       | string | Specifies which Team configuration to use when there are multiple configurations.         |
| channel    | string | Teams channel to post messages to. If empty uses the channel from the configuration.      |

### Example handler file

```yaml
id: handler-id
topic: topic-name
kind: teams
options:
  team: 'teams.microsoft.com/team/'
  channel: '#alerts'
```

For information about using handler files, see [Add and use event handlers](/kapacitor/v1.5/event_handlers/#create-a-topic-handler-with-a-handler-file).

## Example alerts

#### Send alert to Teams channel in configuration file

```js
  stream
    |alert()
       .teams()
```

#### Send alert to Teams channel with webhook (overrides configuration file)

```js
  stream
    |alert()
       .teams()
       .channelURL('https://outlook.office.com/webhook/...')
```

#### Send alerts to Teams from a TICKscript

Use the `.teams()` attribute in your TICKscripts to:

- Send alerts to Teams
- Define a Teams handler that subscribes to a topic and sends published alerts to Teams

> To avoid posting a message every alert interval, use
> [AlertNode.StateChangesOnly](/kapacitor/v1.5/nodes/alert_node/#statechangesonly)
> so only events where the alert changed state are sent to Teams.

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

#### Send alerts to Teams from a defined handler

The following example sends an alert to the `cpu` topic with the message,
"Hey, check your CPU".
A Teams handler is added that subscribes to the `cpu` topic and publishes all
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

Create a handler file that subscribes to the `cpu` topic and uses the Teams
event handler to send alerts to Teams. This handler uses a non-default Teams
handler, "critical-alerts", which sends messages to the #critical-alerts channel
in Teams.

_**teams\_cpu\_handler.yaml**_
```yaml
id: teams-cpu-alert
topic: cpu
kind: teams
channelurl: 'alerts'

```

Add the handler:

```bash
kapacitor define-topic-handler teams_cpu_handler.yaml
```
