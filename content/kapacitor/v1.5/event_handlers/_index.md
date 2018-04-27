---
title: Kapacitor Event Handlers

menu:
  kapacitor_1_5:
    name: Event Handlers
    identifier: event-handlers
    weight: 4
---

Kapacitor can be integrated into a monitoring system by sending
[alert messages](/kapacitor/v1.5/nodes/alert_node/#message) to supported event
handlers. Currently, Kapacitor can send alert messages to specific log files and
specific URLs, as well as to many third party applications.

These documents outline configuration options, setup instructions, [handler file](#handler-file) and [TICKscript](/kapacitor/v1.5/tick/introduction/)
syntax for officially supported Kapacitor event handlers.

[Aggregate](aggregate/)  
[Alerta](alerta/)  
[Exec](exec/)  
[Hipchat](hipchat/)  
[Kafka](kafka/)  
[Log](log/)  
[Opsgenie](opsgenie/)  
[Pagerduty](pagerduty/)  
[Post](post/)  
[Publish](publish/)   
[Pushover](pushover/)   
[Sensu](sensu/)  
[Slack](slack/)  
[SMTP](smtp/)  
[Snmptrap](snmptrap/)  
[Talk](talk/)  
[TCP](tcp/)  
[Telegram](telegram/)  
[Victorops](victorops/)  

> **Note:** Setup instructions are not currently available for all supported event
handlers, but additional information will be added over time. If
you are familiar with the setup process for a specific event handler, please
feel free to [contribute](https://github.com/influxdata/docs.influxdata.com/blob/master/CONTRIBUTING.md).

## Configuring Event Handlers
Required and default configuration options for most event handlers are configured in your Kapacitor configuration file, `kapacitor.conf`.
_The default location for this is `/etc/kapacitor/kapacitor.conf`, but may be different depending on your Kapacitor setup._

Many event handlers provide options that can be defined in a TICKscript or in a handler file while
some can only be configured in a hander file.
These configurable options are outlined in the documentation for each handler.

## Adding and using event handlers
If necessary, enable the desired event handler in your `kapacitor.conf`. Once enabled, you can create use the handler in two different ways.

1. [Create a topic handler with a handler file](#handler-file).
2. [Use the handler in your TICKscripts](#tickscript).

    > **Note:** Not all event handlers can be used in TICKscripts.

### Handler file
An event handler file is a simple YAML or JSON file that contains information about the handler.
Though many handlers can be added in a TICKscript, this can become combersome when managing multiple handlers.
Handler files allow you to add and use handlers outside of TICKscripts.
For some handler types, using handler files is the only option.

The handler file contains the following:

<span style="color: #ff9e46; font-style: italic; font-size: .8rem;">* Required</span>

- ID<span style="color: #ff9e46; font-style: italic;">\*</span> - The unique ID of the handler.
- Topic<span style="color: #ff9e46; font-style: italic;">\*</span> - The topic to which the handler subscribes.
- Match - A lambda expression to filter matching alerts. By default all alerts match.
- Kind<span style="color: #ff9e46; font-style: italic;">\*</span> - The kind of handler.
- Options - Configurable options determined by the handler kind. If none are provided, default values defined for the handler in the `kapacitor.conf` will be used.

#### Example handler file
```yaml
id: alert-id
topic: topic-name
match: changed()
kind: slack
options:
  channel: '#oh-nos'
```

#### Add the handler
Use the Kapacitor CLI to define a new handler with a handler file:

```bash
# Pattern
kapacitor define-topic-handler <handler-file-name>

# Example
kapacitor define-topic-handler slack_cpu_handler.yaml
```

### TICKscript
Many event handlers can be used directly in TICKscripts to send events. This is generally done with handlers that send messages to third-parties Below is an example TICKscript that publishes CPU alerts to Slack using the `.slack()` event handler:

```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "idle_usage" < 10)
    .message('You better check your CPU usage.')
    .slack()
```
