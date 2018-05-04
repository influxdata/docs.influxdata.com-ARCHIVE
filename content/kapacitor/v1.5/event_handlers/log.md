---
title: Log event handler
description: The "log" event handler allows you to send Kapacitor alert messages to a log file. This doc includes options and usage examples.
menu:
  kapacitor_1_5:
    name: Log
    weight: 700
    parent: event-handlers
---

The log event handler writes to a specified log file with one alert event per line.
If the specified log file does not exist, it will be created.

## Options
The following log event handler options can be set in a
[handler file](/kapacitor/v1.5/event_handlers/#handler-file) or when using
`.log()` in a TICKscript.

| Name | Type   | Description                    |
| ---- | ----   | -----------                    |
| path | string | Absolute path to the log file. |
| mode | int    | File mode and permissions to use when creating the file. Default is `0600`. _**The leading 0 is required to interpret the value as an octal integer.**_ |

### Example: handler file
```yaml
id: handler-id
topic: topic-name
kind: log
options:
  path: '/tmp/alerts.log'
  mode: 0644
```

### Example: TICKscript
```js
|alert()
  // ...
  .log('/tmp/alerts.log')
    .mode(0644)
```

## Using the log event handler
The log event handler can be used in both TICKscripts and handler files to log
messages to a log file.

### Log messages from a TICKscript

The following TICKscript uses the `.log()` event handler to log a message to the
`/tmp/alerts.log` log file whenever idle CPU usage drops below 10%.

_**log-cpu-alert.tick**_  
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 10)
    .message('{{ .Time }}: CPU usage over 90%')
    .log('/tmp/alerts.log')
```

### Log messages from a defined handler

The following setup sends an alert to the `cpu` topic with the message,
"'{{ .Time }}: CPU usage over 90%'".
A log handler is added that subscribes to the `cpu` topic and logs messages to
`/tmp/alerts.log` whenever a new message is published.

Create a TICKscript that publishes alert messages to a topic.
The TICKscript below sends an alert message to the `cpu` topic any time idle CPU
usage drops below 10%.

_**cpu\_alert.tick**_
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 10)
    .message('{{ .Time }}: CPU usage over 90%')
    .topic('cpu')
```

Add and enable the TICKscript:

```bash
kapacitor define cpu_alert -tick cpu_alert.tick
kapacitor enable cpu_alert
```

Create a handler file that subscribes to the `cpu` topic and uses the log event
handler to log messages to the `/tmp/alerts.log` log file.

_**log\_cpu\_handler.yaml**_
```yaml
id: log-cpu-alert
topic: cpu
kind: log
options:
  path: '/tmp/alerts.log'
```

Add the handler:

```bash
kapacitor define-topic-handler log_cpu_handler.yaml
```
