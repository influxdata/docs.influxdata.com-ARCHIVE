---
title: Set up monitoring dashboards
description:
menu:
  platform:
    name: Dashboards for monitoring performance
    parent: Monitoring
    weight: 1
---
## Overview

The following dashboards can help you monitor the performance of your InfluxDB OSS or InfluxDB Enterprise instance.

With the exception of those already included in the product, you'll need to import the dashboards in Chronograf to use them. For detailed instructions, see [Importing a dashboard](/chronograf/latest/administration/import-export-dashboards/#importing-a-dashboard).

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

For details about the metrics in each cell, see [Steve's doc](link).

![Built-in Telegraf dashboard](/img/platform-dashboard-oss-telegraf.png)

### Without Telegraf

If you're not using Telegraf, you can import [this dashboard](link) built off the `_internal` database. It contains the following cells:

* Queries Executed/Min
* HTTP Requests/Min
* Per-Host Point Throughput/Min
* Series Cardinality by Database & Number of Measurements by Database
* HTTP Request Duration (99th %)
* Heap Size
* Shard Write Errors

For details about the metrics in each cell, see [Steve's doc](link).

![OSS dashboard (_internal)](/img/platform-dashboard-oss-internal.png)

## Monitor InfluxDB Enterprise

For a single InfluxDB Enterprise instance, you can import [this dashboard](link) built off the `_internal` database. It contains the following cells:

* Queries Executed/Min
* HTTP Requests/Min
* Per-Host Point Throughput/Min
* Series Cardinality by Database & Number of Measurements by Database
* HTTP Request Duration (99th %)
* Heap Size
* Shard Write Errors
* Hinted HandOff Queue Size
* Count of AE Errors & Jobs

For details about the metrics in each cell, see [Steve's doc](link).

[!Enterprise Dashboard (_internal)](/img/link)
