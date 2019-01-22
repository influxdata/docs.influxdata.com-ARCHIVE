---
title: Flux vs InfluxQL
description:
menu:
  flux_0_x:
    name: Flux vs InfluxQL
    parent: Introduction
    weight: 5
---

[InfluxQL](/influxdb/latest/query_language/) is InfluxData's SQL-like query language for interacting with data in InfluxDB.
Flux is an alternative to InfluxQL and other SQL-like query languages for querying and analyzing data.
It uses functional language patterns making it incredibly powerful, flexible, and able to overcome many of the limitations of InfluxQL.
This article outlines many of the tasks possible with Flux but not InfluxQL and provides information about Flux and InfluxQL parity.

## Possible with Flux

### Joins
InfluxQL has never supported joins. They can be accomplished using [TICKscript](/kapacitor/latest/tick/introduction/),
but even TICKscript's join capabilities are limited.
Flux's [`join()` function](/flux/v0.x/functions/transformations/join/) allows you
to join data **from any bucket, any measurement, and on any columns** as long as
each data set includes the columns on which they are to be joined.
This opens the door for really powerful and useful operations.

---

_For an in-depth walkthrough of using the `join()` function,
see [How to join data with Flux](/flux/v0.x/guides/join)._

---

###### Example join operation
```js
dataStream1 = from(bucket: "bucket1")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "network" and
    r._field == "bytes-transferred"
  )

dataStream2 = from(bucket: "bucket1")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "httpd" and
    r._field == "requests-per-sec"
    )

join(
    tables: {d1:dataStream1, d2:dataStream2},
    on: ["_time", "_stop", "_start", "host"]
  )
```

### Math across measurements
Being able to perform cross-measurement joins also allows you to run calculations using
data from separate measurements – a highly requested feature from the InfluxData community.
The example below takes two data streams from separate measurements, `mem` and `processes`,
joins them, then calculates the average amount of memory used per running process:

###### Example of math across measurements
```js
// Memory used (in bytes)
memUsed = from(bucket: "telegraf/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used"
  )

// Total processes running
procTotal = from(bucket: "telegraf/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "processes" and
    r._field == "total"
    )

// Join memory used with total processes and calculate
// the average memory (in MB) used for running processes.
join(
    tables: {mem:memUsed, proc:procTotal},
    on: ["_time", "_stop", "_start", "host"]
  )
  |> map(fn: (r) => ({
    _time: r._time,
    _value: (r._value_mem / r._value_proc) / 1000000
  })
)
```

### Sort on any column
InfluxQL's sorting capabilities are very limited, allowing you only to control the
sort order of `time` using the `ORDER BY time` clause.
Flux's [`sort()` function](/flux/v0.x/functions/transformations/sort) sorts records based on list of columns.
Depending on the column type, records are sorted alphabetically, numerically, or chronologically.

###### Example sort operation
```js
from(bucket:"telegraf/autogen")
  |> range(start:-12h)
  |> filter(fn: (r) =>
    r._measurement == "system" and
    r._field == "uptime"
  )
  |> sort(columns:["region", "host", "_value"])
```

### Pivot
Pivoting data tables has never been supported in InfluxQL.
Flux's [`pivot()` function](/flux/v0.x/functions/transformations/pivot) provides the ability
to pivot data tables by specifying `rowKey`, `columnKey`, and `valueColumn` parameters.

###### Example pivot operation
```js
from(bucket: "telegraf/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r.cpu == "cpu-total"
  )
  |> pivot(
    rowKey:["_time"],
    columnKey: ["_field"],
    valueColumn: "_value"
  )
```

### Histograms
The ability to generate histograms has been a highly requested feature for InfluxQL, but has never been supported.
Flux's [`histogram()` function](/flux/v0.x/functions/transformations/histogram) uses input
data to generate a cumulative histogram with support for other histogram types coming in the future.

---

