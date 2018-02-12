---
title: TSI

menu:
  influxdb_1_5:
    name: TSI
    weight: 90
    parent: concepts
---

## Time Series Index (TSI)

Influx... In order to support a large number of time series, that is, a very high cardinality in the number of unique time series that the database stores.
InfluxData supports customers using InfluxDB with tens of millions of time series. InfluxData's goal, however, is to expand to hundreds of millions, and eventually billions.
Using InfluxData's TSI storage engine now, users should be able to have millions of unique time series.
The goal is that the number of series should be unbounded by the amount of memory on the server hardware.
Importantly, the number of series that exist in the database will have a negligible impact on database startup time.
This work has been in the making since last August and represents the most significant technical advancement in the database since InfluxData released the Time Series Merge Tree (TSM) storage engine in 2016.

Before getting into details, here is some background information.

InfluxDB actually looks like two databases in one

* time series data store
* inverted index for the measurement, tag, and field metadata

### Time series data store

The TSM engine that InfluxData built in 2015 and continued woerking on in 2016 was an effort to solve the first problem: getting maximum throughput, compression, and query speed for raw time series data. Up until now the inverted index was an in-memory data structure that was built during startup of the database based on the data in TSM. This meant that for every measurement, tag key/value pair, and field name there was a lookup table in memory to map those bits of metadata to an underlying time series. For users with a high number ephemeral series they’d see their memory utilization go up and up as new time series got created. Further, startup times would increase as all that data would have to be loaded onto the heap at start time.

### Time series index (TSI)

The new time series index (TSI) moves the index to files on disk that we memory map. This means that we let the operating system handle being the Least Recently Used (LRU) memory. Much like the TSM engine for raw time series data we have a write-ahead log with an in-memory structure that gets merged at query time with the memory-mapped index. Background routines run constantly to compact the index into larger and larger files to avoid having to do too many index merges at query time. Under the covers, we’re using techniques like Robin Hood Hashing to do fast index lookups and HyperLogLog++ to keep sketches of cardinality estimates. The latter will give us the ability to add things to the query languages like SHOW CARDINALITY queries.

### Issues solvied by TSI and remaining to be solved


The primary issue that Time Series Index (TSI) is intended to address is that of ephemeral time series. Most frequently, this occurs in use cases that want to track per process metrics or per container metrics by putting identifiers in tags. For example, the [Heapster project for Kubernetes](https://github.com/kubernetes/heapster) does this. For series that are no longer hot for writes or queries, they won’t take up space in memory.

The issue that the Heapster project and similar use cases did not address is limiting the scope of data returned by the SHOW queries. We’ll have updates to the query language in the future to limit those results by time. We also don’t solve the problem of having all these series hot for reads and writes. For that problem scale-out clustering is the solution. We’ll have to continue to optimize the query language and engine to work with large sets of series. The biggest thing to address in the near term is that queries that hit all series in the DB could potentially blow out the memory usage. We’ll need to add guard rails and limits into the language and eventually spill-to-disk query processing. That work will be on-going in every release of InfluxDB.

## Enabling TSI (Time Series Index)

The new Time Series Index (TSI) engine is disabled by default.

To enable the Time Series Index (TSI):

1. Edit the configuration file (`influxdb.config`) so that the TSI configuration option is enabled.
  - Locate the data section of the file and enable TSI:
    - `index-version = "tsi1"`

2. Restart the database.

* Existing shards will continue to use the in-memory index.
* New shards will use the new disk-based TSI (time series index) indexing.

> ***Note:*** To verify that you’re using disk-based indexing, write some data and then look at your `data/<database>/<retention policy>/<shard id>` directory. You should see a subdirectory called `index`.
