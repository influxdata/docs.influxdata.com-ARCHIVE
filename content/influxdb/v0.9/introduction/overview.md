---
title: Overview
---

InfluxDB is a time series, metrics, and analytics database. It's written in Go and has no external dependencies. That means once you install it there's nothing else to manage (such as Redis, ZooKeeper, Cassandra, HBase, or anything else).

InfluxDB is targeted at use cases for DevOps, metrics, sensor data, and real-time analytics. It arose from our need for a database like this on more than a few previous products we've built. You can [read more about our journey from SaaS application to open source time series database](/blog/2014/09/26/one-year-of-influxdb-and-the-road-to-1_0.html).

## Project Status

The current version of InfluxDB is 0.9.4.1. Clustering, replication and high-availability should be considered in an alpha state.

## Key Features

Here are some of the features that InfluxDB currently supports that make it a great choice for working with time series data.

* SQL-like query language.
* HTTP(S) API for data ingestion and queries.
* Built-in support for other data protocols such as collectd.
* Store billions of data points.
* Tag data for fast and efficient queries.
* Database-managed retention policies for data.
* Built in management interface.
* Aggregate on the fly:

```sql
SELECT mean(value) FROM cpu_user WHERE cpu=cpu6 GROUP BY time(5m)
```
* Store and query hundreds of thousands of series, filtering by tags:

```sql
SELECT mean(value) FROM cpu
    WHERE region="uswest" AND az="1" AND server="server01"
    GROUP BY time(30s)
```

* Merge multiple series together:

```sql
SELECT mean(value) FROM /cpu.*/ WHERE time > now() - 1h GROUP BY time(30m)
```

There's much more, have a look at the [getting started guide](getting_started.html) to see some examples.

## Design Goals

Here are some goals we have as we're building InfluxDB:

* Stores metrics data (like response times and cpu load. i.e. what you'd put into Graphite).
* Stores events data (like exceptions, user analytics, or business analytics).
* HTTP(S) interface for reading and writing data. Shouldn't require additional server code to be useful directly from the browser.
* Security model that will enable user facing analytics dashboards connecting directly to the HTTP API.
* Horizontally scalable.
* On disk and in memory. It shouldn't require a cluster of machines keeping everything in memory since most analytics data is cold most of the time.
* Simple to install and manage. Shouldn't require setting up external dependencies like Zookeeper and Hadoop.
* Compute percentiles and other functions on the fly.
* Downsample data on different windows of time.
* Can efficiently and automatically clear out raw data daily to free up space. Database managed retention policies.
* Should be able to add on custom real-time and batch analytics processing.
* Expand storage by adding servers to a cluster. Should make node replacement quick and easy.
* Automatically compute common queries continuously in the background.
