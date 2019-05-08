---
title: Considerations for monitoring the InfluxData Platform
description: An explanation of internal and external monitoring strategies for your Enterprise or OSS TICK stack with the pros and cons of each.
menu:
  platform:
    name: Configurations for monitoring
    parent: monitor-platform
    weight: 3
---

One of the primary use cases for InfluxData's TICK stack is infrastructure monitoring,
including using the TICK stack to monitor itself or another TICK stack.
These are the two main approaches to Monitoring your TICK stack:

- **[Internal monitoring](#internal-monitoring)** - A TICK stack that monitors itself.
- **["Watcher of watchers" approach](#the-watcher-of-watchers-approach)** - A TICK stack monitored by another TICK stack.

## Internal monitoring

<dt>Not recommended for production environments.</dt>

By default, the InfluxData platform is configured to monitor itself.
Telegraf collects metrics from the host on which it's running for things such as
CPU usage, memory usage, disk usage, etc., and stores them in the `telegraf` database in InfluxDB.
InfluxDB also reports performance metrics about itself, such as continuous query statistics,
internal goroutine statistics, write statistics, series cardinality, and others,
and stores them in the `_internal` database.
_For the recommendation about `_internal` databases, see [Disable the `_internal` database in production clusters](#disable-the-internal-database-in-production-clusters) below._

[Monitoring dashboards](/platform/monitoring/monitoring-dashboards) are available
that visualize the default metrics provided in each of these databases.
You can also [configure Kapacitor alerts](/kapacitor/latest/working/alerts/)
to monitor and alert on each of these metrics.

### Pros of internal monitoring

#### Simple setup
Internal monitoring requires no additional setup or configuration changes.
The TICK stack monitors itself out of the box.

### Cons of internal monitoring

#### No hardware separation

When using internal monitoring, if your TICK stack goes offline, your monitor does as well.
Any configured alerts will not be sent and you will not be notified of any issues.
Because of this, **internal monitoring is not recommended for production use cases.**

## The "watcher of watchers" approach

> Recommended for production environments.

A "watcher of watchers" approach for monitoring InfluxDB OSS and InfluxDB cluster
nodes offers monitoring of your InfluxDB resources while ensuring that the monitoring
statistics are available remotely in case of data loss.

This usually takes the form of an Enterprise cluster being monitored by an OSS TICK stack.
It consists of Telegraf agents installed on each node in your primary cluster
reporting metrics for their respective hosts to a monitoring TICK stack installed
on a separate server or cluster.

---

_For information about setting up an external monitoring TICK stack, see [Setup an external monitor](/platform/monitoring/external-monitor-setup)._

---

[Monitoring dashboards](/platform/monitoring/influxdata-platform/monitoring-dashboards) are available
that visualize the default metrics provided by the Telegraf agents.
You can also [configure Kapacitor alerts](/kapacitor/latest/working/alerts/)
to monitor and alert on each of these metrics.

### Pros of external monitoring

#### Hardware separation

With a monitor running separate from your primary TICK stack, issues that occur in the primary stack will not affect the monitor.
If your primary TICK stack goes down or has issues, your monitor will be able detect them and alert you.

### Cons of external monitoring

#### Slightly more setup

There is more setup involved with external monitoring, but the benefits far
outweigh the extra time required, especially for production use cases.

## Recommendations

### Disable the `_internal` database in production clusters
InfluxData does **not** recommend using the `_internal` database in a production cluster.
It creates unnecessary overhead, particularly for busy clusters, that can overload an already loaded cluster.
Metrics stored in the `_internal` database primarily measure workload performance,
which should only be tested in non-production environments.

To disable the `_internal` database, set [`store-enabled`](/influxdb/latest/administration/config/#monitoring-settings-monitor)
to `false` under the `[monitor]` section of your `influxdb.conf`.

_**influxdb.conf**_
```toml
# ...
[monitor]

  # ...

  # Whether to record statistics internally.
  store-enabled = false

  #...
```
