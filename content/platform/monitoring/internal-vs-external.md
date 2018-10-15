---
title: Internal vs external monitoring
description: An explanation of internal and external monitoring strategies for your Enterprise or OSS TICK stack with the pros and cons of each.
menu:
  platform:
    name: Internal vs external monitoring
    parent: Monitoring
    weight: 1
---

One of the primary use cases for InfluxData's TICK stack is infrastructure monitoring,
including using the TICK stack to monitor itself or another TICK stack.
These are two main approaches to Monitoring your TICK stack:

- **[Internal monitoring](#internal-monitoring)** - A TICK stack that monitors itself.
- **[External monitoring](#external-monitoring)** - A TICK stack monitored by another TICK stack.

_Be sure to also read through the [monitoring recommendations](#recommendations) below._

## Internal monitoring

<dt>Not recommended for production use cases.</dt>

By default, the InfluxData platform is configured to monitor itself.
Telegraf collects metrics from the host on which it's running for things such as
CPU usage, memory usage, disk usage, etc., and stores them in the `telegraf` database in InfluxDB.
InfluxDB also reports performance metrics about itself, such as continuous query statistics,
internal goroutine statistics, write statistics, series cardinality, and others,
and stores them in the `_internal` database.

[Monitoring dashboards](/platform/monitoring/monitoring-dashboards) are available that visualize the default metrics provided in each of these databases.
You can also [configure Kapacitor alerts](/kapacitor/latest/working/alerts/) to monitor and alert on each of these metrics.

### Pros of internal monitoring

#### Simple setup
Internal monitoring requires no additional setup or configuration changes.
The TICK stack monitors itself out of the box.

### Cons of internal monitoring

#### No hardware separation
When using internal monitoring, if your TICK stack goes offline, your monitor does as well.
Any configured alerts will not be sent and you will not be notified of any issues.
Because of this, **internal monitoring is not recommended for production use cases.**

## External monitoring

> Recommended for production use cases.

External monitoring consists of a TICK stack monitored by another TICK stack.
This usually takes the form of an Enterprise cluster being monitored by an OSS TICK stack.
It consists of Telegraf agents installed on each node in your primary cluster
reporting metrics for their respective hosts to a monitoring TICK stack installed
on a separate server or cluster.

_See the [Setup an external monitor](#) guide for information about setting up an external monitoring TICK stack._

[Monitoring dashboards](/platform/monitoring/monitoring-dashboards) are available that visualize the default metrics provided by the Telegraf agents.
You can also [configure Kapacitor alerts](/kapacitor/latest/working/alerts/) to monitor and alert on each of these metrics.

### Pros of external monitoring

#### Hardware separation
With an monitor running separate from your primary TICK stack, issues that occur in the primary stack will not affect the monitor.
If your primary TICK stack goes down or has issues, your monitor will be able detect them and to alert you.

### Cons of external monitoring

#### Slightly more setup
There is more setup involved with external monitoring, but the benefits far
outweigh the extra setup time required, especially for production use cases.

## Recommendations

### Disable the `_internal` database in production clusters
InfluxData does **not** recommend using the `_internal` database in a production cluster.
It creates unnecessary overhead, particularly for busy clusters, that can overload an already loaded cluster.
Metrics stored in the `_internal` database primarily measure workload performance,
which should only be tested in non-production environments.

To disable the `_internal` database, set [`store-enabled`](/influxdb/latest/administration/config/#monitoring-settings-monitor)
to `false` under the `[monitor]` section of your `influxdb.conf`.

```toml
[monitor]
  store-enabled = false
```
