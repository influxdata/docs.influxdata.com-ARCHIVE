---
title: InfluxDB 0.9 documentation
aliases:
  - /influxdb/v0.9/introduction/overview/

menu:
  influxdb:
    name: v0.9
    identifier: influxdb_09
    weight: 200
---

InfluxDB is a [time series database](https://en.wikipedia.org/wiki/Time_series_database) built from the ground up to handle high write and query loads.
InfluxDB is meant to be used as a backing store for any use case involving large amounts of timestamped data, including DevOps monitoring, application metrics, IoT sensor data, and real-time analytics.

## Key Features

Here are some of the features that InfluxDB currently supports that make it a great choice for working with time series data.

* Written entirely in Go.
It compiles into a single binary with no external dependencies.
* Clustering is built in.
Nothing else is needed to make data highly available (unlike Redis, ZooKeeper, Cassandra, and others).
* Simple, high performing write and query HTTP(S) APIs.
* Plugins support for other data ingestion protocols such as Graphite, collectd, and OpenTSDB.
* Expressive SQL-like query language tailored to easily query aggregated data.
* Tags allow series to be indexed for fast and efficient queries.
* Retention policies efficiently auto-expire stale data.
* Continuous queries automatically compute aggregate data to make frequent queries more efficient.
* Built in web admin interface.

## Project Status

The current version of InfluxDB is 0.9.6.1.
Clustering, replication, and high-availability should be considered in an alpha state.
