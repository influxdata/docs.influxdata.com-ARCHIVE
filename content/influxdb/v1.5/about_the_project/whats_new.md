---
title: What's new in InfluxDB 1.5
menu:
  influxdb_1_5:
    name: What's new
    weight: 20
    parent: administration
---

> For a comprehensive list of the changes between versions, see [InfluxDB's Changelog](/influxdb/v1.5/about_the_project/releasenotes-changelog/).

Included here are some highlights of the InfluxDB 1.5 release:

* [Time Series Index (TSI) support](#time-series-index--tsi--support)
* [Enterprise-compatible backup and restore](#enterprise-compatible-backup-and-restore-for-influxdb-oss)
* [Structured logging](#structured-logging)
* [Tracing](#tracing)
* [Redirecting HTTP request logging](#redirecting-http-request-logging)
* [InfluxDB '/metrics' HTTP endpoint](#influxdb-metrics-http-endpoint)

## TSI (Time Series Index) support

InfluxDB 1.5.0 introduces support for the InfluxDB time series index (TSI) engine. TSI was first introduced in InfluxDB 1.3 as a technical preview. Since then, InfluxDB users and InfluxData have tested, used, and shared feedback on this functionality.

With TSI, the number of series should be unbounded by the memory on the server hardware and the number of existing series will have a negligible impact on database startup time.

For more details on TSI, see the following:

* [TSI (Time Series Index) overview](/influxdb/v1.5/concepts/time-series-index/)
* [TSI (Time Series Index) details](/influxdb/v1.5/concepts/tsi-details/)

> **Note:** TSI remains disabled by default in InfluxDB 1.5, but you are encouraged to enable and use TSI to enhance the management of time series data, especially for data with high series cardinality. You can always revert to in-memory indexing, if required.


## Enterprise-compatible backup and restore for InfluxDB OSS

> ***Note:*** For InfluxDB Enterprise clusters, see [Backing up and restoring in InfluxDB Enterprise](/influxdb_enterprise/v1.5/administration/backup-and-restore/).

Starting with InfluxDB 1.5, InfluxDB OSS supports enterprise-compatible backup and restore. The InfluxDB OSS `backup` utility provides:

* Option to run backup and restore functions on an online, or live, database.
* Backup and restore functions for single or multiple databases with optional filtering based on data point timestamps.
* Data imports from [InfluxDB Enterprise](/enterprise_influxdb/latest/) clusters
* Backup files that can be imported into an InfluxDB Enterprise database.

The online `restore` utility in InfluxDB OSS supports the new Enterprise-compatible backup format, but the the legacy backup format is still available.

For details about the new backup and restore functionality, see [Backing up and restoring in InfluxDB OSS](/influxdb/v1.5/administration/backup-and-restore/).


## Structured logging

With InfluxDB 1.5, logging has been improved to support structured logging, trace logs, and generating HTTP request logs separate from InfluxDB internal logs.

Structured logging support allows you to more easily integrate InfluxDB logs with Splunk, Papertrail, Elasticsearch, and other third party tools. The two new structured log formats, `logfmt` and `json`, provide machine-readable and more developer-friendly log outputs.

See [logging options](/influxdb/v1.5/administration/config/#logging-options--logging/) in the configuration section.
See [Logging in InfluxDB](/influxdb/v1.5/administration/logs/)

## Tracing

Logging has been enhanced to provide tracing of important InfluxDB operations. Tracing is useful for error reporting and discovering performance bottlenecks.

For details on the tracing keys, tooling, and examples, see [Tracing](/influxdb/v1.5/administration/logs/#tracing).

## Redirecting HTTP request logging

InfluxDB 1.5 introduces the option to log HTTP request traffic separately from the other InfluxDB log output. When HTTP request logging is enabled, the HTTP logs are intermingled by default with internal InfluxDB logging. By redirecting the HTTP request log entries to a separate file, both log files are easier to read, monitor, and debug.

For more information, see [Redirecting HTTP request logging](/influxdb/v1.5/administration/logs/#redirecting-http-request-logging).

## InfluxDB '/metrics' HTTP endpoint

A new InfluxDB '/metrics' HTTP endpoint is configured to produce the default Go metrics in Prometheus metrics format. For details, see [InfluxDB `/metrics` HTTP endpoint](/influxdb/v1.5/administration/server_monitoring/#influxdb-metrics-http-endpoint)
