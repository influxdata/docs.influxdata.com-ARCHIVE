---
title: Clustering Design
---

The current clustering implementation is experimental and we're completely reworking it for the next major release (either 0.9 or 0.10). However, there are a few things that will remain the same in the new implementation.

## How Data is Distributed

Shards are distributed throughout an InfluxDB cluster. A shard holds the data for any number of time series for a contiguous block of time. The length of time and which series are mapped to a shard is determined by the [shard spaces](../advanced_topics/sharding_and_storage.html#databases-and-shard-spaces).

Currently, if you want to distribute data across a cluster, you need to set the split on your shard spaces to be > 1. The ideal number for split is probably `number_of_servers / replication_factor`. Later releases will remove the split setting completely and automatically distribute data for you.

Shards are created for each new block of time. Say you have a replication factor of 3 and a split of 4 and shard durations of 7 days. At the beginning of a new 7 day period we'd create 4 shards and make sure each shard exists on 3 different servers. So if we have a cluster of 12 machines, each one would get a shard.

## Locating a series in a cluster

The algorithm for determining where the data for a series lives in a cluster is very simple.

1. For the time period, look up the shards (if split is 1 there will be 1 shard. If 2, 2, etc.)
2. Hash the series name % number of shards
3. Use that shard index to get the shard

## Write Hot Spots

You may have noticed that all the data for a given series for a block of time will end up mapping itself to a single server (or replication group). The way to scale data ingest in InfluxDB is to create many series. You can later combine these together at query time through `merge` queries.

If you have an event stream with many thousands of events per second, a simple way to distribute it out is just to do something like `events. + random(10)` so you'd split it into 10 different series that can be merged together at query time.