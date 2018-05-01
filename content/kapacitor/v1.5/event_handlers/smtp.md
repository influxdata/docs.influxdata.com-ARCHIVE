---
title: SMTP Event Handler

menu:
  kapacitor_1_5:
    name: SMTP
    weight: 14
    parent: event-handlers
---

The SMTP event handler sends alert messages via email.

## Configuration
Configuration as well as default [option](#options) values for the SMTP event handler are set in your `kapacitor.conf`.
Below is an example config:

```toml
[smtp]
  enabled = true
  host = "localhost"
  port = 25
  username = "username"
  password = "passw0rd"
  from = "me@example.com"
  to = ["me@example.com", "you@example.com"]
  no-verify = false
  idle-timeout = "30s"
  global = false
  state-changes-only = false
```

#### `enabled`
Set to `true` to enable the SMTP event handler.

#### `host`
The SMTP host.

#### `port`
The SMTP port.

#### `username`
Your SMTP username.

#### `password`
Your SMTP password.

#### `from`
The "From" address for outgoing mail.

#### `to`
List of default "To" addresses.

#### `no-verify`
Skip TLS certificate verification when connecting to the SMTP server.

#### `idle-timeout`
The time after which idle connections are closed.

#### `global`
If `true`, all alerts will be sent via Email without explicitly specifying the SMTP handler in the TICKscript.

#### `state-changes-only`
Sets all alerts in state-changes-only mode, meaning alerts will only be sent if the alert state changes.
Only applies if `global` is `true`.


## Options
The following SMTP/Email event handler options can be set in a [handler file](/kapacitor/v1.5/event_handlers/#handler-file) or when using `.email()` in a TICKscript.

| Name | Type            | Description              |
| ---- | ----            | -----------              |
| to   | list of strings | List of email addresses. |

### Example Handler File
```yaml
id: handler-id
topic: topic-name
kind: email
options:
  to:
    - oncall1@example.com
    - oncall2@example.com
```

### Example TICKscript
```js
|alert()
  // ...
  .email()
    .to('oncall1@example.com', 'oncall2@example.com')
```

### Using the SMTP/Email event handler
The SMTP/Email event handler can be used in both TICKscripts and handler files to email alerts. The email subject is the [AlertNode.Message](/kapacitor/v1.5/nodes/alert_node/#message) property. The email body is the [AlertNode.Details](/kapacitor/v1.5/nodes/alert_node/#details) property. The emails are sent as HTML emails so the body can contain html markup.

_**SMTP settings in kapacitor.conf**_  
```toml
[smtp]
  enabled = true
  host = "smtp.myserver.com"
  port = 25
  username = "username"
  password = "passw0rd"
  from = "me@emyserver.com"
  to = "oncall0@mydomain.com"
  no-verify = false
  idle-timeout = "30s"
  global = false
  state-changes-only = false
```

### Email alerts from a TICKscript
The following TICKscript uses the `.email()` event handler to send out emails whenever idle CPU usage drops below 10%.

_**email-cpu-alert.tick**_  
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: 'usage_idle' < 10)
    .message('Hey, check your CPU')
    .email()
      .to('oncall1@mydomain.com', 'oncall2@mydomain.com')
```

### Email alerts from a defined handler
The following setup sends an alert to the `cpu` topic with the message, "Hey, check your CPU". An emai handler is added that subscribes to the `cpu` topic and emails all alerts.

Create a TICKscript that publishes alert messages to a topic.
The TICKscript below sends an alert message to the `cpu` topic any time idle CPU usage drops below 10%.

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

Create a handler file that subscribes to the `cpu` topic and uses the `.email()` event handler to email alerts.

_**email\_cpu\_handler.yaml**_
```yaml
topic: cpu
id: email-cpu-alert
kind: email
options:
  to:
    - oncall1@mydomain.com
    - oncall2@mydomain.com
```

Add the handler:

```bash
kapacitor define-topic-handler email_cpu_handler.yaml
```
