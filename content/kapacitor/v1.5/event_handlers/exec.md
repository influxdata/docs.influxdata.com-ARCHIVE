---
title: Exec Event Handler
description: The "exec" event handler allows you to execute external programs when Kapacitor alert messages are triggered. This doc includes configuration options and usage examples.
menu:
  kapacitor_1_5:
    name: Exec
    weight: 3
    parent: event-handlers
---

The exec event handler executes an external program.
Event data is passed over STDIN to the process.

## Options
The following exec event handler options can be set in a [handler file](/kapacitor/v1.5/event_handlers/#handler-file) or when using `.exec()` in a TICKscript.

| Name | Type           | Description                       |
| ---- | ----           | -----------                       |
| prog | string         | Path to program to execute.       |
| args | list of string | List of arguments to the program. |

#### Example Handler File
```yaml
id: handler-id
topic: topic-name
kind: exec
options:
  prog: /path/to/executable
  args: 'executable arguments'
```

#### Example TICKscript
```js
|alert()
  // ...
  .exec('/path/to/executable', 'executable arguments')
```

## Using the exec event handler
The exec event handler can be used in both TICKscripts and handler files to execute an external program based off of alert logic.

> **Note:** Exec programs are run as the `kapacitor` user which typically only has access to the default system `$PATH`.
If using an executable not in the `$PATH`, pass the executable's absolute path.

### Execute an external program from a TICKscript

The following TICKscript executes the `sound-the-alarm.py` Python script whenever idle CPU usage drops below 10% using the `.exec()` event handler.

_**exec-cpu-alert.tick**_  
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 10)
    .exec('/usr/bin/python', 'sound-the-alarm.py')
```

### Execute an external program from a defined handler

The following setup sends an alert to the `cpu` topic with the message, "Hey, check your CPU". An exec handler is added that subscribes to the `cpu` topic and executes the `sound-the-alarm.py` Python script whenever an alert message is published.

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

Create a handler file that subscribes to the `cpu` topic and uses the exec event handler to execute the `sound-the-alarm.py` Python script.

_**exec\_cpu\_handler.yaml**_
```yaml
id: exec-cpu-alert
topic: cpu
kind: exec
options:
  prog: '/usr/bin/python'
  args: 'sound-the-alarm.py'
```

Add the handler:

```bash
kapacitor define-topic-handler exec_cpu_handler.yaml
```
