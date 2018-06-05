---
title: Suppressing Kapacitor alerts based on hierarchy
menu:
  kapacitor_1_5:
    name: Hierarchical alert suppression
    identifier: hierarchical_alert_suppression
    weight: 30
    parent: guides
---

- Use the `.inhibit()` method on your alert
- Alerts are suppressed based on category and matching tags

```js
//cpu_alert.tick
stream
  |from()
    .measurement('cpu')
    .groupBy('host')
  |alert()
    .category('system_alerts')
    .crit(lambda: "usage_idle" < 10.0)
```

```js
//host_alert.tick
stream
  |from()
    .measurement('uptime')
    .groupBy('host')
  |deadman(0.0, 1m)
    .inhibit('system_alerts', 'host')
```
