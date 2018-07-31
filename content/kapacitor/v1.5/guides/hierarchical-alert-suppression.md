---
title: Suppressing Kapacitor alerts based on hierarchy
description: Kapacitor's '.inhibit()' allows you to create hierarchical alerting architectures by suppressing alerts with matching tags in a specified alert category.
menu:
  kapacitor_1_5:
    name: Hierarchical alert suppression
    identifier: hierarchical_alert_suppression
    weight: 30
    parent: guides
---

Kapacitor allows you to build out a robust monitoring and alerting solution with
multiple "levels" or "tiers" of alerts.
However, an issue arises when an event triggers both high-level and low-level alerts
and you end up getting multiple alerts from different contexts.
The [AlertNode's `.inhibit()`](/kapacitor/v1.5/nodes/alert_node/#inhibit) method
allows you to suppress other alerts when an alert is triggered.

For example, let's say you are monitoring a cluster of servers.
As part of your alerting architecture, you have host-level alerts such as CPU usage
alerts, RAM usage alerts, disk I/O, etc.
You also have cluster-level alerts that monitor network health, host uptime, etc.

If a CPU spike on a host in your cluster takes the machine offline, rather than
getting a host-level alert for the CPU spike _**and**_ a cluster-level alert for
the offline node, you'd get a single alert – the alert that the node is offline.
The cluster-level alert would suppress the host-level alert.

## Using the `.inhibit()` method to suppress alerts
The `.inhibit()` method uses alert categories and tags to inhibit or suppress other alerts.

```js
// ...
  |alert()
    .inhibit('<category>', '<tags>')
```

`category`  
The category for which this alert inhibits or suppresses alerts.

`tags`  
A comma-delimited list of tags that must be matched in order for alerts to be
inhibited or suppressed.

### Example hierarchical alert suppression  
The following TICKscripts represent two alerts in a layered alert architecture.
The first is a host specific CPU alert that triggers an alert to the `system_alerts`
category whenever idle CPU usage is less than 10%.
Streamed data points are grouped by the `host` tag, which identifies the host the
data point is coming from.

_**cpu\_alert.tick**_  
```js
stream
  |from()
    .measurement('cpu')
    .groupBy('host')
  |alert()
    .category('system_alerts')
    .crit(lambda: "usage_idle" < 10.0)
```

The following TICKscript is a cluster-level alert that monitors the uptime of hosts in the cluster.
It uses the [`deadman()`](/kapacitor/v1.5/nodes/alert_node/#deadman) function to
create an alert when a host is unresponsive or offline.
The `.inhibit()` method in the deadman alert suppresses all alerts to the `system_alerts`
category that include a matching `host` tag, meaning they are from the same host.

_**host\_alert.tick**_
```js
stream
  |from()
    .measurement('uptime')
    .groupBy('host')
  |deadman(0.0, 1m)
    .inhibit('system_alerts', 'host')
```

With this alert architecture, a host may be unresponsive due to a CPU bottleneck,
but because the deadman alert inhibits system alerts from the same host, you won't
get alert notifications for both the deadman and the high CPU usage; just the
deadman alert for that specific host.
