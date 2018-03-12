---
title: TSM-based data storage and in-memory indexing

menu:
  influxdb_1_5:
    name: TSM and in-memory indexing
    weight: 60
    parent: concepts
---

> ***Note:***



# The InfluxDB storage engine and the Time-Structured Merge Tree (TSM)

The InfluxDB storage engine looks very similar to a LSM Tree.
It has a write ahead log and a collection of read-only data files which are  similar in concept to SSTables in an LSM Tree.
TSM files contain sorted, compressed series data.

InfluxDB will create a [shard](/influxdb/v1.5/concepts/glossary/#shard) for each block of time.
For example, if you have a [retention policy](/influxdb/v1.5/concepts/glossary/#retention-policy) with an unlimited duration, shards will be created for each 7 day block of time.
Each of these shards maps to an underlying storage engine database.
Each of these databases has its own [WAL](/influxdb/v1.5/concepts/glossary/#wal-write-ahead-log) and TSM files.

We'll dig into each of these parts of the storage engine.

## Storage engine

The storage engine ties a number of components together and provides the external interface for storing and querying series data. It is composed of a number of components that each serve a particular role:

* In-Memory Index - The in-memory index is a shared index across shards that provides the quick access to [measurements](/influxdb/v1.5/concepts/glossary/#measurement), [tags](/influxdb/v1.5/concepts/glossary/#tags), and [series](/influxdb/v1.5/concepts/glossary/#series).  The index is used by the engine, but is not specific to the storage engine itself.
* WAL - The WAL is a write-optimized storage format that allows for writes to be durable, but not easily queryable.  Writes to the WAL are appended to segments of a fixed size.
* Cache - The Cache is an in-memory representation of the data stored in the WAL.  It is queried at runtime and merged with the data stored in TSM files.
* TSM Files - TSM files store compressed series data in a columnar format.
* FileStore - The FileStore mediates access to all TSM files on disk.  It ensures that TSM files are installed atomically when existing ones are replaced as well as removing TSM files that are no longer used.
* Compactor - The Compactor is responsible for converting less optimized Cache and TSM data into more read-optimized formats.  It does this by compressing series, removing deleted data, optimizing indices and combining smaller files into larger ones.
* Compaction Planner - The Compaction Planner determines which TSM files are ready for a compaction and ensures that multiple concurrent compactions do not interfere with each other.
* Compression - Compression is handled by various Encoders and Decoders for specific data types.  Some encoders are fairly static and always encode the same type the same way; others switch their compression strategy based on the shape of the data.
* Writers/Readers - Each file type (WAL segment, TSM files, tombstones, etc..) has Writers and Readers for working with the formats.

### Write Ahead Log (WAL)

The WAL is organized as a bunch of files that look like `_000001.wal`.
The file numbers are monotonically increasing and referred to as WAL segments.
When a segment reaches 10MB in size, it is closed and a new one is opened.  Each WAL segment stores multiple compressed blocks of writes and deletes.

When a write comes in the new points are serialized, compressed using Snappy, and written to a WAL file.
The file is `fsync`'d and the data is added to an in-memory index before a success is returned.
This means that batching points together is required to achieve high throughput performance.
(Optimal batch size seems to be 5,000-10,000 points per batch for many use cases.)

Each entry in the WAL follows a [TLV standard](https://en.wikipedia.org/wiki/Type-length-value) with a single byte representing the type of entry (write or delete), a 4 byte `uint32` for the length of the compressed block, and then the compressed block.

### Cache

The Cache is an in-memory copy of all data points current stored in the WAL.
The points are organized by the key, which is the measurement, [tag set](/influxdb/v1.5/concepts/glossary/#tag-set), and unique [field](/influxdb/v1.5/concepts/glossary/#field).
Each field is kept as its own time-ordered range.
The Cache data is not compressed while in memory.

Queries to the storage engine will merge data from the Cache with data from the TSM files.
Queries execute on a copy of the data that is made from the cache at query processing time.
This way writes that come in while a query is running won't affect the result.

Deletes sent to the Cache will clear out the given key or the specific time range for the given key.

The Cache exposes a few controls for snapshotting behavior.
The two most important controls are the memory limits.
There is a lower bound, [`cache-snapshot-memory-size`](/influxdb/v1.5/administration/config/#cache-snapshot-memory-size-26214400), which when exceeded will trigger a snapshot to TSM files and remove the corresponding WAL segments.
There is also an upper bound, [`cache-max-memory-size`](/influxdb/v1.5/administration/config/#cache-max-memory-size-524288000), which when exceeded will cause the Cache to reject new writes.
These configurations are useful to prevent out of memory situations and to apply back pressure to clients writing data faster than the instance can persist it.
The checks for memory thresholds occur on every write.

The other snapshot controls are time based.
The idle threshold, [`cache-snapshot-write-cold-duration`](/influxdb/v1.5/administration/config/#cache-snapshot-write-cold-duration-1h0m0s), forces the Cache to snapshot to TSM files if it hasn't received a write within the specified interval.

The in-memory Cache is recreated on restart by re-reading the WAL files on disk.

### TSM files

TSM files are a collection of read-only files that are memory mapped.
The structure of these files looks very similar to an SSTable in LevelDB or other LSM Tree variants.

A TSM file is composed of four sections: header, blocks, index, and footer.

```
┌────────┬────────────────────────────────────┬─────────────┬──────────────┐
│ Header │               Blocks               │    Index    │    Footer    │
│5 bytes │              N bytes               │   N bytes   │   4 bytes    │
└────────┴────────────────────────────────────┴─────────────┴──────────────┘
```

The Header is a magic number to identify the file type and a version number.

```
┌───────────────────┐
│      Header       │
├─────────┬─────────┤
│  Magic  │ Version │
│ 4 bytes │ 1 byte  │
└─────────┴─────────┘
```

Blocks are sequences of pairs of CRC32 checksums and data.
The block data is opaque to the file.
The CRC32 is used for block level error detection.
The length of the blocks is stored in the index.

```
┌───────────────────────────────────────────────────────────┐
│                          Blocks                           │
├───────────────────┬───────────────────┬───────────────────┤
│      Block 1      │      Block 2      │      Block N      │
├─────────┬─────────┼─────────┬─────────┼─────────┬─────────┤
│  CRC    │  Data   │  CRC    │  Data   │  CRC    │  Data   │
│ 4 bytes │ N bytes │ 4 bytes │ N bytes │ 4 bytes │ N bytes │
└─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
```

Following the blocks is the index for the blocks in the file.
The index is composed of a sequence of index entries ordered lexicographically by key and then by time.
The key includes the measurement name, tag set, and one field.
Multiple fields per point creates multiple index entries in the TSM file.
Each index entry starts with a key length and the key, followed by the block type (float, int, bool, string) and a count of the number of index block entries that follow for that key.
Each index block entry is composed of the min and max time for the block, the offset into the file where the block is located and the size of the block. There is one index block entry for each block in the TSM file that contains the key.

The index structure can provide efficient access to all blocks as well as the ability to determine the cost associated with accessing a given key.
Given a key and timestamp, we can determine whether a file contains the block for that timestamp.
We can also determine where that block resides and how much data must be read to retrieve the block.
Knowing the size of the block, we can efficiently provision our IO statements.

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                   Index                                    │
├─────────┬─────────┬──────┬───────┬─────────┬─────────┬────────┬────────┬───┤
│ Key Len │   Key   │ Type │ Count │Min Time │Max Time │ Offset │  Size  │...│
│ 2 bytes │ N bytes │1 byte│2 bytes│ 8 bytes │ 8 bytes │8 bytes │4 bytes │   │
└─────────┴─────────┴──────┴───────┴─────────┴─────────┴────────┴────────┴───┘
```

The last section is the footer that stores the offset of the start of the index.

```
┌─────────┐
│ Footer  │
├─────────┤
│Index Ofs│
│ 8 bytes │
└─────────┘
```

### Compression

Each block is compressed to reduce storage space and disk IO when querying.
A block contains the timestamps and values for a given series and field.
Each block has one byte header, followed by the compressed timestamps and then the compressed values.

```
┌───────┬─────┬─────────────────┬──────────────────┐
│ Type  │ Len │   Timestamps    │      Values      │
│1 Byte │VByte│     N Bytes     │     N Bytes      │
└───────┴─────┴─────────────────┴──────────────────┘
```

The timestamps and values are compressed and stored separately using encodings dependent on the data type and its shape.
Storing them independently allows timestamp encoding to be used for all timestamps, while allowing different encodings for different field types.
For example, some points may be able to use run-length encoding whereas other may not.

Each value type also contains a 1 byte header indicating the type of compression for the remaining bytes.
The four high bits store the compression type and the four low bits are used by the encoder if needed.

#### Timestamps

Timestamp encoding is adaptive and based on the structure of the timestamps that are encoded.
It uses a combination of delta encoding, scaling, and compression using simple8b run-length encoding, as well as falling back to no compression if needed.

Timestamp resolution is variable but can be as granular as a nanosecond, requiring up to 8 bytes to store uncompressed.
During encoding, the values are first delta-encoded.
The first value is the starting timestamp and subsequent values are the differences from the prior value.
This usually converts the values into much smaller integers that are easier to compress.
Many timestamps are also monotonically increasing and fall on even boundaries of time such as every 10s.
When timestamps have this structure, they are scaled by the largest common divisor that is also a factor of 10.
This has the effect of converting very large integer deltas into smaller ones that compress even better.

Using these adjusted values, if all the deltas are the same, the time range is stored using run-length encoding.
If run-length encoding is not possible and all values are less than (1 << 60) - 1 ([~36.5 years](https://www.wolframalpha.com/input/?i=\(1+%3C%3C+60\)+-+1+nanoseconds+to+years) at nanosecond resolution), then the timestamps are encoded using [simple8b encoding](https://github.com/jwilder/encoding/tree/master/simple8b).
Simple8b encoding is a 64bit word-aligned integer encoding that packs multiple integers into a single 64bit word.
If any value exceeds the maximum the deltas are stored uncompressed using 8 bytes each for the block.
Future encodings may use a patched scheme such as Patched Frame-Of-Reference (PFOR) to handle outliers more effectively.

#### Floats

Floats are encoded using an implementation of the [Facebook Gorilla paper](http://www.vldb.org/pvldb/vol8/p1816-teller.pdf).
The encoding XORs consecutive values together to produce a small result when the values are close together.
The delta is then stored using control bits to indicate how many leading and trailing zeroes are in the XOR value.
Our implementation removes the timestamp encoding described in paper and only encodes the float values.

#### Integers

Integer encoding uses two different strategies depending on the range of values in the uncompressed data.
Encoded values are first encoded using [ZigZag encoding](https://developers.google.com/protocol-buffers/docs/encoding?hl=en#signed-integers).
This interleaves positive and negative integers across a range of positive integers.

For example, [-2,-1,0,1] becomes [3,1,0,2].
See Google's [Protocol Buffers documentation](https://developers.google.com/protocol-buffers/docs/encoding?hl=en#signed-integers) for more information.

If all ZigZag encoded values are less than (1 << 60) - 1, they are compressed using simple8b encoding.
If any values are larger than the maximum then all values are stored uncompressed in the block.
If all values are identical, run-length encoding is used.
This works very well for values that are frequently constant.

#### Booleans

Booleans are encoded using a simple bit packing strategy where each Boolean uses 1 bit.
The number of Booleans encoded is stored using variable-byte encoding at the beginning of the block.

#### Strings
Strings are encoding using [Snappy](http://google.github.io/snappy/) compression.
Each string is packed consecutively and they are compressed as one larger block.

### Compactions

Compactions are recurring processes that migrate data stored in a write-optimized format into a more read-optimized format.
There are a number of stages of compaction that take place while a shard is hot for writes:

* Snapshots - Values in the Cache and WAL must be converted to TSM files to free memory and disk space used by the WAL segments.
These compactions occur based on the cache memory and time thresholds.
* Level Compactions - Level compactions (levels 1-4) occur as the TSM files grow.
TSM files are compacted from snapshots to level 1 files.
Multiple level 1 files are compacted to produce level 2 files.
The process continues until files reach level 4 and the max size for a TSM file.
They will not be compacted further unless deletes, index optimization compactions, or full compactions need to run.
Lower level compactions use strategies that avoid CPU-intensive activities like decompressing and combining blocks.
Higher level (and thus less frequent) compactions will re-combine blocks to fully compact them and increase the compression ratio.
* Index Optimization - When many level 4 TSM files accumulate, the internal indexes become larger and more costly to access.
An index optimization compaction splits the series and indices across a new set of TSM files, sorting all points for a given series into one TSM file.
Before an index optimization, each TSM file contained points for most or all series, and thus each contains the same series index.
After an index optimzation, each TSM file contains points from a minimum of series and there is little series overlap between files.
Each TSM file thus has a smaller unique series index, instead of a duplicate of the full series list.
In addition, all points from a particular series are contiguous in a TSM file rather than spread across multiple TSM files.
* Full Compactions - Full compactions run when a shard has become cold for writes for long time, or when deletes have occurred on the shard.
Full compactions produce an optimal set of TSM files and include all optimizations from Level and Index Optimization compactions.
Once a shard is fully compacted, no other compactions will run on it unless new writes or deletes are stored.

### Writes

Writes are appended to the current WAL segment and are also added to the Cache.
Each WAL segment has a maximum size.
Writes roll over to a new file once the current file fills up.
The cache is also size bounded; snapshots are taken and WAL compactions are initiated when the cache becomes too full.
If the inbound write rate exceeds the WAL compaction rate for a sustained period, the cache may become too full, in which case new writes will fail until the snapshot process catches up.

When WAL segments fill up and are closed, the Compactor snapshots the Cache and writes the data to a new TSM file.
When the TSM file is successfully written and `fsync`'d, it is loaded and referenced by the FileStore.

### Updates

Updates (writing a newer value for a point that already exists) occur as normal writes.
Since cached values overwrite existing values, newer writes take precedence.
If a write would overwrite a point in a prior TSM file, the points are merged at query runtime and the newer write takes precedence.


### Deletes

Deletes occur by writing a delete entry to the WAL for the measurement or series and then updating the Cache and FileStore.
The Cache evicts all relevant entries.
The FileStore writes a tombstone file for each TSM file that contains relevant data.
These tombstone files are used at startup time to ignore blocks as well as during compactions to remove deleted entries.

Queries against partially deleted series are handled at query time until a compaction removes the data fully from the TSM files.

### Queries

When a query is executed by the storage engine, it is essentially a seek to a given time associated with a specific series key and field.
First, we do a search on the data files to find the files that contain a time range matching the query as well containing matching series.

Once we have the data files selected, we next need to find the position in the file of the series key index entries.
We run a binary search against each TSM index to find the location of its index blocks.

In common cases the blocks will not overlap across multiple TSM files and we can search the index entries linearly to find the start block from which to read.
If there are overlapping blocks of time, the index entries are sorted to ensure newer writes will take precedence and that blocks can be processed in order during query execution.

When iterating over the index entries the blocks are read sequentially from the blocks section.
The block is decompressed and we seek to the specific point.


# The new InfluxDB storage engine: from LSM Tree to B+Tree and back again to create the Time Structured Merge Tree

Writing a new storage format should be a last resort.
So how did InfluxData end up writing our own engine?
InfluxData has experimented with many storage formats and found each lacking in some fundamental way.
The performance requirements for InfluxDB are significant, and eventually overwhelm other storage systems.
The 0.8 line of InfluxDB allowed multiple storage engines, including LevelDB, RocksDB, HyperLevelDB, and LMDB.
The 0.9 line of InfluxDB used BoltDB as the underlying storage engine.
This writeup is about the Time Structured Merge Tree storage engine that was released in 0.9.5 and is the only storage engine supported in InfluxDB 0.11+, including the entire 1.x family.

The properties of the time series data use case make it challenging for many existing storage engines.
Over the course of InfluxDB's development we've tried a few of the more popular options.
We started with LevelDB, an engine based on LSM Trees, which are optimized for write throughput.
After that we tried BoltDB, an engine based on a memory mapped B+Tree, which is optimized for reads.
Finally, we ended up building our own storage engine that is similar in many ways to LSM Trees.

With our new storage engine we were able to achieve up to a 45x reduction in disk space usage from our B+Tree setup with even greater write throughput and compression than what we saw with LevelDB and its variants.
This post will cover the details of that evolution and end with an in-depth look at our new storage engine and its inner workings.

## Properties of Time Series Data

The workload of time series data is quite different from normal database workloads.
There are a number of factors that conspire to make it very difficult to scale and remain performant:

* Billions of individual data points
* High write throughput
* High read throughput
* Large deletes (data expiration)
* Mostly an insert/append workload, very few updates

The first and most obvious problem is one of scale.
In DevOps, IoT, or APM it is easy to collect hundreds of millions or billions of unique data points every day.

For example, let's say we have 200 VMs or servers running, with each server collecting an average of 100 measurements every 10 seconds.
Given there are 86,400 seconds in a day, a single measurement will generate 8,640 points in a day, per server.
That gives us a total of 200 * 100 * 8,640 = 172,800,000 individual data points per day.
We find similar or larger numbers in sensor data use cases.

The volume of data means that the write throughput can be very high.
We regularly get requests for setups than can handle hundreds of thousands of writes per second.
Some larger companies will only consider systems that can handle millions of writes per second.

At the same time, time series data can be a high read throughput use case.
It's true that if you're tracking 700,000 unique metrics or time series you can't hope to visualize all of them.
That leads many people to think that you don't actually read most of the data that goes into the database.
However, other than dashboards that people have up on their screens, there are automated systems for monitoring or combining the large volume of time series data with other types of data.

Inside InfluxDB, aggregate functions calculated on the fly may combine tens of thousands of distinct time series into a single view.
Each one of those queries must read each aggregated data point, so for InfluxDB the read throughput is often many times higher than the write throughput.

Given that time series is mostly an append-only workload, you might think that it's possible to get great performance on a B+Tree.
Appends in the keyspace are efficient and you can achieve greater than 100,000 per second.
However, we have those appends happening in individual time series.
So the inserts end up looking more like random inserts than append only inserts.

One of the biggest problems we found with time series data is that it's very common to delete all data after it gets past a certain age.
The common pattern here is that users have high precision data that is kept for a short period of time like a few days or months.
Users then downsample and aggregate that data into lower precision rollups that are kept around much longer.

The naive implementation would be to simply delete each record once it passes its expiration time.
However, that means that once the first points written reach their expiration date, the system is processing just as many deletes as writes, which is something most storage engines aren't designed for.

Let's dig into the details of the two types of storage engines we tried and how these properties had a significant impact on our performance.

## LevelDB and Log Structured Merge Trees

When the InfluxDB project began, we picked LevelDB as the storage engine because we had used it for time series data storage in the product that was the precursor to InfluxDB.
We knew that it had great properties for write throughput and everything seemed to "just work".

LevelDB is an implementation of a Log Structured Merge Tree (or LSM Tree) that was built as an open source project at Google.
It exposes an API for a key/value store where the key space is sorted.
This last part is important for time series data as it allowed us to quickly scan ranges of time as long as the timestamp was in the key.

LSM Trees are based on a log that takes writes and two structures known as Mem Tables and SSTables.
These tables represent the sorted keyspace.
SSTables are read only files that are continuously replaced by other SSTables that merge inserts and updates into the keyspace.

The two biggest advantages that LevelDB had for us were high write throughput and built in compression.
However, as we learned more about what people needed with time series data, we encountered a few insurmountable challenges.

The first problem we had was that LevelDB doesn't support hot backups.
If you want to do a safe backup of the database, you have to close it and then copy it.
The LevelDB variants RocksDB and HyperLevelDB fix this problem, but there was another more pressing problem that we didn't think they could solve.

Our users needed a way to automatically manage data retention.
That meant we needed deletes on a very large scale.
In LSM Trees, a delete is as expensive, if not more so, than a write.
A delete writes a new record known as a tombstone.
After that queries merge the result set with any tombstones to purge the deleted data from the query return.
Later, a compaction runs that removes the tombstone record and the underlying deleted record in the SSTable file.

To get around doing deletes, we split data across what we call shards, which are contiguous blocks of time.
Shards would typically hold either one day or seven days worth of data.
Each shard mapped to an underlying LevelDB.
This meant that we could drop an entire day of data by just closing out the database and removing the underlying files.

Users of RocksDB may at this point bring up a feature called ColumnFamilies.
When putting time series data into Rocks, it's common to split blocks of time into column families and then drop those when their time is up.
It's the same general idea: create a separate area where you can just drop files instead of updating indexes when you delete a large block of data.
Dropping a column family is a very efficient operation.
However, column families are a fairly new feature and we had another use case for shards.

Organizing data into shards meant that it could be moved within a cluster without having to examine billions of keys.
At the time of this writing, it was not possible to move a column family in one RocksDB to another.
Old shards are typically cold for writes so moving them around would be cheap and easy.
We would have the added benefit of having a spot in the keyspace that is cold for writes so it would be easier to do consistency checks later.

The organization of data into shards worked great for a while, until a large amount of data went into InfluxDB.
LevelDB splits the data out over many small files.
Having dozens or hundreds of these databases open in a single process ended up creating a big problem.
Users that had six months or a year of data would run out of file handles.
It's not something we found with the majority of users, but anyone pushing the database to its limits would hit this problem and we had no fix for it.
There were simply too many file handles open.

## BoltDB and mmap B+Trees

After struggling with LevelDB and its variants for a year we decided to move over to BoltDB, a pure Golang database heavily inspired by LMDB, a mmap B+Tree database written in C.
It has the same API semantics as LevelDB: a key value store where the keyspace is ordered.
Many of our users were surprised.
Our own posted tests of the LevelDB variants vs. LMDB (a mmap B+Tree) showed RocksDB as the best performer.

However, there were other considerations that went into this decision outside of the pure write performance.
At this point our most important goal was to get to something stable that could be run in production and backed up.
BoltDB also had the advantage of being written in pure Go, which simplified our build chain immensely and made it easy to build for other OSes and platforms.

The biggest win for us was that BoltDB used a single file as the database.
At this point our most common source of bug reports were from people running out of file handles.
Bolt solved the hot backup problem and the file limit problems all at the same time.

We were willing to take a hit on write throughput if it meant that we'd have a system that was more reliable and stable that we could build on.
Our reasoning was that for anyone pushing really big write loads, they'd be running a cluster anyway.

We released versions 0.9.0 to 0.9.2 based on BoltDB.
From a development perspective it was delightful.
Clean API, fast and easy to build in our Go project, and reliable.
However, after running for a while we found a big problem with write throughput.
After the database got over a few GB, writes would start spiking IOPS.

Some users were able to get past this by putting InfluxDB on big hardware with near unlimited IOPS.
However, most users are on VMs with limited resources in the cloud.
We had to figure out a way to reduce the impact of writing a bunch of points into hundreds of thousands of series at a time.

With the 0.9.3 and 0.9.4 releases our plan was to put a write ahead log (WAL) in front of Bolt.
That way we could reduce the number of random insertions into the keyspace.
Instead, we'd buffer up multiple writes that were next to each other and then flush them at once.
However, that only served to delay the problem.
High IOPS still became an issue and it showed up very quickly for anyone operating at even moderate work loads.

However, our experience building the first WAL implementation in front of Bolt gave us the confidence we needed that the write problem could be solved.
The performance of the WAL itself was fantastic, the index simply could not keep up.
At this point we started thinking again about how we could create something similar to an LSM Tree that could keep up with our write load.

Thus was born the Time Structured Merge Tree.
