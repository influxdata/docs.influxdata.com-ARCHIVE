---
title: Differences netween InfluxDB 1.4 and 1.5
menu:
  influxdb_1_5:
    weight: 40
    parent: administration
---

This page aims to ease the transition from InfluxDB 1.3 to InfluxDB 1.4.
For a comprehensive list of the differences between the versions
see [InfluxDB's Changelog](/influxdb/v1.5/about_the_project/releasenotes-changelog/).

### Content
* [TSI Release](#tsi-release)
* [Prometheus Read-Write API](#prometheus-read-write-api)
* [Configuration File Byte Simplification](#configuration-file-byte-simplification)
* [InfluxQL Updates](#influxql-updates)
  * [SHOW CARDINALITY](#show-cardinality)
  * [Ranged Meta Queries](#ranged-meta-queries)
  * [Operators](#operators)
  * [Functions](#functions)
* [Other](#other)

## TSI Release
Version 1.3.0 marked the first official release of InfluxDB's new time series index (TSI) engine.  Additional
improvements have been made to the TSI engine for 1.4.

With TSI, the number of series should be unbounded by the memory on the server hardware and the number of existing series will have a negligible impact on database startup time.
See Paul Dix's blogpost [Path to 1 Billion Time Series: InfluxDB High Cardinality Indexing Ready for Testing](https://www.influxdata.com/path-1-billion-time-series-influxdb-high-cardinality-indexing-ready-testing/) for additional information.

> **Note:** TSI remains disabled by default in version 1.4.  We do not recommend using this setting for production deployments
at this time.  This feature is considered experimental and feedback is welcome.

To enable TSI, uncomment the [`index-version` setting](/influxdb/v1.5/administration/config/#index-version-inmem) and set it to `tsi1`.
The `index-version` setting is in the `[data]` section of the configuration file.
Next, restart your InfluxDB instance.

```
[data]
  dir = "/var/lib/influxdb/data"
  index-version = "tsi1"
```

## Prometheus Read-Write API

## Configuration File Byte Simplification

## InfluxQL Updates

### SHOW CARDINALITY

### Ranged Meta Queries

### Operators



### Functions


#### New function:

See the [functions page](/influxdb/v1.5/query_language/functions/) for detailed documentation.

#### New function:

#### Updated functions:

### Other
