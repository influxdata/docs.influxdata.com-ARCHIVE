---
title: Slack Event Handler

menu:
  kapacitor_1_5:
    name: Slack
    weight: 13
    parent: event-handlers
---

[Slack](https://slack.com) is a widely used "digital workspace" that facilitates communication among team members.
Kapacitor can be configured to send alert messages to Slack.

## Configuration
Configuration as well as default [option](#options) values for the Slack event handler are set in your `kapacitor.conf`.
Below is an example config:

```toml
[[slack]]
  enabled = true
  default = true
  workspace = "example.slack.com"
  url = "http://example.com"
  channel = "#alerts"
  username = "kapacitor"
  global = false
  state-changes-only = false
  ssl-ca = "/path/to/ca.crt"
  ssl-cert = "/path/to/cert.crt"
  ssl-key = "/path/to/private-key.key"
  insecure-skip-verify = false
```

> Multiple Slack clients may be configured by repeating `[[slack]]` sections.
The `workspace` acts as a unique identifier for each configured Slack client.

#### `enabled`
Set to `true` to enable the Slack event handler.

#### `default`
Identify one of the Slack configurations as the default if there are multiple Slack configurations.

#### `workspace`
The Slack workspace ID.
This can be any string that identifies this particular Slack configuration.
A logical choice is the name of the Slack workspace, e.g. `<workspace>.slack.com`.

#### `url`
The Slack webhook URL. This can be obtained by adding an Incoming Webhook integration.
Visit https://slack.com/services/new/incoming-webhook to add new webhook for Kapacitor.

#### `channel`
Default channel for messages

#### `username`
The username of the Slack bot.

#### `global`
If true all the alerts will be sent to Slack without explicitly specifying Slack in the TICKscript.

#### `state-changes-only`
Sets all alerts in state-changes-only mode, meaning alerts will only be sent if the alert state changes.
_Only applies if `global` is `true`._

#### `ssl-ca`
Path to certificate authority file.

#### `ssl-cert`
Path to host certificate file.

#### `ssl-key`
Path to certificate private key file.

#### `insecure-skip-verify`
Use SSL but skip chain and host verification. _This is necessary if using a self-signed certificate._

## Options
The following Slack event handler options can be set in a [handler file](/kapacitor/v1.5/event_handlers/#handler-file) or when using `.slack()` in a TICKscript.

| Name       | Type   | Description                                                                                                                   |
| ----       | ----   | -----------                                                                                                                   |
| workspace  | string | Specifies which Slack configuration to use when there are multiple.                                                           |
| channel    | string | Slack channel in which to post messages. If empty uses the channel from the configuration.                                    |
| username   | string | Username of the Slack bot. If empty uses the username from the configuration.                                                 |
| icon-emoji | string | IconEmoji is an emoji name surrounded in ':' characters. The emoji image will replace the normal user icon for the slack bot. |

### Example Handler File
```yaml
id: handler-id
topic: topic-name
kind: slack
options:
  workspace: 'workspace.slack.com'
  channel: '#alerts'
  username: 'kapacitor'
  icon-emoji: ':smile:'
```

### Example TICKscript
```js
|alert()
  // ...
  .slack()
    .workspace('workspace.slack.com')
    .channel('#alerts')
    .username('kapacitor')
    .iconEmoji(':smile:')
```

## Using the Slack event handler
With one or more Slack event handlers enabled and configured in your `kapacitor.conf`, use the `.slack()` attribute in your TICKscripts to send alerts to Slack or define a Slack handler that subscribes to a topic and sends published alerts to Slack.

The examples below use the following Slack configurations defined in the `kapacitor.conf`:

_**Slack settings in kapacitor.conf**_
```toml
[[slack]]
  enabled = true
  default = true
  workspace = "alerts"
  url = "http://example.com"
  channel = "#alerts"
  username = "AlertBot"
  global = false
  state-changes-only = false

[[slack]]
  enabled = true
  default = false
  workspace = "critical-alerts"
  url = "http://example.com"
  channel = "#critical-alerts"
  username = "AlertBot"
  global = false
  state-changes-only = false
```

### Send alerts to Slack from a TICKscript
The following TICKscript uses the `.slack()` event handler to send the message, "Hey, check your CPU", to the `#alerts` Slack channel whenever idle CPU usage drops below 20%.

_**slack-cpu-alert.tick**_  
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .warn(lambda: "usage_idle" < 20)
    .message('Hey, check your CPU')
    .slack()   
      .iconEmoji(':exclamation:')  
```

### Send alerts to Slack from a defined handler

The following setup sends an alert to the `cpu` topic with the message, "Hey, check your CPU". A Slack handler is added that subscribes to the `cpu` topic and publishes all alert messages to Slack.

Create a TICKscript that publishes alert messages to a topic.
The TICKscript below sends an critical alert message to the `cpu` topic any time idle CPU usage drops below 10%.

_**cpu\_alert.tick**_
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 10)
    .message('Hey, check your CPU')
    .topic('cpu')
```

Add and enable the TICKscript:

```bash
kapacitor define cpu_alert -tick cpu_alert.tick
kapacitor enable cpu_alert
```

Create a handler file that subscribes to the `cpu` topic and uses the Slack event handler to send alerts to Slack. This handler using the non-default Slack handler, "critical-alerts", which sends messages to the #critical-alerts channel in Slack.

_**slack\_cpu\_handler.yaml**_
```yaml
topic: cpu
id: slack-cpu-alert
kind: slack
options:
  workspace: 'critical-alerts'
  icon-emoji: ':fire:'
```

Add the handler:

```bash
kapacitor define-topic-handler slack_cpu_handler.yaml
```

### Using multiple Slack configurations
Kapacitor can use multiple Slack integrations, each identified by the value of the [`workspace`](#workspace) config. The TICKscript below illustrates how multiple Slack integrations can be used.

There are two alert levels:

* Warning ([warn](/kapacitor/v1.5/nodes/alert_node/#warn)) - A warning message is sent when idle CPU usage is below 20%.
* Critical ([crit](/kapacitor/v1.5/nodes/alert_node/#crit)) - A critical message is sent when idle CPU usage is below 5%.

The `workspace` defined for each Slack handler determines the channel to which each alert message is sent.

_**slack-cpu-alert.tick**_  
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .warn(lambda: "usage_idle" < 20)
      .message('Hey, CPU usage is a little high.')
      .slack()
        .workspace('alerts')
        .iconEmoji(':exclamation:')
    .crit(lambda: "usage_idle" < 5)
      .message('Hey, I think the machine is on fire.')
      .slack()
        .workspace('critical-alerts')
        .iconEmoji(':fire:')
```
