---
title: InfluxDB Version 1.0 Documentation

menu:
  influxdb:
    name: v1.0
    identifier: influxdb_1_0
    weight: 2
---

InfluxDB is a [time series database](https://en.wikipedia.org/wiki/Time_series_database) built from the ground up to handle high write and query loads.
It is the second piece of the
[TICK stack](https://influxdata.com/time-series-platform/).
InfluxDB is meant to be used as a backing store for any use case involving large amounts of timestamped data, including DevOps monitoring, application metrics, IoT sensor data, and real-time analytics.

## Key Features

Here are some of the features that InfluxDB currently supports that make it a great choice for working with time series data.

* Custom high performance datastore written specifically for time series data.
The TSM engine allows for high ingest speed and data compression.
* Written entirely in Go.
It compiles into a single binary with no external dependencies.
* Simple, high performing write and query HTTP(S) APIs.
* Plugins support for other data ingestion protocols such as Graphite, collectd, and OpenTSDB.
* High availability setup available with [Relay](/influxdb/v1.0/high_availability/relay/).
* Expressive SQL-like query language tailored to easily query aggregated data.
* Tags allow series to be indexed for fast and efficient queries.
* Retention policies efficiently auto-expire stale data.
* Continuous queries automatically compute aggregate data to make frequent queries more efficient.
* Built in web admin interface.
