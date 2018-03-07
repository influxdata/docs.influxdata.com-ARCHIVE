---
title: Schema design
menu:
  influxdb_1_5:
    weight: 70
    parent: concepts
---

Every InfluxDB use case is special and your [schema](/influxdb/v1.5/concepts/glossary/#schema) will reflect that uniqueness.
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

[Tags](/influxdb/v1.5/concepts/glossary/#tag) are indexed and [fields](/influxdb/v1.5/concepts/glossary/#field) are not indexed.
This means that queries on tags are more performant than those on fields.

In general, your queries should guide what gets stored as a tag and what gets stored as a field:

* Store data in tags if they're commonly-queried meta data
* Store data in tags if you plan to use them with `GROUP BY()`
* Store data in fields if you plan to use them with an [InfluxQL function](/influxdb/v1.5/query_language/functions/)
* Store data in fields if you *need* them to be something other than a string - [tag values](/influxdb/v1.5/concepts/glossary/#tag-value) are always interpreted as strings

### *Avoid using InfluxQL keywords as identifier names*

This isn't necessary, but it simplifies writing queries; you won't have to wrap those identifiers in double quotes.
Identifiers are database names, [retention policy](/influxdb/v1.5/concepts/glossary/#retention-policy-rp) names, [user](/influxdb/v1.5/concepts/glossary/#user) names, [measurement](/influxdb/v1.5/concepts/glossary/#measurement) names, [tag keys](/influxdb/v1.5/concepts/glossary/#tag-key), and [field keys](/influxdb/v1.5/concepts/glossary/#field-key).
See [InfluxQL Keywords](https://github.com/influxdata/influxql/blob/master/README.md#keywords) for words to avoid.

Note that you will also need to wrap identifiers in double quotes in queries if they contain characters other than `[A-z,_]`.

## Discouraged schema design

In no particular order, we recommend that you:

### *Don't have too many series*

[Tags](/influxdb/v1.5/concepts/glossary/#tag) containing highly variable information like UUIDs, hashes, and random strings will lead to a large number of series in the database, known colloquially as high series cardinality.
High series cardinality is a primary driver of high memory usage for many database workloads.

See [Hardware sizing guidelines](/influxdb/v1.5/guides/hardware_sizing/#general-hardware-guidelines-for-a-single-node) for [series cardinality](/influxdb/v1.5/concepts/glossary/#series-cardinality) recommendations based on your hardware. If the system has memory constraints, consider storing high-cardinality data as a field rather than a tag.

### *Don't encode data in measurement names*

In general, taking this step will simplify your queries.
InfluxDB queries merge data that fall within the same [measurement](/influxdb/v1.5/concepts/glossary/#measurement); it's better to differentiate data with [tags](/influxdb/v1.5/concepts/glossary/#tag) than with detailed measurement names.

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
Shard groups are organized by [retention policy](/influxdb/v1.5/concepts/glossary/#retention-policy-rp) (RP) and store data with timestamps that fall within a specific time interval.
The length of that time interval is called the [shard group duration](/influxdb/v1.5/concepts/glossary/#shard-duration).

By default, the shard group duration is determined by the RP's [duration](/influxdb/v1.5/concepts/glossary/#duration):

| RP Duration  | Shard Group Duration  |
|---|---|
| < 2 days  | 1 hour  |
| >= 2 days and <= 6 months  | 1 day  |
| > 6 months  | 7 days  |

The shard group duration is also configurable per RP.
See [Retention Policy Management](/influxdb/v1.5/query_language/database_management/#retention-policy-management) for how to configure the
shard group duration.

## Shard group duration recommendations

In general, shorter shard group durations allow the system to efficiently drop data.
When InfluxDB enforces an RP it drops entire shard groups, not individual data points.
For example, if your RP has a duration of one day, it makes sense to have a shard group duration of one hour; InfluxDB will drop an hour worth of data every hour.

If your RP's duration is greater than six months, there's no need to have a short shard group duration.
In fact, increasing the shard group duration beyond the default seven day value can improve compression, improve write speed, and decrease the fixed iterator overhead per shard group.
Shard group durations of 50 years and over, for example, are acceptable configurations.

> **Note:** Note that `INF` (infinite) is not a valid duration [when configuring](/influxdb/v1.5/query_language/database_management/#retention-policy-management)
the shard group duration.
As a workaround, specify a `1000w` duration to achieve an extremely long shard group
duration.

We recommend configuring the shard group duration such that:

* it is two times your longest typical query's time range
* each shard group has at least 100,000 [points](/influxdb/v1.5/concepts/glossary/#point) per shard group
* each shard group has at least 1,000 points per [series](/influxdb/v1.5/concepts/glossary/#series)
