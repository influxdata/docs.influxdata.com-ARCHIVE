---
title: Sensu Event Handler
description: The Sensu event handler allows you to send Kapacitor alerts to Sensu. This doc includes configuration options and usage examples.
menu:
  kapacitor_1_5:
    name: Sensu
    weight: 1400
    parent: event-handlers
---

[Sensu](https://sensu.io/) is a service that provides infrastructure, service,
and application monitoring as well as other metrics.
Kapacitor can be configured to send alert messages to Sensu.

## Configuration
Configuration as well as default [option](#options) values for the Sensu event
handler are set in your `kapacitor.conf`.
Below is an example config:

```toml
[sensu]
  enabled = true
  addr = "sensu-client:3030"
  source = "Kapacitor"
  handlers = ["hander1-name", "handler2-name"]
```

#### `enabled`
Set to `true` to enable the Sensu event handler.

#### `addr`
The Sensu Client `host:port` address.

#### `source`
Default "Just-in-Time" (JIT) source.

#### `handlers`
List of [Sensu handlers](https://docs.sensu.io/sensu-core/1.3/guides/intro-to-handlers/#getting-started-with-handlers) to use.


## Options
The following Sensu event handler options can be set in a
[handler file](/kapacitor/v1.5/event_handlers/#handler-file) or when using
`.sensu()` in a TICKscript.

| Name     | Type            | Description                                                                |
| ----     | ----            | -----------                                                                |
| source   | string          | Sensu source for which to post messages.                                   |
| handlers | list of strings | Sensu handler list. If empty uses the handler list from the configuration. |

### Example: handler file
```yaml
id: handler-id
topic: topic-name
kind: sensu
options:
  source: Kapacitor
  handlers:
    - handler1-name
    - handler2-name
```

### Example: TICKscript
```js
|alert()
  // ...
  .sensu()
    .source('Kapacitor')
    .handlers('handler1-name', 'handler2-name')
```

## Using the Sensu event handler
With the Sensu event handler enabled and configured in your `kapacitor.conf`,
use the `.sensu()` attribute in your TICKscripts to send alerts to Sensu or
define a Sensu handler that subscribes to a topic and sends published alerts
to Sensu.

_**Sensu settings in kapacitor.conf**_
```toml
[sensu]
  enabled = true
  addr = "123.45.67.89:3030"
  source = "Kapacitor"
  handlers = ["tcp", "transport"]
```

### Send alerts to Sensu from a TICKscript
The following TICKscript uses the `.sensu()` event handler to send the message,
"Hey, check your CPU", to Sensu whenever idle CPU usage drops below 10%.

_**sensu-cpu-alert.tick**_  
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 10)
    .message('Hey, check your CPU')
    .sensu()      
```

### Send alerts to Sensu from a defined handler

The following setup sends an alert to the `cpu` topic with the message,
"Hey, check your CPU".
A Sensu handler is added that subscribes to the `cpu` topic and publishes all
alert messages to Sensu.

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
    .message('Hey, check your CPU')
    .topic('cpu')
```

Add and enable the TICKscript:

```bash
kapacitor define cpu_alert -tick cpu_alert.tick
kapacitor enable cpu_alert
```

Create a handler file that subscribes to the `cpu` topic and uses the Sensu
event handler to send alerts to Sensu.

_**sensu\_cpu\_handler.yaml**_
```yaml
id: sensu-cpu-alert
topic: cpu
kind: sensu
options:
  source: Kapacitor
  handlers:
    - tcp
    - transport
```

Add the handler:

```bash
kapacitor define-topic-handler sensu_cpu_handler.yaml
```
