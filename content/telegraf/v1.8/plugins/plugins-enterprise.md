---
title: Using Telegraf plugins for Enterprise production deployments
description: Telegraf plugins can be used for monitoring InfluxData platform components.
menu:
  telegraf_1_8:
    name: Plugins for monitoring InfluxData Platform
    weight: 20
    parent: Administration
---

**Content**
* [Telegraf plugins for InfluxData Platform components](#telegraf-plugins-for-influxdata-platform-components)
* [TICK stack-related plugins]
* Optional Telegraf plugins


## Core Telegraf plugins for Enterprise cluster monitoring and alerting

To monitor and alert based on your InfluxData Platform clusters, the default Telegraf plugins are used to provide most of your metrics.

### CPU
### Memory
### Disk
### DiskIO
### Mem
### Netstat

The [Netstat (`netstat`) input plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/net/NETSTAT_README.md)

### System
### InfluxDB input plugin

The [InfluxDB v1.x (`influxdb`)](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/influxdb) gathers metrics from the exposed InfluxDB v1.x `/debug/vars` endpoint.  Using Telegraf to extract these metrics to create a "monitor of monitors" is a best practice and allows you to reduce the overhead associated with
capturing and storing these metrics locally within the `_internal` database for production deployments.
[Read more about this approach here.](https://www.influxdata.com/blog/influxdb-debugvars-endpoint/).

## Telegraf plugins for InfluxData Platform components

The following plugins provide output data or input data for InfluxData Platform components:

* Telegraf
  - Input
    - Telegraf v1.x (`internal`)
* InfluxDB
  - Input
    - InfluxDB v1.x (`influxdb`)
  - Output
    - InfluxDB v1.x (`influxdb`)
    - InfluxDB v2 (`influxdb_v2`)
* Chronograf
  - No plugins available
* Kapacitor
  - Input
    - Kapacitor (`kapacitor`)

## Monitoring the TICK stack

### Telegraf

The [Telegraf v1.x (`internal`) input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/internal) collects metrics about the Telegraf v1.x agent itself.
Note that some metrics are aggregates across all instances of one type of plugin.

### InfluxDB

The [InfluxDB v1.x (`influxdb`) input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/influxdb) gathers metrics from the exposed InfluxDB v1.x `/debug/vars` endpoint.  Using Telegraf to extract these metrics to create a "monitor of monitors" is a best practice and allows you to reduce the overhead associated with
capturing and storing these metrics locally within the `_internal` database for production deployments.
[Read more about this approach here.](https://www.influxdata.com/blog/influxdb-debugvars-endpoint/).

### Chronograf

There are no plugins currently for the Chronograf component of the TICK stack.

### Kapacitor

The [Kapacitor (`kapacitor`) input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/kapacitor) will collect metrics from the given Kapacitor instances.
