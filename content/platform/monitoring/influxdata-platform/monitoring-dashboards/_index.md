---
title: Set up monitoring dashboards
description: Set up dashboards to help you visualize and monitor the health and performance of your InfluxData TICK stack.
menu:
  platform:
    name: Dashboards for monitoring InfluxDB
    weight: 3
    parent: monitor-platform
---
## Overview

The following dashboards can help you monitor the performance of InfluxDB OSS or InfluxDB Enterprise.

With the exception of those already included in the product, you'll need to import the dashboards in Chronograf to use them.
For detailed instructions, see [Importing a dashboard](/chronograf/latest/administration/import-export-dashboards/#importing-a-dashboard).

## Monitor InfluxDB OSS

The dashboards below can help you monitor InfluxDB OSS in Chronograf.

### With Telegraf
If you use the `[influxdb]` input plug-in with Telegraf, you can monitor your instance with a prebuilt dashboard.

**To view the prebuilt dashboard:**  

* Open Chronograf and click **Host List** in the navigation bar.
* Click the `influxdb` app in the **Apps** column.

The dashboard contains the following cells:  

* InfluxDB - Write Points
* InfluxDB - Write Errors
* InfluxDB - Write HTTP Requests
* InfluxDB - Query Requests
* InfluxDB - Client Failures
* InfluxDB - Query Performance
* InfluxDB - Cardinality

_For details about the metrics in each cell, see the [InfluxDB OSS Stats monitoring dashboard](/platform/monitoring/influxdata-platform/monitoring-dashboards/dashboard-oss-monitoring)._

![Built-in Telegraf dashboard](/img/platform/platform-dashboard-oss-telegraf.png)

### Without Telegraf

If you're not using Telegraf, you can import the following dashboard built off the `_internal` database that contains these cells:

* Queries Executed/Min
* HTTP Requests/Min
* Per-Host Point Throughput/Min
* Series Cardinality by Database & Number of Measurements by Database
* HTTP Request Duration (99th %)
* Heap Size
* Shard Write Errors

_For details about the metrics in each cell, see the [InfluxDB OSS Stats monitoring dashboard](/platform/monitoring/influxdata-platform/monitoring-dashboards/dashboard-oss-monitoring)._

<a class="btn download" href="/downloads/dashboard-influxdb-oss-stats_internal.json" download target="\_blank">Download this dashboard</a>

![OSS dashboard (_internal)](/img/platform/platform-dashboard-oss-internal.png)

## Monitor InfluxDB Enterprise

For a single InfluxDB Enterprise instance, you can import the following dashboard built off the `_internal` database that contains these cells:

* Queries Executed/Min
* HTTP Requests/Min
* Per-Host Point Throughput/Min
* Series Cardinality by Database & Number of Measurements by Database
* HTTP Request Duration (99th %)
* Heap Size
* Shard Write Errors
* Hinted HandOff Queue Size
* Count of AE Errors & Jobs

_For details about the metrics in each cell, see the [Enterprise Stats monitoring dashboard](/platform/monitoring/influxdata-platform/monitoring-dashboards/dashboard-enterprise-monitoring)._

<a class="btn download" href="/downloads/dashboard-influxdb-enterprise-cluster-stats_internal.json" download target="\_blank">Download this dashboard</a>

![Enterprise Dashboard (_internal)](/img/platform/platform-dashboard-enterprise-internal.png.png)
