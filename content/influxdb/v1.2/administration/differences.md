---
title: Differences Between InfluxDB 1.2 and 1.1
aliases:
    - influxdb/v1.2/concepts/013_vs_1/
    - influxdb/v1.2/concepts/012_vs_013/
    - influxdb/v1.2/concepts/011_vs_012/
    - influxdb/v1.2/concepts/010_vs_011/
    - influxdb/v1.2/concepts/09_vs_010/
    - influxdb/v1.2/concepts/08_vs_09/
menu:
  influxdb_1_2:
    weight: 40
    parent: administration
---

This page aims to ease the transition from InfluxDB 1.1 to InfluxDB 1.2.
For a comprehensive list of the differences between the versions
see [InfluxDB's Changelog](https://github.com/influxdata/influxdb/blob/master/CHANGELOG.md).

### Performance Improvements

Version 1.2 offers a significantly improved underlying data cache.
The improvements yield a 50% write performance boost under load, allowing users to rapidly store even more data than before.

### New Query Capabilities

InfluxDB has extended its query language to support subqueries.
Subqueries allow users to be more efficient in finding insights into their data.
See the [Data Exploration](/influxdb/v1.2/query_language/data_exploration/#subqueries) page for a detailed syntax description and practical examples.

### CLI Improvements

With version 1.2, the [Command Line Interface (CLI)](/influxdb/v1.2/tools/shell/) offers new functionality that simplifies writing and querying data in InfluxDB.

* `USE` supports specifying a target retention policy with `USE "database_name"."retention policy_name"`
* `CLEAR` clears the current target database or retention policy
* `INSERT INTO "retention policy"` no longer resets the target retention policy for every subsequent write

### Deprecations

The admin UI (port `8083`) remains officially deprecated and disabled in this release.
It can be [re-enabled](/influxdb/v1.2/administration/config/#admin) in the configuration file, but will be removed in a future release.
We recommend using [Chrongraf](https://github.com/influxdata/chronograf) or [Grafana](https://github.com/grafana/grafana) as a replacement.

### Upgrading

This release is a drop-in replacement for 1.1 with no data migration required.
There are some configuration changes that may need to be updated prior to upgrading to avoid downtime.
Be sure to read the [CHANGELOG](https://github.com/influxdata/influxdb/blob/master/CHANGELOG.md) prior to upgrading.
