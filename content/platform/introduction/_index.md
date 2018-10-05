---
title: Introduction to the InfluxData Platform
description: The InfluxData Platform is the leading time-series platform designed from the ground up for modern metrics and events.
aliases:
  - /platform/
menu:
  platform:
    name: Introduction
    weight: 1
---

The InfluxData Platform is the leading [time series](/platform/faq/#what-is-time-series-data)
platform designed from the ground up for modern metrics and events.
It is comprised of four core components: Telegraf, InfluxDB, Chronograf, and Kapacitor
(often referred to as the [TICK stack](#the-tick-stack)).
Each fulfills a specific role in managing your time-series data: data collection,
data storage, data visualization, and data processing and alerting.

[Enterprise versions](#influxdata-platform-enterprise) of InfluxDB and Kapacitor
provide clustering, access control, and incremental backup functionality for
production infrastructures at scale.

## The TICK stack

[**T**elegraf](#telegraf) - _Data collection_  
[**I**nfluxDB](#influxdb) - _Data storage_  
[**C**hronograf](#chronograf) - _Data visualization_  
[**K**apacitor](#kapacitor) - _Data processing and events_  

### Telegraf

_Data Collection_  

Telegraf is a data collection agent that captures data from a growing list of sources
and translates it into [Line Protocol data format](/influxdb/latest/write_protocols/line_protocol_reference/)
for storage in InfluxDB. It's "pluggable", extensible architecture makes it easy to
create [plugins](/telegraf/latest/plugins/) that both pull and push data from and
to different sources and endpoints.

### InfluxDB

_Data Storage_

InfluxDB stores data for any use case involving large amounts of timestamped data, including
DevOps monitoring, log data, application metrics, IoT sensor data, and real-time analytics.
It provides functionality that allows you to conserve space on your machine by keeping
data for a defined length of time, then automatically downsampling or expiring and deleting
unneeded data from the system.

### Chronograf

_Data Visuzalization_

Chronograf is the user interface for the TICK stack that provides customizable dashboards,
data visualizations, and data exploration. It also allows you to view and manage
[Kapacitor](#kapacitor) tasks.

### Kapacitor

_Data Processing & Events_

Kapacitor is a data processing framework that enables you to process and act on data
as it is written to InfluxDB. This includes detecting anomalies, creating alerts
based on user-defined logic, and running ETL jobs.

## InfluxData Platform Enterprise
InfluxData's Enterprise offerings allow you to run the TICK stack at scale, providing
clustering, advanced access control, and other enterprise-specific features for
InfluxDB and Kapacitor as well as direct support from InfluxData's support team.

> The open source versions of Telegraf and Chronograf are used in the Enterprise
> TICK stack and do not require enterprise licenses.

### InfluxDB Enterprise
InfluxDB Enterprise provides functionality necessary to run a high-availability (HA)
InfluxDB cluster.

#### Hinted handoff
Data is written across nodes using an eventually consistent write
model. All writes are added to the [Hinted Handoff Queue (HHQ)](/enterprise_influxdb/latest/concepts/clustering/#hinted-handoff),
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
Kapacitor cluster.

#### Kapacitor cluster management
Kapacitor Enterprise is packaged with `kapactorctl`, a command line client for creating
and managing Kapacitor clusters.

#### Alert deduplication
As alerts are triggered in a multi-node Kapacitor cluster, Kapacitor Enterprise
deduplicates alert data to prevent duplicate alert notifications from being sent.

#### Secure communication
Data is passed between InfluxDB and Kapacitor via subscriptions.
Kapacitor Enterprise includes configuration options that allow you to encrypt
communication between your Kapacitor Enterprise and InfluxDB Enterprise clusters.

<div style="display:inline-block;padding:.25em;margin:1em 0 2em; color:#fff;background:#4ed8a0;background:linear-gradient(to right,#4ed8a0 0,#22adf6 100%);border-radius:3px;">
  <a href="https://portal.influxdata.com/" target="\_blank" class="sidebar--support-ad--cta" style="color:#fff;text-align:center;">
    Try InfluxData Platform Enterprise
  </a>
</div>

## Get Started
Now that you understand the platform from a high level, go ahead and dive in.
The following links will help you get started:

[Installation and Configuration](/platform/installation)  
[Getting Started](/platform/introduction/getting-started)  
