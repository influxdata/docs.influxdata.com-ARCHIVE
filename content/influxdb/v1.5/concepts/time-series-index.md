---
title: TSI (Time Series Index) overview

menu:
  influxdb_1_5:
    name: TSI (Time Series Index) overview
    weight: 100
    parent: concepts
---

## TSI (Time Series Index)

In order to support a large number of time series, that is, a very high cardinality in the number of unique time series that the database stores, InfluxData has added the new Time Series Index (TSI).
InfluxData supports customers using InfluxDB with tens of millions of time series.
InfluxData's goal, however, is to expand to hundreds of millions, and eventually billions.
Using InfluxData's TSI storage engine, users should be able to have millions of unique time series.
The goal is that the number of series should be unbounded by the amount of memory on the server hardware.
Importantly, the number of series that exist in the database will have a negligible impact on database startup time.
This work has been in the making since last August and represents the most significant technical advancement in the database since InfluxData released the Time Series Merge Tree (TSM) storage engine in 2016.

## Background information

InfluxDB actually looks like two databases in one, a time series data store and an inverted index for the measurement, tag, and field metadata.

### Time-Structured Merge Tree (TSM)

The Time-Structured Merge Tree (TSM) engine that InfluxData built in 2015 and continued enhancing in 2016 was an effort to solve the problem of getting maximum throughput, compression, and query speed for raw time series data.
Up until TSI, the inverted index was an in-memory data structure that was built during startup of the database based on the data in TSM.
This meant that for every measurement, tag key/value pair, and field name, there was a lookup table in-memory to map those bits of metadata to an underlying time series.
For users with a high number of ephemeral series, memory utilization continued increasing as new time series were created.
And, startup times increased since all of that data would have to be loaded onto the heap at start time.

>> For details, see

### Time series index (TSI)

The new time series index (TSI) moves the index to files on disk that we memory map.
This means that we let the operating system handle being the Least Recently Used (LRU) memory.
Much like the TSM engine for raw time series data we have a write-ahead log with an in-memory structure that gets merged at query time with the memory-mapped index.
Background routines run constantly to compact the index into larger and larger files to avoid having to do too many index merges at query time.
Under the covers, we’re using techniques like Robin Hood Hashing to do fast index lookups and HyperLogLog++ to keep sketches of cardinality estimates.
The latter will give us the ability to add things to the query languages like the [SHOW CARDINALITY](/influxdb/v1.5/query-language/spec#show-cardinality) queries.

### Issues solved by TSI and remaining to be solved

The primary issue that Time Series Index (TSI) addresses is ephemeral time series. Most frequently, this occurs in use cases that want to track per process metrics or per container metrics by putting identifiers in tags. For example, the [Heapster project for Kubernetes](https://github.com/kubernetes/heapster) does this. For series that are no longer hot for writes or queries, they won’t take up space in memory.

The issue that the Heapster project and similar use cases did not address is limiting the scope of data returned by the SHOW queries. We’ll have updates to the query language in the future to limit those results by time. We also don’t solve the problem of having all these series hot for reads and writes. For that problem, scale-out clustering is the solution. We’ll have to continue to optimize the query language and engine to work with large sets of series. We’ll need to add guard rails and limits into the language and eventually, add spill-to-disk query processing. That work will be on-going in every release of InfluxDB.
