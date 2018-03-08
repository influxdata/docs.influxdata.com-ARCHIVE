---
title: Time Series Index (TSI) details

menu:
  influxdb_1_5:
    name: Time Series Index (TSI) details
    weight: 80
    parent: concepts
---

## Time Series Index (TSI) description

When InfluxDB ingests data, we store not only the value but we also index the measurement and tag information so that it can be queried quickly.
In earlier versions, index data could only be stored in-memory, however, that requires a lot of RAM and places an upper bound on the number of series a machine can hold.
This upper bound is usually somewhere between 1 - 4 million series depending on the machine used.

The Time Series Index (TSI) was developed to allow us to go past that upper bound.
TSI stores index data on disk so that we are no longer restricted by RAM.
TSI uses the operating system's page cache to pull hot data into memory and let cold data rest on disk.

There are currently limits in TSM and the query engine which restrict the number of series you should practically store on a node.
This practical upper bound is usually around 30 million series.

## Tooling

### `influx_inspect dumptsi`

If you are troubleshooting an issue with an index, you can use the `influx_inspect dumptsi` command.
This command allows you to print summary statistics on an index, file, or a set of files.
This command only works on one index at a time.

For details on this command, see [influx_inspect dumptsi](/influxdb/v1.5/tools/influx_inspect/#influx_inspect-dumptsi)

### `influx_inspect buildtsi`

If you want to convert an existing shard from an in-memory index to a TSI index, or if you have an existing TSI index which has become corrupt, you can use the `buildtsi` command to create the index from the underlying TSM data.
If you have an existing TSI index that you want to rebuild, first delete the `index` directory within your shard.

This command works at the server-level but you can optionally add database, retention policy and shard filters to only apply to a subset of shards.

For details on this command, see [influx inspect buildtsi](/influxdb/v1.5/tools/influx_inspect/#influx_inspect-buildtsi)


## Understanding TSI

### File organization

TSI (Time Series Index) is a log-structured merge tree-based database for InfluxDB series data.
TSI is composed of several parts:

* **Index**: Contains the entire index dataset for a single shard.

* **Partition**: Contains a sharded partition of the data for a shard.

* **LogFile**: Contains newly written series as an in-memory index and is persisted as a WAL.

* **IndexFile**: Contains an immutable, memory-mapped index built from a LogFile or merged from two contiguous index files.

There is also a **SeriesFile** which contains a set of all series keys across the entire database.
Each shard within the database shares the same series file.

### Writes

The following occurs when a write comes into the system:

1. Series is added to the series file or is looked up if it already exists. This returns an auto-incrementing series ID.
2. The series is sent to the Index. The index maintains a roaring bitmap of existing series IDs and ignores series that have already been created.
3. The series is hashed and sent to the appropriate Partition.
4. The Partition writes the series as an entry to the LogFile.
5. The LogFile writes the series to a write-ahead log file on disk and adds the series to a set of in-memory indexes.

### Compaction

Once the LogFile exceeds a threshold (5MB), then a new active log file is created and the previous one begins compacting into an IndexFile.
This first index file is at level 1 (L1).
The log file is considered level 0 (L0).

Index files can also be created by merging two smaller index files together.
For example, if contiguous two L1 index files exist then they can be merged into an L2 index file.

### Reads

The index provides several API calls for retrieving sets of data such as:

* `MeasurementIterator()`: Returns a sorted list of measurement names.
* `TagKeyIterator()`: Returns a sorted list of tag keys in a measurement.
* `TagValueIterator()`: Returns a sorted list of tag values for a tag key.
* `MeasurementSeriesIDIterator()`: Returns a sorted list of all series IDs for a measurement.
* `TagKeySeriesIDIterator()`: Returns a sorted list of all series IDs for a tag key.
* `TagValueSeriesIDIterator()`: Returns a sorted list of all series IDs for a tag value.

These iterators are all composable using several merge iterators.
For each type of iterator (measurement, tag key, tag value, series id), there are multiple merge iterator types:

* **Merge**: Deduplicates items from two iterators.
* **Intersect**: Returns only items that exist in two iterators.
* **Difference**: Only returns items from first iterator that don't exist in the second iterator.

For example, a query with a WHERE clause of `region != 'us-west'` that operates across two shards will construct a set of iterators like this:

```
DifferenceSeriesIDIterators(
    MergeSeriesIDIterators(
        Shard1.MeasurementSeriesIDIterator("m"),
        Shard2.MeasurementSeriesIDIterator("m"),
    ),
    MergeSeriesIDIterators(
        Shard1.TagValueSeriesIDIterator("m", "region", "us-west"),
        Shard2.TagValueSeriesIDIterator("m", "region", "us-west"),
    ),
)
```

### Log File Structure

The log file is simply structured as a list of LogEntry objects written to disk in sequential order. Log files are written until they reach 5MB and then they are compacted into index files.
The entry objects in the log can be of any of the following types:

* AddSeries
* DeleteSeries
* DeleteMeasurement
* DeleteTagKey
* DeleteTagValue

The in-memory index on the log file tracks the following:

* Measurements by name
* Tag keys by measurement
* Tag values by tag key
* Series by measurement
* Series by tag value
* Tombstones for series, measurements, tag keys, and tag values.

The log file also maintains bitsets for series ID existence and tombstones.
These bitsets are merged with other log files and index files to regenerate the full index bitset on startup.

### Index File Structure

The index file is an immutable file that tracks similar information to the log file, but all data is indexed and written to disk so that it can be directly accessed from a memory-map.

The index file has the following sections:

* **TagBlocks:** Maintains an index of tag values for a single tag key.
* **MeasurementBlock:** Maintains an index of measurements and their tag keys.
**Trailer:** Stores offset information for the file as well as HyperLogLog sketches for cardinality estimation.

### Manifest

The MANIFEST file is stored the index directory and lists all the files that belong to the index and the order in which they should be accessed.
This file is updated every time a compaction occurs.
Any files that are in the directory that are not in the index file are index files that are in the process of being compacted.

### FileSet

A file set is an in-memory snapshot of the manifest that is obtained while the InfluxDB process is running.
This is required to provide a consistent view of the index at a point-in-time.
The file set also facilitates reference counting for all of its files so that no file will be deleted via compaction until all readers of the file are done with it.
