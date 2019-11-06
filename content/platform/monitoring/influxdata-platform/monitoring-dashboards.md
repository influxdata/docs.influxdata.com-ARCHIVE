---
title: Set up monitoring dashboards
description: >
  Set up dashboards to visualize and monitor the health and performance of your
  InfluxData TICK stack.
aliases:
  - /platform/monitoring/monitoring-dashboards/
  - /platform/monitoring/monitoring-dashboards/dashboard-oss-monitoring/ 
  - /platform/monitoring/monitoring-dashboards/dashboard-enterprise-monitoring/
menu:
  platform:
    name: Monitoring dashboards
    weight: 3
    parent: monitor-platform
aliases:
  - /platform/monitoring/influxdata-platform/monitoring-dashboards/dashboard-enterprise-monitoring/
  - /platform/monitoring/influxdata-platform/monitoring-dashboards/dashboard-oss-monitoring/
---


The following dashboards provide visualizations of performance metrics for
InfluxDB open source (OSS), InfluxDB Enterprise, and Kapacitor.

## Prebuilt dashboards
Chronograf provides prebuilt monitoring dashboards that use data from specific
Telegraf input plugins. To view prebuilt dashboards:

1. Open Chronograf and click **Host List** in the navigation bar.
2. Each link in the **Apps** column is a prebuilt dashboard generated using metrics
   from Telegraf input plugins.
   Click a link to view the associated dashboard.

## Import monitoring dashboards
Use the dashboards below to visualize and monitor key TICK stack metrics.
Download the dashboard file and import it into Chronograf.
For detailed instructions, see [Importing a dashboard](/chronograf/latest/administration/import-export-dashboards/#importing-a-dashboard).

- [Monitor InfluxDB OSS](#monitor-influxdb-oss)
- [Monitor InfluxDB Enterprise](#monitor-influxdb-enterprise)
- [Monitor Kapacitor](#monitor-kapacitor)

### Monitor InfluxDB OSS
Use the InfluxDB OSS Monitor dashboard to monitor InfluxDB OSS in Chronograf.

<a class="btn download" href="/downloads/influxdb-oss-monitor-dashboard.json" download target="\_blank">Download InfluxDB OSS Monitor dashboard</a>

The InfluxDB OSS Monitor dashboard uses data from the `_internal` database
_([not recommended for production](/platform/monitoring/influxdata-platform/internal-vs-external/#disable-the-internal-database-in-production-clusters))_
or collected by the [Telegraf `influxdb` input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/influxdb).
This dashboard contains the following cells:  

- Queries Executed Per Minute
- HTTP Requests Per Minute
- Points Throughput Per Minute by Hostname
- Series Cardinality & Measurements by Database
- HTTP Request Duration (99th %)
- Heap Size
- Shard Write Errors
- Continuous Queries Executed Per Minute

### Monitor InfluxDB Enterprise
Use the InfluxDB Enterprise Monitor dashboard to monitor InfluxDB Enterprise in Chronograf.

<a class="btn download" href="/downloads/influxdb-enterprise-monitor-dashboard.json" download target="\_blank">Download InfluxDB Enterprise Monitor dashboard</a>

The InfluxDB Enterprise Monitor dashboard uses data from the `_internal` database
_([not recommended for production](/platform/monitoring/influxdata-platform/internal-vs-external/#disable-the-internal-database-in-production-clusters))_
or collected by the [Telegraf `influxdb` input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/influxdb).
This dashboard contains the following cells:

- Queries Executed Per Minute
- HTTP Requests Per Minute
- Points Throughput Per Minute by Hostname
- Series Cardinality & Measurements by Database
- HTTP Request Duration (99th %)
- Heap Size
- Shard Write Errors
- Continuous Queries Executed Per Minute
- Hinted HandOff Queue Size
- Anti-Entropy Errors & Jobs

### Monitor Kapacitor
Use the Kapacitor Monitor dashboard to monitor Kapacitor in Chronograf.

<a class="btn download" href="/downloads/kapacitor-monitor-dashboard.json" download target="\_blank">Download Kapacitor Monitor dashboard</a>

The Kapacitor Monitor dashboard requires the Telegraf
[`mem`](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/mem),
[`cpu`](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/cpu),
[`system`](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/system),
and [`kapacitor`](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/kapacitor)
input plugins and contains the following cells:

- Kapacitor Host RAM Usage
- Kapacitor Host CPU Usage
- Kapacitor Host Load (1, 5, 15)
- Number of Subscriptions
- Number of Running Tasks
- Data Ingest Rate
