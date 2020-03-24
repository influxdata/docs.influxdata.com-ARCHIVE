---
title: Flux vs InfluxQL
description:
menu:
  flux_0_50:
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
Flux's [`join()` function](/flux/v0.50/stdlib/built-in/transformations/join/) allows you
to join data **from any bucket, any measurement, and on any columns** as long as
each data set includes the columns on which they are to be joined.
This opens the door for really powerful and useful operations.

---

_For an in-depth walkthrough of using the `join()` function,
see [How to join data with Flux](/flux/v0.50/guides/join)._

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
Flux's [`sort()` function](/flux/v0.50/stdlib/built-in/transformations/sort) sorts records based on list of columns.
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
Flux's [`pivot()` function](/flux/v0.50/stdlib/built-in/transformations/pivot) provides the ability
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
Flux's [`histogram()` function](/flux/v0.50/stdlib/built-in/transformations/histogram) uses input
data to generate a cumulative histogram with support for other histogram types coming in the future.

---

_For an example of using Flux to create a cumulative histogram, see [Create histograms](/flux/v0.50/guides/histograms)._

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
The [`covariance()` function](/flux/v0.50/stdlib/built-in/transformations/aggregates/covariance)
calculates the covariance between two columns and the [`cov()` function](/flux/v0.50/stdlib/built-in/transformations/aggregates/cov)
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

