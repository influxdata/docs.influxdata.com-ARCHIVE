---
title: InfluxDB schema design and data layout
description: Covers general guidelines for InfluxDB schema design and data layout.
menu:
  influxdb_1_8:
    name: Schema design and data layout
    weight: 50
    parent: Concepts
---

Every InfluxDB use case is special and your [schema](/influxdb/v1.8/concepts/glossary/#schema) will reflect that uniqueness.
There are, however, general guidelines to follow and pitfalls to avoid when designing your schema.

<table style="width:100%">
  <tr>
    <td><a href="#general-recommendations">General Recommendations</a></td>
    <td><a href="#encouraged-schema-design">Encouraged Schema Design</a></td>
    <td><a href="#discouraged-schema-design">Discouraged Schema Design</a></td>
    <td><a href="#shard-group-duration-management">Shard Group Duration Management</a></td>
  </tr>
</table>

## General recommendations

### Encouraged schema design

We recommend that you:

- [Encode meta data in tags](#encode-meta-data-in-tags)
- [Avoid using keywords as tag or field names](#avoid-using-keywords-as-tag-or-field-names)

#### Encode meta data in tags

[Tags](/influxdb/v1.8/concepts/glossary/#tag) are indexed and [fields](/influxdb/v1.8/concepts/glossary/#field) are not indexed.
This means that queries on tags are more performant than those on fields.

In general, your queries should guide what gets stored as a tag and what gets stored as a field:

- Store commonly-queried meta data in tags
- Store data in tags if you plan to use them with the InfluxQL `GROUP BY` clause
- Store data in fields if you plan to use them with an [InfluxQL](/influxdb/v1.8/query_language/functions/) function
- Store numeric values as fields ([tag values](/influxdb/v1.8/concepts/glossary/#tag-value) only support string values)

#### Avoid using keywords as tag or field names

Not required, but simplifies writing queries because you won't have to wrap tag or field names in double quotes.
See [InfluxQL](https://github.com/influxdata/influxql/blob/master/README.md#keywords) and [Flux](https://github.com/influxdata/flux/blob/master/docs/SPEC.md#keywords) keywords to avoid.

Also, if a tag or field name contains characters other than `[A-z,_]`, you must wrap it in double quotes in InfluxQL or use [bracket notation](/flux/latest/introduction/getting-started/syntax-basics/#objects) in Flux.

### Discouraged schema design

We recommend that you:

- [Avoid too many series](#avoid-too-many-series)
- [Avoid the same name for a tag and a field](#avoid-the-same-name-for-a-tag-and-a-field)
- [Avoid encoding data in measurement names](#avoid-encoding-data-in-measurement-names)
- [Avoid putting more than one piece of information in one tag](#avoid-putting-more-than-one-piece-of-information-in-one-tag)

#### Avoid too many series

[Tags](/influxdb/v1.8/concepts/glossary/#tag) containing highly variable information like UUIDs, hashes, and random strings lead to a large number of [series](/influxdb/v1.8/concepts/glossary/#series) in the database, also known as high series cardinality. High series cardinality is a primary driver of high memory usage for many database workloads.

See [Hardware sizing guidelines](/influxdb/v1.8/guides/hardware_sizing/#general-hardware-guidelines-for-a-single-node) for [series cardinality](/influxdb/v1.8/concepts/glossary/#series-cardinality) recommendations based on your hardware. If the system has memory constraints, consider storing high-cardinality data as a field rather than a tag.

#### Avoid the same name for a tag and a field

Avoid using the same name for a tag and field key.
This often results in unexpected behavior when querying data.

If you inadvertently add the same name for a tag and field key, see
[Frequently asked questions](/influxdb/v1.8/troubleshooting/frequently-asked-questions/#tag-and-field-key-with-the-same-name)
for information about how to query the data predictably and how to fix the issue.

#### Avoid encoding data in measurement names

InfluxDB queries merge data that falls within the same [measurement](/influxdb/v1.8/concepts/glossary/#measurement); it's better to differentiate data with [tags](/influxdb/v1.8/concepts/glossary/#tag) than with detailed measurement names. If you encode data in a measurement name, you must use a regular expression to query the data, making some queries more complicated or impossible.

_Example:_

Consider the following schema represented by line protocol.

```
Schema 1 - Data encoded in the measurement name
-------------
blueberries.plot-1.north temp=50.1 1472515200000000000
blueberries.plot-2.midwest temp=49.8 1472515200000000000
```

The long measurement names (`blueberries.plot-1.north`) with no tags are similar to Graphite metrics.
Encoding the `plot` and `region` in the measurement name makes the data more difficult to query.

For example, calculating the average temperature of both plots 1 and 2 is not possible with schema 1.
Compare this to schema 2:

```
Schema 2 - Data encoded in tags
-------------
weather_sensor,crop=blueberries,plot=1,region=north temp=50.1 1472515200000000000
weather_sensor,crop=blueberries,plot=2,region=midwest temp=49.8 1472515200000000000
```

Use Flux or InfluxQL to calculate the average `temp` for blueberries in the `north` region:

##### Flux

```js
// Schema 1 - Query for data encoded in the measurement name
from(bucket:"<database>/<retention_policy>")
  |> range(start:2016-08-30T00:00:00Z)
  |> filter(fn: (r) =>  r._measurement =~ /\.north$/ and r._field == "temp")
  |> mean()

// Schema 2 - Query for data encoded in tags
from(bucket:"<database>/<retention_policy>")
  |> range(start:2016-08-30T00:00:00Z)
  |> filter(fn: (r) =>  r._measurement == "weather_sensor" and r.region == "north" and r._field == "temp")
  |> mean()
```
  
##### InfluxQL

```
# Schema 1 - Query for data encoded in the measurement name
> SELECT mean("temp") FROM /\.north$/

# Schema 2 - Query for data encoded in tags
> SELECT mean("temp") FROM "weather_sensor" WHERE "region" = 'north'
```

### Avoid putting more than one piece of information in one tag

Splitting a single tag with multiple pieces into separate tags simplifies your queries and reduces the need for regular expressions.

Consider the following schema represented by line protocol.

```
Schema 1 - Multiple data encoded in a single tag
-------------
weather_sensor,crop=blueberries,location=plot-1.north temp=50.1 1472515200000000000
weather_sensor,crop=blueberries,location=plot-2.midwest temp=49.8 1472515200000000000
```

The Schema 1 data encodes multiple separate parameters, the `plot` and `region` into a long tag value (`plot-1.north`).
Compare this to the following schema represented in line protocol.

```
Schema 2 - Data encoded in multiple tags
-------------
weather_sensor,crop=blueberries,plot=1,region=north temp=50.1 1472515200000000000
weather_sensor,crop=blueberries,plot=2,region=midwest temp=49.8 1472515200000000000
```

Use Flux or InfluxQL to calculate the average `temp` for blueberries in the `north` region.
Schema 2 is preferable because using multiple tags, you don't need a regular expression.

##### Flux

```js
// Schema 1 -  Query for multiple data encoded in a single tag
from(bucket:"<database>/<retention_policy>")
  |> range(start:2016-08-30T00:00:00Z)
  |> filter(fn: (r) =>  r._measurement == "weather_sensor" and r.location =~ /\.north$/ and r._field == "temp")
  |> mean()

// Schema 2 - Query for data encoded in multiple tags
from(bucket:"<database>/<retention_policy>")
  |> range(start:2016-08-30T00:00:00Z)
  |> filter(fn: (r) =>  r._measurement == "weather_sensor" and r.region == "north" and r._field == "temp")
  |> mean()
```
  
##### InfluxQL

```
# Schema 1 - Query for multiple data encoded in a single tag
> SELECT mean("temp") FROM "weather_sensor" WHERE location =~ /\.north$/

# Schema 2 - Query for data encoded in multiple tags
> SELECT mean("temp") FROM "weather_sensor" WHERE region = 'north'
```

## Shard group duration management

### Shard group duration overview

InfluxDB stores data in shard groups.
Shard groups are organized by [retention policy](/influxdb/v1.8/concepts/glossary/#retention-policy-rp) (RP) and store data with timestamps that fall within a specific time interval called the [shard duration](/influxdb/v1.8/concepts/glossary/#shard-duration).

If no shard group duration is provided, the shard group duration is determined by the RP [duration](/influxdb/v1.8/concepts/glossary/#duration) at the time the RP is created. The default values are:

| RP Duration  | Shard Group Duration  |
|---|---|
| < 2 days  | 1 hour  |
| >= 2 days and <= 6 months  | 1 day  |
| > 6 months  | 7 days  |

The shard group duration is also configurable per RP.
To configure the shard group duration, see [Retention Policy Management](/influxdb/v1.8/query_language/database_management/#retention-policy-management).

### Shard group duration tradeoffs

Determining the optimal shard group duration requires finding the balance between:

- Better overall performance with longer shards
- Flexibility provided by shorter shards

#### Long shard group duration

Longer shard group durations let InfluxDB store more data in the same logical location.
This reduces data duplication, improves compression efficiency, and improves query speed in some cases.

#### Short shard group duration

Shorter shard group durations allow the system to more efficiently drop data and record incremental backups.
When InfluxDB enforces an RP it drops entire shard groups, not individual data points, even if the points are older than the RP duration.
A shard group will only be removed once a shard group's duration *end time* is older than the RP duration.

For example, if your RP has a duration of one day, InfluxDB will drop an hour's worth of data every hour and will always have 25 shard groups. One for each hour in the day and an extra shard group that is partially expiring, but isn't removed until the whole shard group is older than 24 hours.

>**Note:** A special use case to consider: filtering queries on schema data (such as tags, series, measurements) by time. For example, if you want to filter schema data within a one hour interval, you must set the shard group duration to 1h. For more information, see [filter schema data by time](/influxdb/v1.8/query_language/schema_exploration/#filter-meta-queries-by-time).

### Shard group duration recommendations

The default shard group durations work well for most cases. However, high-throughput or long-running instances will benefit from using longer shard group durations.
Here are some recommendations for longer shard group durations:

| RP Duration  | Shard Group Duration  |
|---|---|
| <= 1 day  | 6 hours  |
| > 1 day and <= 7 days  | 1 day  |
| > 7 days and <= 3 months  | 7 days  |
| > 3 months  | 30 days  |
| infinite  | 52 weeks or longer  |

> **Note:** Note that `INF` (infinite) is not a [valid shard group duration](/influxdb/v1.8/query_language/database_management/#retention-policy-management).
In extreme cases where data covers decades and will never be deleted, a long shard group duration like `1040w` (20 years) is perfectly valid.

Other factors to consider before setting shard group duration:

* Shard groups should be twice as long as the longest time range of the most frequent queries
* Shard groups should each contain more than 100,000 [points](/influxdb/v1.8/concepts/glossary/#point) per shard group
* Shard groups should each contain more than 1,000 points per [series](/influxdb/v1.8/concepts/glossary/#series)

#### Shard group duration for backfilling

Bulk insertion of historical data covering a large time range in the past will trigger the creation of a large number of shards at once.
The concurrent access and overhead of writing to hundreds or thousands of shards can quickly lead to slow performance and memory exhaustion.

When writing historical data, we highly recommend temporarily setting a longer shard group duration so fewer shards are created. Typically, a shard group duration of 52 weeks works well for backfilling.