_For an example of using Flux to create a cumulative histogram, see [Create histograms](/flux/v0.x/guides/histograms)._

---

###### Example histogram function
```js
from(bucket: "telegraf/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used_percent"
  )
  |> histogram(
    buckets: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
  )
```

### Covariance
Flux provides functions for simple covariance calculation.
The [`covariance()` function](/flux/v0.x/functions/transformations/aggregates/covariance)
calculates the covariance between two columns and the [`cov()` function](/flux/v0.x/functions/transformations/aggregates/cov)
calculates the covariance between two data streams.

###### Example covariance between two columns
```js
from(bucket: "telegraf/autogen")
  |> range(start:-5m)
  |> covariance(columns: ["x", "y"])
```

###### Example covariance between two streams of data
```js
table1 = from(bucket: "telegraf/autogen")
  |> range(start: -15m)
  |> filter(fn: (r) =>
    r._measurement == "measurement_1"
  )

table2 = from(bucket: "telegraf/autogen")
  |> range(start: -15m)
  |> filter(fn: (r) =>
    r._measurement == "measurement_2"
  )

cov(x: table1, y: table2, on: ["_time", "_field"])
```

## Not yet supported in Flux
Flux is working towards complete parity with InfluxQL and new functions are being added to that end.
The table below shows InfluxQL statements, clauses, and functions along with their equivalent Flux functions.

> The current version of Flux included with InfluxDB is a technical preview and is still in active development.
> New functions are added often and the following table may not represent the current state of Flux.

### InfluxQL and Flux parity

