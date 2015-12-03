---
title: Overview
---

InfluxDB is a time series, metrics, and analytics database. It's written in Go and has no external dependencies. That means once you install it there's nothing else to manage (like Redis, ZooKeeper, HBase, or whatever).

InfluxDB is targeted at use cases for DevOps, metrics, sensor data, and real-time analytics. It arose from our need for a database like this on more than a few previous products we've built. You can [read more about our journey from SaaS application to open source time series database](/blog/2014/09/26/one-year-of-influxdb-and-the-road-to-1_0.html).

## Key Features

Here are some of the features that InfluxDB currently supports that make it a great choice for working with time series data.

* SQL like query language
* HTTP(S) API
* Store billions of data points
* Database managed retention policies for data
* Built in management interface
* Aggregate on the fly:

```sql
select mean(value) from cpu group by time(5m)
```
* Pre-aggregate in the database:

```sql
select mean(value) from cpu group by time(5m) into 5m.cpu.mean
-- after that you can select from the composed series
select * from "5m.cpu.mean" where time > now() - 4h
```
* Store hundreds of thousands of series:

```sql
select mean(value) from "region.uswest.az.1.serverA.cpu"
group by time(30s)
```

* Merge multiple series together:

```sql
select mean(value) from merge(/.*az\.1.*\.cpu/) group by time(1h)
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
