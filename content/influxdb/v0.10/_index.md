---
title: InfluxDB 0.10 documentation
aliases:
  - /influxdb/v0.10/introduction/overview/

menu:
  influxdb:
    name: v0.10
    identifier: influxdb_010
    weight: 100
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
* Simple, high performing write and query HTTP(S) APIs.
* Plugins support for other data ingestion protocols such as Graphite, collectd, and OpenTSDB.
* Expressive SQL-like query language tailored to easily query aggregated data.
* Tags allow series to be indexed for fast and efficient queries.
* Retention policies efficiently auto-expire stale data.
* Continuous queries automatically compute aggregate data to make frequent queries more efficient.
* Built in web admin interface.

## Project Status

* Clustering, replication, and high-availability are in a beta state.
* The query engine is not optimized for the new TSM engine.
A significant refactor of the query engine is in progress targeted for release in version 0.11.
