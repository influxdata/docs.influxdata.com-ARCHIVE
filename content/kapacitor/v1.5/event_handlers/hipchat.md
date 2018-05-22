---
title: HipChat event handler
description: The HipChat event handler allows you to send Kapacitor alerts to HipChat. This page includes configuration options and usage examples.
menu:
  kapacitor_1_5:
    name: HipChat
    weight: 500
    parent: event-handlers
---

[HipChat](https://www.hipchat.com/) is Atlassian's web service for group chat,
video chat, and screen sharing.
Kapacitor can be configured to send alert messages to a HipChat room.

## Configuration
Configuration as well as default [option](#options) values for the HipChat event
handler are set in your `kapacitor.conf`.
Below is an example config:

```toml
[hipchat]
  enabled = true
  url = "https://subdomain.hipchat.com/v2/room"
  room = "xxxx"
  token = "xxxx"
  global = false
  state-changes-only = false
```

#### `enabled`
Set to `true` to enable HipChat event handler.

#### `url`
The HipChat API URL. Replace subdomain with your HipChat subdomain.

#### `room`
Default room for messages.
This serves as the default room ID if the TICKscript does not specify a room ID.
_Visit the [HipChat API documentation](https://www.hipchat.com/docs/apiv2) for
information on obtain your room ID._

#### `token`
Default authentication token.
This serves as the default token if the TICKscript does not specify an API
access token.
_Visit the [HipChat API documentation](https://www.hipchat.com/docs/apiv2) for
information on obtain your authentication token._

#### `global`
If `true`, all alerts are sent to HipChat without explicitly specifying HipChat
in the TICKscript.

#### `state-changes-only`
If `true`, alerts will only be sent to HipChat if the alert state changes.
This only applies if the `global` is also set to `true`.

## Options
The following HipChat event handler options can be set in a
[handler file](/kapacitor/v1.5/event_handlers/#handler-file) or when using
`.hipchat()` in a TICKscript.

| Name  | Type   | Description                                                                               |
| ----  | ----   | -----------                                                                               |
| room  | string | HipChat room in which to post messages. If empty uses the channel from the configuration. |
| token | string | HipChat authentication token. If empty uses the token from the configuration.             |

### Example: handler file
```yaml
topic: topic-name
id: handler-id
kind: hipchat
options:
  room: 'alerts'
  token: 'mysupersecretauthtoken'
```

### Example: TICKscript
```js
|alert()
  // ...
  .hipChat()
    .room('alerts')
    .token('mysupersecretauthtoken')
```


## HipChat Setup

### Requirements

To configure Kapacitor with HipChat, the following is needed:

* A HipChat subdomain name
* A HipChat room ID
* A HipChat API access token for sending notifications

### Get your HipChat API access token

1. Log into your HipChat account dashboard.
2. Select "API access" in the left menu.
3. Under "Create new token", enter a label for the token.
   The label is arbitrary and is meant only to help identify the token.
4. Under "Create new token", select "Send Notification" as the Scope.
5. Click "Create".

Your token appears in the table just above the `Create new token` section:

![HipChat token](/img/kapacitor/hipchat-token.png)


##  Using the HipChat Event Handler
With the HipChat event handler enabled in your `kapacitor.conf`, use the
`.hipchat()` attribute in your TICKscripts to send alerts to HipChat or define a
HipChat handler that subscribes to a topic and sends published alerts to HipChat.

> To avoid posting a message every alert interval, use
> [AlertNode.StateChangesOnly](/kapacitor/v1.5/nodes/alert_node/#statechangesonly)
> so only events where the alert changed state are sent to Alerta.

The examples below use the following HipChat configuration defined in the `kapacitor.conf`:

_**HipChat settings in kapacitor.conf**_  
```toml
[hipchat]
  enabled = true
  url = "https://testtest.hipchat.com/v2/room"
  room = "malerts"
  token = "tokentokentokentokentoken"
  global = false
  state-changes-only = true
```

### Send alerts to a HipChat room from a TICKscript

The following TICKscript uses the `.hipchat()` event handler to send the message,
"Hey, check your CPU", whenever idle CPU usage drops below 10%.
It publishes the messages to the `alerts` room associated with the HipChat
subdomain defined in the `kapacitor.conf`.

_**hipchat-cpu-alert.tick**_  
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 10)
    .stateChangesOnly()
    .message('Hey, check your CPU')
    .hipchat()
      .room('alerts')
```

### Send alerts to the HipChat room from a defined handler

The following setup sends an alert to the `cpu` topic with the message, "Hey,
check your CPU".
A HipChat handler is added that subscribes to the `cpu` topic and publishes all
alert messages to the `alerts` room associated with the `testest` HipChat
subdomain defined in the `kapacitor.conf`.

Create a TICKscript that publishes alert messages to a topic.
The TICKscript below sends an alert message to the `cpu` topic any time CPU
idle usage drops below 10% _(or CPU usage is above 90%)_.

_**cpu\_alert.tick**_
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 10)
    .stateChangesOnly()
    .message('Hey, check your CPU')
    .topic('cpu')
```

Add and enable the TICKscript:

```bash
kapacitor define cpu_alert -tick cpu_alert.tick
kapacitor enable cpu_alert
```

Create a handler file that subscribes to the `cpu` topic and uses the HipChat
event handler to send alerts to the `alerts` channel in HipChat.

_**hipchat\_cpu\_handler.yaml**_
```yaml
id: hipchat-cpu-alert
topic: cpu
kind: hipchat
options:
  room: 'alerts'
```

Add the handler:

```bash
kapacitor define-topic-handler hipchat_cpu_handler.yaml
```
