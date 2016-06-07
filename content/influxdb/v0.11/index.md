---
title: InfluxDB Version 0.11 Documentation

menu:
  influxdb:
    name: v0.11
    identifier: influxdb_011
    weight: 30
---

InfluxDB is a [time series database](https://en.wikipedia.org/wiki/Time_series_database) built from the ground up to handle high write and query loads.
InfluxDB is meant to be used as a backing store for any use case involving large amounts of timestamped data, including DevOps monitoring, application metrics, IoT sensor data, and real-time analytics.

## Key Features

Here are some of the features that InfluxDB currently supports that make it a great choice for working with time series data.

* Custom high performance datastore written specifically for time series data.
The TSM engine allows for high ingest speed and data compression.
* Written entirely in Go.
It compiles into a single binary with no external dependencies.
* Clustering is built in.
Nothing else is needed to make data highly available (unlike Redis, ZooKeeper, Cassandra, and others).

> **Note**: InfluxDB 0.11 is the last open source version that includes clustering. For more information, please see Paul Dix’s blog post on [InfluxDB Clustering, High-Availability, and Monetization](https://influxdata.com/blog/update-on-influxdb-clustering-high-availability-and-monetization/). Please note that the 0.11 version of clustering is still considered experimental, and there are still quite a few rough edges.

* Simple, high performing write and query HTTP(S) APIs.
* Plugins support for other data ingestion protocols such as Graphite, collectd, and OpenTSDB.
* Expressive SQL-like query language tailored to easily query aggregated data.
* Tags allow series to be indexed for fast and efficient queries.
* Retention policies efficiently auto-expire stale data.
* Continuous queries automatically compute aggregate data to make frequent queries more efficient.
* Built in web admin interface.

## Project Status

* Clustering, replication, and high-availability are in a beta state.
