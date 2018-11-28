---
title: Handling Kapacitor alerts during scheduled downtime
description: This guide walks through building Kapacitor TICKscripts that gracefully handle scheduled downtime without triggering unnecessary alerts.
menu:
  kapacitor_1_5:
    name: Handling scheduled downtime
    parent: guides
    weight: 100
---

In many cases, infrastructure downtime is necessary to perform system maintenance.
This time of downtime is typically scheduled beforehand, but can trigger unnecessary
alerts if the servers are monitored by Kapacitor.
This guide walks through creating TICKscripts that gracefully handle scheduled downtime
without triggering alerts.

This is accomplished by using `sideload` to load information from files in the filesystem
and sets fields and tags on data points which can then be used in alert logic.

## Sideload
The [`sideload`](/kapacitor/v1.5/nodes/sideload_node) node adds fields and tags to
points based on hierarchical data from various filesystem-based sources.
Of its properties, the following are relevant to this guide:

- `source`
- `order`
- `field`


Basically there needs to be a file that is accessible by Kapacitor that white
lists or black lists hosts to alarm about. You can then load that file into Kapacitor
and use it to drive the alarm decision making.

- Data points need a `host` tag.

Use `sideload` to load in the maintenance state where ever it is needed:

```js
stream
    |from()
        .measurement('cpu')
        .groupBy(*)
    // Use sideload to maintain the host maintenance state
    // By default we assume a host is online.
    |sideload()
      .source('file:///path/to/dir')
      .order('host/{{.host}}.yml')
      .field('maintenance', FALSE)
    |alert()
        // Add the `!"maintenance"` condition to the alert.
        .crit(lambda: !"maintenance" AND "usage_idle" < 30)
        .warn(lambda: !"maintenance" AND "usage_idle" < 50)
```


`source` defines the directory in which sideloaded files reside. Files in this location should be YAML or JSON.
`order` defines both the actual files sideloaded in as well is the priority in which their search (from left to right)

The full filepath is a combination of `source` and `order`.

```js
.source('file:///path/to/dir')
.order('example.yml')
```
