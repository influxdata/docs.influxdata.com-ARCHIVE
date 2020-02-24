---
title: Discord event handler
description: The Discord event handler lets you send Kapacitor alerts to Discord. This page includes configuration options and usage examples.
menu:
  kapacitor_1_5:
    name: Discord
    weight: 250
    parent: event-handlers
---

[Discord](https://discordapp.com) is a popular chat service targeted primarily at gamers and by teams outside of gaming looking for a free solution.
To configure Kapacitor to send alert messages to Discord, set the applicable configuration options.

## Configuration
Configuration as well as default [option](#options) values for the Discord event
handler are set in your `kapacitor.conf`.
Below is an example configuration:

```toml
[[discord]]
  enabled = false
  default = true
  url = "https://discordapp.com/api/webhooks/xxxxxxxxxxxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  workspace = "guild-channel"
  timestamp = true
  username = "Kapacitor"
  avatar-url = "https://influxdata.github.io/branding/img/downloads/influxdata-logo--symbol--pool-alpha.png"
  embed-title = "Kapacitor Alert"
  global = false
  state-changes-only = false
  ssl-ca = "/path/to/ca.crt"
  ssl-cert = "/path/to/cert.crt"
  ssl-key = "/path/to/private-key.key"
  insecure-skip-verify = false
```

> Multiple Discord clients may be configured by repeating `[[discord]]` sections.
The `workspace` acts as a unique identifier for each configured Discord client.

#### `enabled`
Set to `true` to enable the Discord event handler.

#### `default`
If multiple Discord client configurations are specified, identify one configuration as the default.

#### `workspace`
The Discord workspace ID.
Set this string to identify this particular Discord configuration.
For example, the name of the Discord channel and the guild it's a part 
of, such as `<guild>-<channel>`.

#### `timestamp`
Boolean signifying whether the timestamp should be shown in the embed.

#### `url`
The Discord webhook URL. This can be obtained by adding a webhook in the channel settings - see [Intro to Webhooks](https://support.discordapp.com/hc/en-us/articles/228383668) for a full guide.
Discord will provide you with the webhook URL.

#### `username`
Set the Discord bot username to override the username set when generating the webhook.

#### `avatar-url`
Set a URL to a specified avatar to override the avatar set when generating the webhook.

#### `embed-title`
Set the title to display in the alert embed. If blank, no title will is set.

#### `global`
Set to `true` to send all alerts to Discord without explicitly specifying Discord in the TICKscript.

#### `state-changes-only`
Sets all alerts in state-changes-only mode, meaning alerts will only be sent if
the alert state changes.
_Only applies if `global` is `true`._

#### `ssl-ca`
Set path to certificate authority file.

#### `ssl-cert`
Set path to host certificate file.

#### `ssl-key`
Set path to certificate private key file.

#### `insecure-skip-verify`
Set to `true` to use SSL but skip chain and host verification.
_This is necessary if using a self-signed certificate._

## Options
Set the following Discord event handler options in a
[handler file](/kapacitor/v1.5/event_handlers/#handler-file) or when using
`.discord()` in a TICKscript.

| Name        | Type   | Description                                                                                                                    |
| ----        | ----   | -----------                                                                                                                    |
| workspace   | string | Specifies which Discord configuration to use when there are multiple.                                                          |
| timestamp   | bool   | Specifies whether to show the timestamp in the embed footer. If blank uses the choice from the configuration.                  |
| username    | string | Username of the Discord bot. If empty uses the username from the configuration.                                                |
| avatar-url  | string | URL of image to use as the webhook's avatar. If empty uses the url from the configuration.                                     |
| embed-title | string | Title of alert embed posted to the webhook. If empty uses the title set in the configuration.                                  |

### Example: handler file
```yaml
id: handler-id
topic: topic-name
kind: discord
options:
  workspace: 'guild-channel'
  username: 'Kapacitor'
  avatar-url: 'https://influxdata.github.io/branding/img/downloads/influxdata-logo--symbol--pool-alpha.png'
  timestamp: true
  embed-title: 'Kapacitor Alert'
```

### Example: TICKscript
```js
|alert()
  // ...
  .discord()
    .workspace('guild-channel')
    .username('Kapacitor')
    .avatarUrl('https://influxdata.github.io/branding/img/downloads/influxdata-logo--symbol--pool-alpha.png')
    .timestamp(true)
    .embedTitle('Kapacitor Alert')
```

## Set up Guild
To allow Kapacitor to send alerts to Discord, obtain a webhook url from Discord - see [Intro to Webhooks](https://support.discordapp.com/hc/en-us/articles/228383668)
Then, add the generated webhook URL as the `url` in the `[[discord]]` configuration section of
your `kapacitor.conf`.

## Using the Discord event handler
With one or more Discord event handlers enabled and configured in your
`kapacitor.conf`, use the `.discord()` attribute in your TICKscripts to send
alerts to Discord or define a Discord handler that subscribes to a topic and sends
published alerts to Discord.

> To avoid posting a message every alert interval, use
> [AlertNode.StateChangesOnly](/kapacitor/v1.5/nodes/alert_node/#statechangesonly)
> so only events where the alert changed state are sent to Discord.

See examples below for sample Discord configurations defined the `kapacitor.conf`:

_**Discord settings in kapacitor.conf**_
```toml
[[discord]]
  enabled = true
  default = true
  url = "https://discordapp.com/api/webhooks/xxxxxxxxxxxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  workspace = "guild-alerts"
  timestamp = true
  username = "AlertBot"
  avatar-url = "https://influxdata.github.io/branding/img/downloads/influxdata-logo--symbol--pool-alpha.png"
  embed-title = "Alert"
  global = false
  state-changes-only = false

[[discord]]
  enabled = true
  default = false
  url = "https://discordapp.com/api/webhooks/xxxxxxxxxxxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  workspace = "guild-errors"
  timestamp = true
  username = "StatsBot"
  avatar-url = "https://influxdata.github.io/branding/img/downloads/influxdata-logo--symbol--pool-alpha.png"
  embed-title = "Errors"
  global = false
  state-changes-only = false
```

### Send alerts to Discord from a TICKscript
Use the `.discord()` event handler in your TICKscript to send an alert.
For example, this configuration will send an alert with the message
"Hey, check your CPU", to the Discord channel whenever idle CPU usage
drops below 20%.

_**discord-cpu-alert.tick**_  
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .warn(lambda: "usage_idle" < 20)
    .stateChangesOnly()
    .message('Hey, check your CPU')
    .discord()   
      .embedTitle('Uh Oh!')  
```

### Send alerts to Discord from a defined handler

Add a Discord handler that subscribes to the `cpu` by creating a TICKscript that publishes alert messages to a topic.
For example, this configuration will send an alert with the message "Hey, check your CPU".
A Discord handler is added that subscribes to the `cpu` topic and publishes all
alert messages to Discord.

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

Create a handler file that subscribes to the `cpu` topic and uses the Discord
event handler to send alerts to Discord. This handler is using the non-default Discord
handler, "critical-alerts", which sends messages to the #critical-alerts channel
in Discord.

_**discord\_cpu\_handler.yaml**_
```yaml
id: discord-cpu-alert
topic: cpu
kind: discord
options:
  workspace: 'guild-alerts'
  embed-title: 'Hey, Listen!'
```

Add the handler:

```bash
kapacitor define-topic-handler discord_cpu_handler.yaml
```

### Using multiple Discord configurations
Kapacitor can use multiple Discord integrations, each identified by the value of
the [`workspace`](#workspace) config. The TICKscript below illustrates how
multiple Discord integrations can be used.

In the `kapacitor.conf` [above](#using-the-discord-event-handler), there are two
Discord configurations; one for alerts and the other for daily stats. The
`workspace` configuration for each Discord configuration act as a unique identifiers.

The following TICKscript sends alerts to the `alerts` Discord workspace.

_**discord-cpu-alert.tick**_  
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 5)
    .stateChangesOnly()
    .message('Hey, I think the machine is on fire.')
    .discord()
      .workspace('alerts')
      .embedTitle('AAAAAAAAAAAAAAAAAAAAAA')
```

Error rates are also stored in the same InfluxDB instance and we want to
send daily reports of `500` errors to the `error-reports` Discord workspace.
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

Last, but not least, a Discord handler that subscribes to the `500-errors-24h`
topic and publishes aggregated count messages to the `error-reports` Discord workspace:

_**discord\_500\_errors\_daily.yaml**_
```yaml
id: discord-500-errors-daily
topic: 500-errors-24h
kind: discord
options:
  workspace: guild-errors
```
