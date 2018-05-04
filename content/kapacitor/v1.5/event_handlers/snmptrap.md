---
title: SNMP Trap event handler
description: The "snmptrap" event handler allows you to send Kapacitor alerts SNMP traps. This doc includes configuration options and usage examples.
menu:
  kapacitor_1_5:
    name: SNMP Trap
    weight: 1600
    parent: event-handlers
---

The SNMP trap event handler sends alert messages as SNMP traps.

## Configuration
Configuration as well as default [option](#options) values for the SNMP trap
event handler are set in your `kapacitor.conf`.
Below is an example config:

```toml
[snmptrap]
  enabled = true
  addr = "localhost:162"
  community = "kapacitor"
  retries = 1
```

#### `enabled`
Set to `true` to enable the SNMP trap event handler.

#### `addr`
The `host:port` address of the SNMP trap server.

#### `community`
The community to use for traps.

#### `retries`
Number of retries when sending traps.


## Options
The following SNMP trap event handler options can be set in a
[handler file](/kapacitor/v1.5/event_handlers/#handler-file) or when using
`.snmpTrap()` in a TICKscript.

| Name      | Type   | Description                                                                     |
| ----      | ----   | -----------                                                                     |
| trap-oid  | string | OID of the trap.                                                                |
| data-list | object | Each data object has `oid`, `type`, and `value` fields. Each field is a string. |

### SNMP Trap Data Types
The SNMP trap event handler supports the following data types:

| Abbreviation | Datatype    |
| ------------ | --------    |
| c            |	Counter    |
| i            |	Integer    |
| n            |	Null       |
| s            |	String     |
| t            |	Time ticks |

### Example: handler file
```yaml
id: handler-id
topic: topic-name
kind: snmptrap
options:
  trap-oid: 1.3.6.1.4.1.1
  data-list:
    - oid: 1.3.6.1.4.1.1.5
      type: s
      value: '{{ .Level }}'
    - oid: 1.3.6.1.4.1.1.6
      type: i
      value: 50
    - oid: 1.3.6.1.4.1.1.7
      type: c
      value: '{{ index .Fields "num_requests" }}'
    - oid: 1.3.6.1.4.1.1.8
      type: s
      value: '{{ .Message }}'
```

### Example: TICKscript
```js
|alert()
  // ...
  .snmpTrap('1.3.6.1.4.1.1')
    .data('1.3.6.1.4.1.1.5', 's', '{{ .Level }}')
    .data('1.3.6.1.4.1.1.6', 'i', '50')
    .data('1.3.6.1.4.1.1.7', 'c', '{{ index .Fields "num_requests" }}')
    .data('1.3.6.1.4.1.1.8', 's', '{{ .Message }}')
```

## Using the SNMP trap event handler
The SNMP trap event handler can be used in both TICKscripts and handler files
to send alerts as SNMP traps.

### Sending SNMP traps from a TICKscript

The following TICKscript uses the `.snmptrap()` event handler to send alerts as
SNMP traps whenever idle CPU usage drops below 10%.

_**snmptrap-cpu-alert.tick**_  
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 10)
    .message('Hey, check your CPU')
    .snmpTrap('1.3.6.1.2.1.1')
      .data('1.3.6.1.2.1.1.7', 'i', '{{ index .Field "value" }}')
```

### Publish to multiple topics from a defined handler

The following setup sends an alert to the `cpu` topic with the message,
"Hey, check your CPU".
An SNMP trap handler is added that subscribes to the `cpu` topic and sends new
alerts as SNMP traps.

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

Create a handler file that subscribes to the `cpu` topic and uses the SNMP trap
event handler to send alerts as SNMP traps.

_**snmptrap\_cpu\_handler.yaml**_
```yaml
id: snmptrap-cpu-alert
topic: cpu
kind: snmptrap
options:
  trap-oid: '1.3.6.1.2.1.1'
  data-list:
    - oid: '1.3.6.1.2.1.1.7'
      type: i
      value: '{{ index .Field "value" }}'
```

Add the handler:

```bash
kapacitor define-topic-handler snmptrap_cpu_handler.yaml
```