| InfluxQL                          | Flux Functions                                                                                                                               |
| --------                          | --------------                                                                                                                               |
| SELECT                            | [filter()](/flux/v0.50/stdlib/built-in/transformations/filter/)                                                                              |
| WHERE                             | [filter()](/flux/v0.50/stdlib/built-in/transformations/filter/), [range()](/flux/v0.50/stdlib/built-in/transformations/range/)               |
| GROUP BY                          | [group()](/flux/v0.50/stdlib/built-in/transformations/group/)                                                                                |
| INTO                              | [to()](/flux/v0.50/stdlib/built-in/outputs/to/) <span><a style="color:orange" href="#footnote">*</a></span>                                  |
| ORDER BY                          | [sort()](/flux/v0.50/stdlib/built-in/transformations/sort/)                                                                                  |
| LIMIT                             | [limit()](/flux/v0.50/stdlib/built-in/transformations/limit/)                                                                                |
| SLIMIT                            | --                                                                                                                                           |
| OFFSET                            | --                                                                                                                                           |
| SOFFSET                           | --                                                                                                                                           |
| SHOW DATABASES                    | [v1.databases()](/flux/v0.50/stdlib/influxdb-v1/databases/)                                                                                  |
| SHOW MEASUREMENTS                 | [v1.measurements](/flux/v0.50/stdlib/influxdb-v1/measurements/)                                                                              |
| SHOW FIELD KEYS                   | [keys()](/flux/v0.50/stdlib/built-in/transformations/keys/)                                                                                  |
| SHOW RETENTION POLICIES           | [buckets()](/flux/v0.50/stdlib/built-in/inputs/buckets/)                                                                                     |
| SHOW TAG KEYS                     | [v1.tagKeys()](/flux/v0.50/stdlib/influxdb-v1/tagkeys), [v1.measurementTagKeys()](/flux/v0.50/stdlib/influxdb-v1/measurementtagkeys)         |
| SHOW TAG VALUES                   | [v1.tagValues()](/flux/v0.50/stdlib/influxdb-v1/tagvalues), [v1.measurementTagValues()](/flux/v0.50/stdlib/influxdb-v1/measurementtagvalues) |
| SHOW SERIES                       | --                                                                                                                                           |
| CREATE DATABASE                   | --                                                                                                                                           |
| DROP DATABASE                     | --                                                                                                                                           |
| DROP SERIES                       | --                                                                                                                                           |
| DELETE                            | --                                                                                                                                           |
| DROP MEASUREMENT                  | --                                                                                                                                           |
| DROP SHARD                        | --                                                                                                                                           |
| CREATE RETENTION POLICY           | --                                                                                                                                           |
| ALTER RETENTION POLICY            | --                                                                                                                                           |
| DROP RETENTION POLICY             | --                                                                                                                                           |
| COUNT                             | [count()](/flux/v0.50/stdlib/built-in/transformations/aggregates/count/)                                                                     |
| DISTINCT                          | [distinct()](/flux/v0.50/stdlib/built-in/transformations/selectors/distinct/)                                                                |
| INTEGRAL                          | [integral()](/flux/v0.50/stdlib/built-in/transformations/aggregates/integral/)                                                               |
| MEAN                              | [mean()](/flux/v0.50/stdlib/built-in/transformations/aggregates/mean/)                                                                       |
| MEDIAN                            | [median()](/flux/v0.50/stdlib/built-in/transformations/aggregates/median/)                                                                   |
| MODE                              | [mode()](/flux/v0.50/stdlib/built-in/transformations/aggregates/mode/)                                                                       |
| SPREAD                            | [spread()](/flux/v0.50/stdlib/built-in/transformations/aggregates/spread/)                                                                   |
| STDDEV                            | [stddev()](/flux/v0.50/stdlib/built-in/transformations/aggregates/stddev/)                                                                   |
| SUM                               | [sum()](/flux/v0.50/stdlib/built-in/transformations/aggregates/sum/)                                                                         |
| BOTTOM                            | [bottom()](/flux/v0.50/stdlib/built-in/transformations/selectors/bottom/)                                                                    |
| FIRST                             | [first()](/flux/v0.50/stdlib/built-in/transformations/selectors/first/)                                                                      |
| LAST                              | [last()](/flux/v0.50/stdlib/built-in/transformations/selectors/last/)                                                                        |
| MAX                               | [max()](/flux/v0.50/stdlib/built-in/transformations/selectors/max/)                                                                          |
| MIN                               | [min()](/flux/v0.50/stdlib/built-in/transformations/selectors/min/)                                                                          |
| PERCENTILE                        | [quantile()](/flux/v0.50/stdlib/built-in/transformations/aggregates/quantile/)                                                               |
| SAMPLE                            | [sample()](/flux/v0.50/stdlib/built-in/transformations/selectors/sample/)                                                                    |
| TOP                               | [top()](/flux/v0.50/stdlib/built-in/transformations/selectors/top/)                                                                          |
| ABS                               | [math.abs()](/flux/v0.50/stdlib/math/abs/)                                                                                                   |
| ACOS                              | [math.acos()](/flux/v0.50/stdlib/math/acos/)                                                                                                 |
| ASIN                              | [math.asin()](/flux/v0.50/stdlib/math/asin/)                                                                                                 |
| ATAN                              | [math.atan()](/flux/v0.50/stdlib/math/atan/)                                                                                                 |
| ATAN2                             | [math.atan2()](/flux/v0.50/stdlib/math/atan2/)                                                                                               |
| CEIL                              | [math.ceil()](/flux/v0.50/stdlib/math/ceil/)                                                                                                 |
| COS                               | [math.cos()](/flux/v0.50/stdlib/math/cos/)                                                                                                   |
| CUMULATIVE_SUM                    | [cumulativeSum()](/flux/v0.50/stdlib/built-in/transformations/cumulativesum/)                                                                |
| DERIVATIVE                        | [derivative()](/flux/v0.50/stdlib/built-in/transformations/aggregates/derivative/)                                                           |
| DIFFERENCE                        | [difference()](/flux/v0.50/stdlib/built-in/transformations/aggregates/difference/)                                                           |
| ELAPSED                           | [elapsed()](/flux/v0.50/stdlib/built-in/transformations/elapsed/)                                                                            |
| EXP                               | [math.exp()](/flux/v0.50/stdlib/math/exp/)                                                                                                   |
| FLOOR                             | [math.floor()](/flux/v0.50/stdlib/math/floor/)                                                                                               |
| HISTOGRAM                         | [histogram()](/flux/v0.50/stdlib/built-in/transformations/histogram/)                                                                        |
| LN                                | [math.log()](/flux/v0.50/stdlib/math/log/)                                                                                                   |
| LOG                               | [math.logb()](/flux/v0.50/stdlib/math/logb/)                                                                                                 |
| LOG2                              | [math.log2()](/flux/v0.50/stdlib/math/log2/)                                                                                                 |
| LOG10                             | [math.log10()](/flux/v0.50/stdlib/math/log10/)                                                                                               |
| MOVING_AVERAGE                    | [movingAverage()](/flux/v0.50/stdlib/built-in/transformations/aggregates/movingaverage/)                                                     |
| NON_NEGATIVE_DERIVATIVE           | [derivative(nonNegative:true)](/flux/v0.50/stdlib/built-in/transformations/aggregates/derivative/)                                           |
| NON_NEGATIVE_DIFFERENCE           | [difference(nonNegative:true)](/flux/v0.50/stdlib/built-in/transformations/aggregates/derivative/)                                           |
| POW                               | [math.pow()](/flux/v0.50/stdlib/math/pow/)                                                                                                   |
| ROUND                             | [math.round()](/flux/v0.50/stdlib/math/round/)                                                                                               |
| SIN                               | [math.sin()](/flux/v0.50/stdlib/math/sin/)                                                                                                   |
| SQRT                              | [math.sqrt()](/flux/v0.50/stdlib/math/sqrt/)                                                                                                 |
| TAN                               | [math.tan()](/flux/v0.50/stdlib/math/tan/)                                                                                                   |
| HOLT_WINTERS                      | [holtWinters()](/flux/v0.50/stdlib/built-in/transformations/aggregates/holtwinters/)                                                         |
| CHANDE_MOMENTUM_OSCILLATOR        | [chandeMomentumOscillator()](/flux/v0.50/stdlib/built-in/transformations/aggregates/chandemomentumoscillator/)                               |
| EXPONENTIAL_MOVING_AVERAGE        | [exponentialMovingAverage()](/flux/v0.50/stdlib/built-in/transformations/aggregates/exponentialmovingaverage/)                               |
| DOUBLE_EXPONENTIAL_MOVING_AVERAGE | [doubleEMA()](/flux/v0.50/stdlib/built-in/transformations/aggregates/doubleema/)                                                             |
| KAUFMANS_EFFICIENCY_RATIO         | [kaufmansER()](/flux/v0.50/stdlib/built-in/transformations/aggregates/kaufmanser/)                                                           |
| KAUFMANS_ADAPTIVE_MOVING_AVERAGE  | [kaufmansAMA()](/flux/v0.50/stdlib/built-in/transformations/aggregates/kaufmansama/)                                                         |
| TRIPLE_EXPONENTIAL_MOVING_AVERAGE | [tripleEMA()](/flux/v0.50/stdlib/built-in/transformations/aggregates/tripleema/)                                                             |
| TRIPLE_EXPONENTIAL_DERIVATIVE     | [tripleExponentialDerivative()](/flux/v0.50/stdlib/built-in/transformations/aggregates/tripleexponentialderivative/)                         |
| RELATIVE_STRENGTH_INDEX           | [relativeStrengthIndex()](/flux/v0.50/stdlib/built-in/transformations/aggregates/relativestrengthindex/)                                     |

_<span style="font-size:.9rem" id="footnote"><span style="color:orange">*</span> The <code>to()</code> function only writes to InfluxDB 2.0.</span>_
