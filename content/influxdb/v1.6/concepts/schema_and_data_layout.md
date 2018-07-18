---
title: InfluxDB schema design and data layout
description: Covers general guidelines for InfluxDB schema design and data layout.
menu:
  influxdb_1_6:
    name: Schema design and data layout
    weight: 50
    parent: Concepts
---

Every InfluxDB use case is special and your [schema](/influxdb/v1.6/concepts/glossary/#schema) will reflect that uniqueness.
There are, however, general guidelines to follow and pitfalls to avoid when designing your schema.

<table style="width:100%">
  <tr>
    <td><a href="#general-recommendations">General Recommendations</a></td>
    <td><a href="#encouraged-schema-design">Encouraged Schema Design</a></td>
    <td><a href="#discouraged-schema-design">Discouraged Schema Design</a></td>
    <td><a href="#shard-group-duration-management">Shard Group Duration Management</a></td>
  </tr>
</table>

# General recommendations

## Encouraged schema design

In no particular order, we recommend that you:

### *Encode meta data in tags*

[Tags](/influxdb/v1.6/concepts/glossary/#tag) are indexed and [fields](/influxdb/v1.6/concepts/glossary/#field) are not indexed.
This means that queries on tags are more performant than those on fields.

In general, your queries should guide what gets stored as a tag and what gets stored as a field:

* Store data in tags if they're commonly-queried meta data
* Store data in tags if you plan to use them with `GROUP BY()`
* Store data in fields if you plan to use them with an [InfluxQL function](/influxdb/v1.6/query_language/functions/)
* Store data in fields if you *need* them to be something other than a string - [tag values](/influxdb/v1.6/concepts/glossary/#tag-value) are always interpreted as strings

### *Avoid using InfluxQL keywords as identifier names*

This isn't necessary, but it simplifies writing queries; you won't have to wrap those identifiers in double quotes.
Identifiers are database names, [retention policy](/influxdb/v1.6/concepts/glossary/#retention-policy-rp) names, [user](/influxdb/v1.6/concepts/glossary/#user) names, [measurement](/influxdb/v1.6/concepts/glossary/#measurement) names, [tag keys](/influxdb/v1.6/concepts/glossary/#tag-key), and [field keys](/influxdb/v1.6/concepts/glossary/#field-key).
See [InfluxQL Keywords](https://github.com/influxdata/influxql/blob/master/README.md#keywords) for words to avoid.

Note that you will also need to wrap identifiers in double quotes in queries if they contain characters other than `[A-z,_]`.

## Discouraged schema design

In no particular order, we recommend that you:

### *Don't have too many series*

[Tags](/influxdb/v1.6/concepts/glossary/#tag) containing highly variable information like UUIDs, hashes, and random strings will lead to a large number of series in the database, known colloquially as high series cardinality.
High series cardinality is a primary driver of high memory usage for many database workloads.

See [Hardware sizing guidelines](/influxdb/v1.6/guides/hardware_sizing/#general-hardware-guidelines-for-a-single-node) for [series cardinality](/influxdb/v1.6/concepts/glossary/#series-cardinality) recommendations based on your hardware. If the system has memory constraints, consider storing high-cardinality data as a field rather than a tag.

### *Don't encode data in measurement names*

In general, taking this step will simplify your queries.
InfluxDB queries merge data that fall within the same [measurement](/influxdb/v1.6/concepts/glossary/#measurement); it's better to differentiate data with [tags](/influxdb/v1.6/concepts/glossary/#tag) than with detailed measurement names.

_Example:_

Consider the following schema represented by line protocol.

```
Schema 1 - Data encoded in the measurement name
-------------
blueberries.plot-1.north temp=50.1 1472515200000000000
blueberries.plot-2.midwest temp=49.8 1472515200000000000
```

The long measurement names (`blueberries.plot-1.north`) with no tags are similar to Graphite metrics.
Encoding information like `plot` and `region` in the measurement name will make the data much harder to query.

For instance, calculating the average temperature of both plots 1 and 2 would not be possible with schema 1.
Compare this to the following schema represented in line protocol.

```
Schema 2 - Data encoded in tags
-------------
weather_sensor,crop=blueberries,plot=1,region=north temp=50.1 1472515200000000000
weather_sensor,crop=blueberries,plot=2,region=midwest temp=49.8 1472515200000000000
```

The following queries calculate the average of `temp` for blueberries that fall in the `north` region.
While both queries are relatively simple, use of the regular expression make certain queries much more complicated or impossible.

```
# Schema 1 - Query for data encoded in the measurement name
> SELECT mean("temp") FROM /\.north$/

# Schema 2 - Query for data encoded in tags
> SELECT mean("temp") FROM "weather_sensor" WHERE "region" = 'north'
```

### *Don't put more than one piece of information in one tag*

Similar to the point above, splitting a single tag with multiple pieces into separate tags will simplify your queries and reduce the need for regular expressions.

_Example:_

Consider the following schema represented by line protocol.

```
Schema 1 - Multiple data encoded in a single tag
-------------
weather_sensor,crop=blueberries,location=plot-1.north temp=50.1 1472515200000000000
weather_sensor,crop=blueberries,location=plot-2.midwest temp=49.8 1472515200000000000
```

The above data encodes multiple separate parameters, the `plot` and `region` into a long tag value (`plot-1.north`).
Compare this to the following schema represented in line protocol.

```
Schema 2 - Data encoded in multiple tags
-------------
weather_sensor,crop=blueberries,plot=1,region=north temp=50.1 1472515200000000000
weather_sensor,crop=blueberries,plot=2,region=midwest temp=49.8 1472515200000000000
```

The following queries calculate the average of `temp` for blueberries that fall in the `north` region.
While both queries are similar, the use of multiple tags in Schema 2 avoids the use of a regular expressions.

```
# Schema 1 - Query for multiple data encoded in a single tag
> SELECT mean("temp") FROM "weather_sensor" WHERE location =~ /\.north$/

# Schema 2 - Query for data encoded in multiple tags
> SELECT mean("temp") FROM "weather_sensor" WHERE region = 'north'
```

# Shard group duration management

## Shard group duration overview

InfluxDB stores data in shard groups.
Shard groups are organized by [retention policy](/influxdb/v1.6/concepts/glossary/#retention-policy-rp) (RP) and store data with timestamps that fall within a specific time interval.
The length of that time interval is called the [shard group duration](/influxdb/v1.6/concepts/glossary/#shard-duration).

If no shard group duration is provided, the shard group duration is determined by the RP's [duration](/influxdb/v1.6/concepts/glossary/#duration) at the time the RP is created. The default values are: 

| RP Duration  | Shard Group Duration  |
|---|---|
| < 2 days  | 1 hour  |
| >= 2 days and <= 6 months  | 1 day  |
| > 6 months  | 7 days  |

The shard group duration is also configurable per RP.
See [Retention Policy Management](/influxdb/v1.6/query_language/database_management/#retention-policy-management) for how to configure the
shard group duration.

## Shard group duration tradeoffs

Determining the optimal shard group duration requires finding the balance between:

- better overall performance with longer shards
- flexibility provided by shorter shards

### Long shard group duration

Longer shard group durations allow InfluxDB to store more data in the same logical location.
This reduces data duplication, improves compression efficiency, and allows faster queries in some cases.

### Short shard group duration

Shorter shard group durations allow the system to more efficiently drop data and record incremental backups.
When InfluxDB enforces an RP it drops entire shard groups, not individual data points, even if the points are older than the RP duration.
A shard group will only be removed once a shard group's *end time* is older than the RP duration.

For example, if your RP has a duration of one day, InfluxDB will drop an hour's worth of data every hour and will always have 25 shard groups. One for each hour in the day and an extra shard group that is partially expiring, but will not be removed until the whole shard group is older than 24 hours.

## Shard group duration recommendations

The default shard group durations works well for most cases.
However, high-throughput or long-running instances will benefit from using longer shard group durations.
Here are some recommendations for longer shard group durations:

| RP Duration  | Shard Group Duration  |
|---|---|
| <= 1 day  | 6 hours  |
| > 1 day and <= 7 days  | 1 day  |
| > 7 days and <= 3 months  | 7 days  |
| > 3 months  | 30 days  |
| infinite  | 52 weeks or longer  |

> **Note:** Note that `INF` (infinite) is not a [valid shard group duration](/influxdb/v1.6/query_language/database_management/#retention-policy-management).
In extreme cases where data covers decades and will never be deleted, a long shard group duration like `1040w` (20 years) is perfectly valid.

Here are some other factors to take into considerations when determining shard group duration:

* Shard groups should be twice as long as the longest time range of the most frequent queries
* Shard groups should each contain more than 100,000 [points](/influxdb/v1.6/concepts/glossary/#point) per shard group
* Shard groups should each contain more than 1,000 points per [series](/influxdb/v1.6/concepts/glossary/#series)

### Shard group duration for backfilling

Bulk insertion of historical data covering a large time range in the past will trigger the creation of a large number of shards at once.
The concurrent access and overhead of writing to hundreds or thousands of shards can quickly lead to slow performance and memory exhaustion.

When writing historical data, we highly recommend temporarily setting a longer shard group duration so fewer shards are created.
Typically, a shard group duration of 52 weeks works well for backfilling.