| InfluxQL                          | Flux Functions                                                                                                   |
| --------                          | --------------                                                                                                   |
| SELECT                            | [filter()](/flux/v0.x/functions/transformations/filter/)                                                         |
| WHERE                             | [filter()](/flux/v0.x/functions/transformations/filter/), [range()](/flux/v0.x/functions/transformations/range/) |
| GROUP BY                          | [group()](/flux/v0.x/functions/transformations/group/)                                                           |
| INTO                              | --                                                                                                               |
| ORDER BY                          | [sort()](/flux/v0.x/functions/transformations/sort/)                                                             |
| LIMIT                             | [limit()](/flux/v0.x/functions/transformations/limit/)                                                           |
| SLIMIT                            | --                                                                                                               |
| OFFSET                            | --                                                                                                               |
| SOFFSET                           | --                                                                                                               |
| SHOW DATABASES                    | [buckets()](/flux/v0.x/functions/inputs/buckets/)                                                                |
| SHOW MEASUREMENTS                 | --                                                                                                               |
| SHOW FIELD KEYS                   | [keys()](/flux/v0.x/functions/transformations/keys/)                                                             |
| SHOW RETENTION POLICIES           | [buckets()](/flux/v0.x/functions/inputs/buckets/)                                                                |
| SHOW TAG KEYS                     | --                                                                                                               |
| SHOW TAG VALUES                   | --                                                                                                               |
| SHOW SERIES                       | --                                                                                                               |
| CREATE DATABASE                   | --                                                                                                               |
| DROP DATABASE                     | --                                                                                                               |
| DROP SERIES                       | --                                                                                                               |
| DELETE                            | --                                                                                                               |
| DROP MEASUREMENT                  | --                                                                                                               |
| DROP SHARD                        | --                                                                                                               |
| CREATE RETENTION POLICY           | --                                                                                                               |
| ALTER RETENTION POLICY            | --                                                                                                               |
| DROP RETENTION POLICY             | --                                                                                                               |
| COUNT                             | [count()](/flux/v0.x/functions/transformations/aggregates/count/)                                                |
| DISTINCT                          | [distinct()](/flux/v0.x/functions/transformations/selectors/distinct/)                                           |
| INTEGRAL                          | [integral()](/flux/v0.x/functions/transformations/aggregates/integral/)                                          |
| MEAN                              | [mean()](/flux/v0.x/functions/transformations/aggregates/mean/)                                                  |
| MEDIAN                            | [median()](/flux/v0.x/functions/transformations/aggregates/median/)                                              |
| MODE                              | --                                                                                                               |
| SPREAD                            | [spread()](/flux/v0.x/functions/transformations/aggregates/spread/)                                              |
| STDDEV                            | [stddev()](/flux/v0.x/functions/transformations/aggregates/stddev/)                                              |
| SUM                               | [sum()](/flux/v0.x/functions/transformations/aggregates/sum/)                                                    |
| BOTTOM                            | [bottom()](/flux/v0.x/functions/transformations/selectors/bottom/)                                               |
| FIRST                             | [first()](/flux/v0.x/functions/transformations/selectors/first/)                                                 |
| LAST                              | [last()](/flux/v0.x/functions/transformations/selectors/last/)                                                   |
| MAX                               | [max()](/flux/v0.x/functions/transformations/selectors/max/)                                                     |
| MIN                               | [min()](/flux/v0.x/functions/transformations/selectors/min/)                                                     |
| PERCENTILE                        | [percentile()](/flux/v0.x/functions/transformations/aggregates/percentile/)                                      |
| SAMPLE                            | [sample()](/flux/v0.x/functions/transformations/selectors/sample/)                                               |
| TOP                               | [top()](/flux/v0.x/functions/transformations/selectors/top/)                                                     |
| ABS                               | --                                                                                                               |
| ACOS                              | --                                                                                                               |
| ASIN                              | --                                                                                                               |
| ATAN                              | --                                                                                                               |
| ATAN2                             | --                                                                                                               |
| CEIL                              | --                                                                                                               |
| COS                               | --                                                                                                               |
| CUMULATIVE_SUM                    | [cumulativeSum()](/flux/v0.x/functions/transformations/cumulativesum/)                                           |
| DERIVATIVE                        | [derivative()](/flux/v0.x/functions/transformations/aggregates/derivative/)                                      |
| DIFFERENCE                        | [difference()](/flux/v0.x/functions/transformations/aggregates/difference/)                                      |
| ELAPSED                           | --                                                                                                               |
| EXP                               | --                                                                                                               |
| FLOOR                             | --                                                                                                               |
| HISTOGRAM                         | [histogram()](/flux/v0.x/functions/transformations/histogram/)                                                   |
| LN                                | --                                                                                                               |
| LOG                               | --                                                                                                               |
| LOG2                              | --                                                                                                               |
| LOG10                             | --                                                                                                               |
| MOVING_AVERAGE                    | --                                                                                                               |
| NON_NEGATIVE_DERIVATIVE           | [derivative(nonNegative:true)](/flux/v0.x/functions/transformations/aggregates/derivative/)                      |
| NON_NEGATIVE_DIFFERENCE           | [difference(nonNegative:true)](/flux/v0.x/functions/transformations/aggregates/derivative/)                      |
| POW                               | --                                                                                                               |
| ROUND                             | --                                                                                                               |
| SIN                               | --                                                                                                               |
| SQRT                              | --                                                                                                               |
| TAN                               | --                                                                                                               |
| HOLT_WINTERS                      | --                                                                                                               |
| CHANDE_MOMENTUM_OSCILLATOR        | --                                                                                                               |
| EXPONENTIAL_MOVING_AVERAGE        | --                                                                                                               |
| DOUBLE_EXPONENTIAL_MOVING_AVERAGE | --                                                                                                               |
| KAUFMANS_EFFICIENCY_RATIO         | --                                                                                                               |
| KAUFMANS_ADAPTIVE_MOVING_AVERAGE  | --                                                                                                               |
| TRIPLE_EXPONENTIAL_MOVING_AVERAGE | --                                                                                                               |
| TRIPLE_EXPONENTIAL_DERIVATIVE     | --                                                                                                               |
| RELATIVE_STRENGTH_INDEX           | --                                                                                                               |
