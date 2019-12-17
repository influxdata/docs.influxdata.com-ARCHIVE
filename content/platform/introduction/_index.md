---
title: InfluxData platform
description: The InfluxData platform is the leading modern time-series platform built for metrics and events.
aliases:
  - /platform/
menu:
  platform:
    name: Introduction
    weight: 10
---

The InfluxData platform is the leading modern [time series](/platform/faq/#what-is-time-series-data) platform built for metrics and events:

- **InfluxData 1.x platform** includes the following open source components:
  - [Telegraf](#telegraf): collect data
  - [InfluxDB](#influxdb): store data
  - [Chronograf](#chronograf): visualize data
  - [Kapacitor](#kapacitor): process data and alerts
  - [Flux](https://docs.influxdata.com/flux): functional data scripting language

- **InfluxData 1.x commercial offerings** include:

  - [InfluxDB Enterprise](#influxdb-enterprise)
  - [Kapacitor Enterprise](#kapacitor-enterprise)
  - [InfluxCloud 1.x](https://help.influxcloud.net) (hosted cloud solution)

- **InfluxDB 2.0 platform** consolidates features from the InfluxData 1.x platform into a single package, with added features and flexibility:
  - [InfluxDB 2.0 alpha](https://v2.docs.influxdata.com/v2.0/get-started/) (open source solution as single binary)
  - [Flux](https://v2.docs.influxdata.com/v2.0/query-data/get-started): functional data scripting language

- **InfluxData 2.0 commercial offering**:
  - [InfluxDB Cloud 2.0](https://v2.docs.influxdata.com/v2.0/cloud/get-started/) (hosted cloud solution
  - InfluxDB Enterprise 2.0 is in development.

### Telegraf

Telegraf is a data collection agent that captures data from a growing list of sources
and translates it into [Line Protocol data format](/influxdb/latest/write_protocols/line_protocol_reference/)
for storage in InfluxDB. It's "pluggable", extensible architecture makes it easy to
create [plugins](/telegraf/latest/plugins/) that both pull and push data from and
to different sources and endpoints.

### InfluxDB

InfluxDB stores data for any use case involving large amounts of timestamped data, including
DevOps monitoring, log data, application metrics, IoT sensor data, and real-time analytics.
It provides functionality that allows you to conserve space on your machine by keeping
data for a defined length of time, then automatically downsampling or expiring and deleting
unneeded data from the system.

### Chronograf

Chronograf is the user interface for the TICK stack that provides customizable dashboards,
data visualizations, and data exploration. It also allows you to view and manage
[Kapacitor](#kapacitor) tasks.

### Kapacitor

Kapacitor is a data processing framework that enables you to process and act on data
as it is written to InfluxDB. This includes detecting anomalies, creating alerts
based on user-defined logic, and running ETL jobs.

## Enterprise versions

InfluxDB Enterprise and Kapacitor Enterprise provide clustering, access control, and incremental backup functionality for production infrastructures at scale. You'll also receive direct support from the InfluxData support team.

> InfluxDB Enterprise and Kapacitor Enterprise are compatible with open source versions of > Telegraf and Chronograf.

### InfluxDB Enterprise

InfluxDB Enterprise provides functionality necessary to run a high-availability (HA) InfluxDB cluster, providing clustering, horizontal scale out, and advanced access controls, including:

- Hinted handoff
- Anti-entropy
- Fine-grained authorization
- Cluster profiling
- Incremental backups

#### Hinted handoff

Data is written across nodes using an eventually consistent write model.
All writes are added to the [Hinted Handoff Queue (HHQ)](/enterprise_influxdb/latest/concepts/clustering/#hinted-handoff),
then written to other nodes in the cluster.

#### Anti-Entropy

InfluxDB Enterprise's
[Anti-Entropy (AE)](/enterprise_influxdb/latest/administration/anti-entropy/)
process ensures data shards in the cluster are in sync. When "entropy" (out-of-sync
data) is detected, AE will repair the affected shards, syncing the missing data.

#### Fine-grained authorization

In InfluxDB Enterprise, fine-grained authorization can be used to control access
at the measurement or series levels rather than just the database level.

#### Cluster profiling

Enterprise meta nodes expose the `/debug/pprof` API endpoint that allows you to
profile and potentially diagnose performance bottlenecks in your cluster.

#### Incremental backups

InfluxDB Enterprise allows for incremental backups that write only newly added
data to existing backup files rather than backing up all data in a new backup.

### Kapacitor Enterprise

Kapacitor Enterprise provides functionality necessary to run a high-availability
Kapacitor cluster, including:

- Kapacitor cluster management
- Alert deduplication
- Secure communication

#### Kapacitor cluster management

Kapacitor Enterprise is packaged with `kapactorctl`, a command line client for creating
and managing Kapacitor clusters.

#### Alert deduplication

As alerts are triggered in a multi-node Kapacitor cluster, Kapacitor Enterprise
deduplicates alert data to prevent duplicate alert notifications from being sent.

#### Secure communication

Data is passed between InfluxDB and Kapacitor via subscriptions.
Kapacitor Enterprise includes configuration options that let you encrypt
communication between your Kapacitor Enterprise and InfluxDB Enterprise clusters.

<div style="display:inline-block;padding:.25em;margin:1em 0 2em; color:#fff;background:#4ed8a0;background:linear-gradient(to right,#4ed8a0 0,#22adf6 100%);border-radius:3px;">
  <a href="https://portal.influxdata.com/" target="\_blank" class="sidebar--support-ad--cta" style="color:#fff;text-align:center;">
    Try InfluxData Platform Enterprise
  </a>
</div>

## Get started

Now that you understand the platform from a high level, go ahead and dive in.
The following links will help you get started:

[Installation and Configuration](/platform/installation)  
[Getting Started](/platform/introduction/getting-started)  
