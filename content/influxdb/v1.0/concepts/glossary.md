---
title: Glossary of Terms
menu:
  influxdb_1_0:
    weight: 10
    parent: concepts
---

## aggregation
An InfluxQL function that returns an aggregated value across a set of points.
See [InfluxQL Functions](/influxdb/v1.0/query_language/functions/#aggregations) for a complete list of the available and upcoming aggregations.

Related entries: [function](/influxdb/v1.0/concepts/glossary/#function), [selector](/influxdb/v1.0/concepts/glossary/#selector), [transformation](/influxdb/v1.0/concepts/glossary/#transformation)

## batch
A collection of points in line protocol format, separated by newlines (`0x0A`).
A batch of points may be submitted to the database using a single HTTP request to the write endpoint.
This makes writes via the HTTP API much more performant by drastically reducing the HTTP overhead.
InfluxData recommends batch sizes of 5,000-10,000 points, although different use cases may be better served by significantly smaller or larger batches.

Related entries: [line protocol](/influxdb/v1.0/concepts/glossary/#line-protocol), [point](/influxdb/v1.0/concepts/glossary/#point)

## continuous query (CQ)
An InfluxQL query that runs automatically and periodically within a database.
Continuous queries require a function in the `SELECT` clause and must include a `GROUP BY time()` clause.
See [Continuous Queries](/influxdb/v1.0/query_language/continuous_queries/).


Related entries: [function](/influxdb/v1.0/concepts/glossary/#function)

## database
A logical container for users, retention policies, continuous queries, and time series data.

Related entries: [continuous query](/influxdb/v1.0/concepts/glossary/#continuous-query-cq), [retention policy](/influxdb/v1.0/concepts/glossary/#retention-policy-rp), [user](/influxdb/v1.0/concepts/glossary/#user)

## duration
The attribute of the retention policy that determines how long InfluxDB stores data.
Data older than the duration are automatically dropped from the database.
See [Database Management](/influxdb/v1.0/query_language/database_management/#create-retention-policies-with-create-retention-policy) for how to set duration.

Related entries: [retention policy](/influxdb/v1.0/concepts/glossary/#retention-policy-rp)

## field
The key-value pair in InfluxDB's data structure that records metadata and the actual data value.
Fields are required in InfluxDB's data structure.

Related entries: [field key](/influxdb/v1.0/concepts/glossary/#field-key), [field set](/influxdb/v1.0/concepts/glossary/#field-set), [field value](/influxdb/v1.0/concepts/glossary/#field-value), [tag](/influxdb/v1.0/concepts/glossary/#tag)

## field key
The key part of the key-value pair that makes up a field.
Field keys are strings and they store metadata.
Field keys are indexed.

Related entries:
[field](#field),
[field set](#field_set),
[field value](#field-value),
[series](#series),
[tag key](#tag-key)

## field set
The collection of field keys and field values on a point.

Related entries: [field](/influxdb/v1.0/concepts/glossary/#field), [field key](/influxdb/v1.0/concepts/glossary/#field-key), [field value](/influxdb/v1.0/concepts/glossary/#field-value), [point](/influxdb/v1.0/concepts/glossary/#point)  

## field value  
The value part of the key-value pair that makes up a field.
Field values are the actual data; they can be strings, floats, integers, or booleans.
A field value is always associated with a timestamp.

Field values are not indexed - queries on field values scan all points that match the specified time range and, as a result, are not as performant as queries on tag values.

*Query tip:* Compare field values to tag values; tag values are indexed.

Related entries: [field](/influxdb/v1.0/concepts/glossary/#field), [field key](/influxdb/v1.0/concepts/glossary/#field-key), [field set](/influxdb/v1.0/concepts/glossary/#field-set), [tag value](/influxdb/v1.0/concepts/glossary/#tag-value), [timestamp](/influxdb/v1.0/concepts/glossary/#timestamp)

## function
InfluxQL aggregations, selectors, and transformations.
See [InfluxQL Functions](/influxdb/v1.0/query_language/functions/) for a complete list of InfluxQL functions.

Related entries: [aggregation](/influxdb/v1.0/concepts/glossary/#aggregation), [selector](/influxdb/v1.0/concepts/glossary/#selector), [transformation](/influxdb/v1.0/concepts/glossary/#transformation)  

## identifier
Tokens which refer to database names, retention policy names, user names, measurement names, tag keys, and field keys.
See [Query Language Specification](/influxdb/v1.0/query_language/spec/#identifiers).

Related entries: [database](/influxdb/v1.0/concepts/glossary/#database), [field key](/influxdb/v1.0/concepts/glossary/#field-key), [measurement](/influxdb/v1.0/concepts/glossary/#measurement), [retention policy](/influxdb/v1.0/concepts/glossary/#retention-policy-rp), [tag key](/influxdb/v1.0/concepts/glossary/#tag-key), [user](/influxdb/v1.0/concepts/glossary/#user)

## line protocol
The text based format for writing points to InfluxDB. See [Line Protocol](/influxdb/v1.0/write_protocols/line/).

## measurement  
The part of InfluxDB's structure that describes the data stored in the associated fields.
Measurements are strings.

Related entries:
[field](#field),
[metaseries](#metaseries),
[series](#series)

## metaseries
The collection of data in InfluxDB's data structure that share a measurement and tag set.

The sample data below has three metaseries:

| Arbitrary metaseries number | Measurement        | Tag set    |
| :-------------------------- | :----------------- |:-----------|
| metaseries 1                | `measurement_name` | `tag_key_1 = alpha`,`tagkey_2 = true` |
| metaseries 2                | `measurement_name` | `tag_key_1 = alpha`,`tagkey_2 = false` |
| metaseries 3                | `measurement_name` | `tag_key_1 = beta`,`tagkey_2 = true` |

Sample data:
```
name: measurement_name
--------------
time                   field_key_1   field_key_2  tag_key_1   tag_key_2
2015-08-18T00:00:00Z   2             18           alpha       true     
2015-08-18T00:00:10Z   3             76           alpha       false
2015-08-18T00:00:20Z   3             58           beta        true
2015-08-18T00:00:30Z   5                          beta        true
```

Related entries:
[measurement](#measurement),
[series](#series),
[tag set](#tag-set)

## metastore
Contains internal information about the status of the system. That includes user information, database and shard metadata, and which retention policies are enabled.

Related entries: [database](/influxdb/v1.0/concepts/glossary/#database), [retention policy](/influxdb/v1.0/concepts/glossary/#retention-policy-rp), [user](/influxdb/v1.0/concepts/glossary/#user)

## node
An independent `influxd` process.

Related entries: [server](/influxdb/v1.0/concepts/glossary/#server)

## point   
The part of InfluxDB's data structure identified by its series and timestamp.

You cannot store more than one point with the same timestamp in the same series.
When you write a new point to the same series with the same timestamp, InfluxDB overwrites the existing the point with the new data.

Related entries: [field set](/influxdb/v1.0/concepts/glossary/#field-set), [series](/influxdb/v1.0/concepts/glossary/#series), [timestamp](/influxdb/v1.0/concepts/glossary/#timestamp)

## points per second
The preferred measurement of the rate at which data are persisted to InfluxDB.
Write speeds are generally quoted in points per second.

Related entries: [point](/influxdb/v1.0/concepts/glossary/#point), [schema](/influxdb/v1.0/concepts/glossary/#schema), [values per second](/influxdb/v1.0/concepts/glossary/#values-per-second)

## query
An operation that retrieves data from InfluxDB.
See [Data Exploration](/influxdb/v1.0/query_language/data_exploration/), [Schema Exploration](/influxdb/v1.0/query_language/schema_exploration/), [Database Management](/influxdb/v1.0/query_language/database_management/).

## replication factor  
The attribute of the retention policy that determines how many copies of the data are stored in the cluster.
InfluxDB replicates data across `N` data nodes, where `N` is the replication factor.

<dt> Replication factors do not serve a purpose with single node instances.
</dt>

Related entries: [duration](/influxdb/v1.0/concepts/glossary/#duration), [node](/influxdb/v1.0/concepts/glossary/#node), [retention policy](/influxdb/v1.0/concepts/glossary/#retention-policy-rp)

## retention policy (RP)
The part of InfluxDB's data structure that describes for how long InfluxDB keeps data (duration), how many copies of those data are stored in the cluster (replication factor), and the time range covered by shard groups (shard group duration).
RPs are unique per database.

When you create a database, InfluxDB automatically creates a retention policy called `autogen` with an infinite duration, a replication factor set to one or to the number of data nodes in the cluster, and a shard group duration set to seven days.
See [Database Management](/influxdb/v1.0/query_language/database_management/#retention-policy-management) for retention policy management.

<dt> Replication factors do not serve a purpose with single node instances.
</dt>

Related entries: [duration](/influxdb/v1.0/concepts/glossary/#duration), [measurement](/influxdb/v1.0/concepts/glossary/#measurement), [replication factor](/influxdb/v1.0/concepts/glossary/#replication-factor), [series](/influxdb/v1.0/concepts/glossary/#series), [tag set](/influxdb/v1.0/concepts/glossary/#tag-set)

## schema
How the data are organized in InfluxDB.
The fundamentals of the InfluxDB schema are databases, retention policies, series, measurements, tag keys, tag values, and field keys.
See [Schema Design](/influxdb/v1.0/concepts/schema_and_data_layout/) for more information.

Related entries: [database](/influxdb/v1.0/concepts/glossary/#database), [field key](/influxdb/v1.0/concepts/glossary/#field-key), [measurement](/influxdb/v1.0/concepts/glossary/#measurement), [retention policy](/influxdb/v1.0/concepts/glossary/#retention-policy-rp), [series](/influxdb/v1.0/concepts/glossary/#series), [tag key](/influxdb/v1.0/concepts/glossary/#tag-key), [tag value](/influxdb/v1.0/concepts/glossary/#tag-value)

## selector  
An InfluxQL function that returns a single point from the range of specified points.
See [InfluxQL Functions](/influxdb/v1.0/query_language/functions/#selectors) for a complete list of the available and upcoming selectors.

Related entries: [aggregation](/influxdb/v1.0/concepts/glossary/#aggregation), [function](/influxdb/v1.0/concepts/glossary/#function), [transformation](/influxdb/v1.0/concepts/glossary/#transformation)

## series  
The collection of data in InfluxDB's data structure that share a measurement, tag set, and field key.

The sample data below has six series:

| Arbitrary series number | Measurement        | Tag set    | Field key |
| :---------------------- | :----------------- |:-----------|:-----------|
| series 1                | `measurement_name` | `tag_key_1 = alpha`,`tagkey_2 = true` | `field_key_1` |
| series 2                | `measurement_name` | `tag_key_1 = alpha`,`tagkey_2 = true` | `field_key_2` |
| series 3                | `measurement_name` | `tag_key_1 = alpha`,`tagkey_2 = false` | `field_key_1` |
| series 4                | `measurement_name` | `tag_key_1 = alpha`,`tagkey_2 = false` | `field_key_2` |
| series 5                | `measurement_name` | `tag_key_1 = beta`,`tagkey_2 = true` | `field_key_1` |
| series 6                | `measurement_name` | `tag_key_1 = beta`,`tagkey_2 = true` | `field_key_2` |

Sample data:
```
name: measurement_name
--------------
time                   field_key_1   field_key_2  tag_key_1   tag_key_2
2015-08-18T00:00:00Z   2             18           alpha       true     
2015-08-18T00:00:10Z   3             76           alpha       false
2015-08-18T00:00:20Z   3             58           beta        true
2015-08-18T00:00:30Z   5                          beta        true
```

Related entries:
[field key](#field-key),
[measurement](#measurement),
[metaseries](#metaseries),
[series cardinality](#series-cardinality),
[tag set](#tag-set)

## series cardinality
The number of unique database, measurement, tag set, and field key combinations in an InfluxDB instance.

For example, assume that an InfluxDB instance has a single datbase and one measurement.
The single measurement has two tag keys (`email` and `status`) and one field key (`mood_index`).
The tag key `email` has three tag values (`lorr@influxdata.com`,`marv@influxdata.com`,`cliff@influxdata.com`) and
the tag key `status` has two tag values (`start`,`finish`).
If every point includes the field key `mood_index` then the series cardinality for the measurement is 6
(3 * 2 * 1 = 6):

| tag set | field key |
| :-------| :----- |
| `email = lorr@influxdata.com`,  `status = start`  | `mood_index` |
| `email = lorr@influxdata.com`,  `status = finish` | `mood_index` |
| `email = marv@influxdata.com`,  `status = start`  | `mood_index` |
| `email = marv@influxdata.com`,  `status = finish` | `mood_index` |
| `email = cliff@influxdata.com`, `status = start` | `mood_index` |
| `email = cliff@influxdata.com`, `status = finish` | `mood_index` |

Note that, in some cases, simply performing that multiplication may overestimate series cardinality because of the presence of dependent tags.
Dependent tags are tags that are scoped by another tag and do not increase series
cardinality.
If we add the tag `firstname` to the example above, the series cardinality
would not be 18 (3 * 2 * 3 * 1 = 18).
It would remain unchanged at 6, as `firstname` is already scoped by the `email` tag:

| tag set | field key |
| :-------| :----- |
| `email = lorr@influxdata.com`,  `status = start`,  `firstname = lorraine`  | `mood_index` |
| `email = lorr@influxdata.com`,  `status = finish`, `firstname = lorraine`  | `mood_index` |
| `email = marv@influxdata.com`,  `status = start`,  `firstname = marvin`    | `mood_index` |
| `email = marv@influxdata.com`,  `status = finish`, `firstname = marvin`    | `mood_index` |
| `email = cliff@influxdata.com`, `status = start`,  `firstname = clifford`  | `mood_index` |
| `email = cliff@influxdata.com`, `status = finish`, `firstname = clifford`  | `mood_index` |


Related entries:
[field key](#field-key),
[measurement](#measurement),
[tag key](#tag-key),
[tag set](#tag-set)

## server  
A machine, virtual or physical, that is running InfluxDB.
There should only be one InfluxDB process per server.

Related entries: [node](/influxdb/v1.0/concepts/glossary/#node)

## shard

A shard is represented by a TSM file on disk.
Every shard belongs to one and only one shard group.
Multiple shards may exist in a single shard group.
Each shard contains a specific set of series.
All points falling on a given series in the relevant time range will be stored in the same shard on disk.

Related entries: [series](/influxdb/v1.0/concepts/glossary/#series), [shard group](/influxdb/v1.0/concepts/glossary/#shard-group), [tsm](/influxdb/v1.0/concepts/glossary/#tsm)

## shard group

Data on disk are organized into shard groups, logical containers organized by time and retention policy.
Every retention policy that contains data has at least one associated shard group.
A given shard group contains all data from that retention policy for a certain time interval.
The specific interval is determined by the `SHARD DURATION` of the retention policy.
See [Retention Policy management](/influxdb/v1.0/query_language/database_management/#retention-policy-management) for more information.

For example, given a retention policy with `SHARD DURATION` set to `1w`, each shard group will span a single week and contain all points with timestamps in that week.

Shard groups are logical containers for shards, which are actual files on disk.

Related entries: [database](/influxdb/v1.0/concepts/glossary/#database), [retention policy](/influxdb/v1.0/concepts/glossary/#retention-policy), [series](/influxdb/v1.0/concepts/glossary/#series), [shard](/influxdb/v1.0/concepts/glossary/#shard)

## tag  
The key-value pair in InfluxDB's data structure that records metadata.
Tags are an optional part of InfluxDB's data structure but they are useful for storing commonly-queried metadata.

Related entries: [field](/influxdb/v1.0/concepts/glossary/#field), [tag key](/influxdb/v1.0/concepts/glossary/#tag-key), [tag set](/influxdb/v1.0/concepts/glossary/#tag-set), [tag value](/influxdb/v1.0/concepts/glossary/#tag-value)

## tag key  
The key part of the key-value pair that makes up a tag.
Tag keys are strings and they store metadata.
Tag keys are indexed.

Related entries: [field key](/influxdb/v1.0/concepts/glossary/#field-key), [tag](/influxdb/v1.0/concepts/glossary/#tag), [tag set](/influxdb/v1.0/concepts/glossary/#tag-set), [tag value](/influxdb/v1.0/concepts/glossary/#tag-value)

## tag set
The collection of tag keys and tag values on a point.

Related entries:
[metaseries](#metaseries),
[point](#point),
[series](#series),
[tag](#tag),
[tag key](#tag-key),
[tag value](#tag-value)

## tag value  
The value part of the key-value pair that makes up a tag.
Tag values are strings and they store metadata.
Tag values are indexed so queries on tag values are more performant than queries on field values.

*Query tip:* Compare field values to tag values; tag values are indexed.

Related entries: [tag](/influxdb/v1.0/concepts/glossary/#tag), [tag key](/influxdb/v1.0/concepts/glossary/#tag-key), [tag set](/influxdb/v1.0/concepts/glossary/#tag-set)

## timestamp  
The date and time associated with a point.
All time in InfluxDB is UTC.

For how to specify time when writing data, see [Write Syntax](/influxdb/v1.0/write_protocols/write_syntax/).
For how to specify time when querying data, see [Data Exploration](/influxdb/v1.0/query_language/data_exploration/#time-syntax-in-queries).

Related entries: [point](/influxdb/v1.0/concepts/glossary/#point)

## transformation  
An InfluxQL function that returns a value or a set of values calculated from specified points, but does not return an aggregated value across those points.
See [InfluxQL Functions](/influxdb/v1.0/query_language/functions/#transformations) for a complete list of the available and upcoming aggregations.

Related entries: [aggregation](/influxdb/v1.0/concepts/glossary/#aggregation), [function](/influxdb/v1.0/concepts/glossary/#function), [selector](/influxdb/v1.0/concepts/glossary/#selector)

## tsm (Time Structured Merge tree)
The purpose-built data storage format for InfluxDB. TSM allows for greater compaction and higher write and read throughput than existing B+ or LSM tree implementations. See [Storage Engine](http://docs.influxdata.com/influxdb/v1.0/concepts/storage_engine/) for more.

## user  
There are two kinds of users in InfluxDB:

* *Admin users* have `READ` and `WRITE` access to all databases and full access to administrative queries and user management commands.
* *Non-admin users* have `READ`, `WRITE`, or `ALL` (both `READ` and `WRITE`) access per database.

When authentication is enabled, InfluxDB only executes HTTP requests that are sent with a valid username and password.
See [Authentication and Authorization](/influxdb/v1.0/administration/authentication_and_authorization/).

## values per second
See points per second.

Related entries: [batch](/influxdb/v1.0/concepts/glossary/#batch), [field](/influxdb/v1.0/concepts/glossary/#field), [point](/influxdb/v1.0/concepts/glossary/#point), [points per second](/influxdb/v1.0/concepts/glossary/#points-per-second)

## wal (Write Ahead Log)
The temporary cache for recently written points. To reduce the frequency with which the permanent storage files are accessed, InfluxDB caches new points in the WAL until their total size or age triggers a flush to more permanent storage. This allows for efficient batching of the writes into the TSM.

Points in the WAL can be queried, and they persist through a system reboot. On process start, all points in the WAL must be flushed before the system accepts new writes.

Related entries: [tsm](/influxdb/v1.0/concepts/glossary/#tsm)

<!--



## shard

## shard group
-->
