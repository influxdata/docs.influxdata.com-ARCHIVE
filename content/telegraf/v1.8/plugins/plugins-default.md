---
title: Telegraf plugins - enabled by default
description: Describes the Telegraf plugins enabled by default with Telegraf installations.
menu:
  telegraf_1_8:
    name: Default plugins
    weight: 20
    parent: Administration
---

**Content**
* [Default Telegraf plugins]
* [Telegraf plugins for InfluxData Platform components]
* [TICK stack-related plugins]
* Telegraf plugins for Enterprise cluster monitoring and alerting


## Default Telegraf plugins

During installation, the following input and output plugins are enabled by default. When you use Chronograf, pre-created dashboards and databases use data generated using these plugins.

### Default Telegraf input plugins

The following input plugins are enabled by default.

#### CPU (`cpu`)

The [CPU (`cpu`) input plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/system/CPU_README.md) gathers metrics about CPU usage. The CPU usage data is gathered and stored in the `telegraf` database.

#### Disk (`disk`)

The [Disk (`disk`) input plugin](hhttps://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/system/DISK_README.md) gathers metrics about disk usage by mount point.

#### DiskIO (`diskio`)

The [DiskIO (`diskio`) input plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/system/DISKIO_README.md) gathers statistics for all devices, including disk partitions.

#### Kernel (`kernel`)

The [Kernel (`kernel`) input plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/system/KERNEL_README.md) gathers kernel statistics from `/proc/stat`.

#### Mem (`mem`)

The Mem (mem) input plugin collects system memory metrics. No configuration options are available. For a more complete explanation of the difference between used and actual_used RAM, see Linux ate my ram.

#### Processes (`processes`)

The [Processes (`processes`) input plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/system/PROCESSES_README.md)
gathers info about the total number of processes and groups them by status (zombie, sleeping, running, etc.). No configuration options are available. On Linux, this plugin requires access to `procfs` (`/proc`); on other operating systems, it requires access to execute `ps`.

#### Swap (`swap`)

The [Swap (`swap`) input plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/system/SWAP_README.md) gathers metrics about swap memory usage. No configuration options are available. For more information about Linux swap spaces, see [All about Linux swap space](https://www.linux.com/news/all-about-linux-swap-space).

#### System (`system`)

The [System (`system`) input plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/system/SYSTEM_README.md) gathers general stats on system load, uptime, and number of users logged in. No configuration options are available. It is basically equivalent to the UNIX `uptime` command.

### Default Telegraf output plugins

#### InfluxDB v1.x (`influxdb`)

The [InfluxDB v1.x (`influxdb`) output plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/outputs/influxdb) writes to InfluxDB using HTTP or UDP.


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
