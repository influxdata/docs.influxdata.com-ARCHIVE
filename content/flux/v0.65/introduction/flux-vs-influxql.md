---
title: Flux vs InfluxQL
description:
menu:
  flux_0_65:
    name: Flux vs InfluxQL
    parent: Introduction
    weight: 5
---

Flux is an alternative to [InfluxQL](/influxdb/latest/query_language/) and other SQL-like query languages for querying and analyzing data.
Flux uses functional language patterns making it incredibly powerful, flexible, and able to overcome many of the limitations of InfluxQL.
This article outlines many of the tasks possible with Flux but not InfluxQL and provides information about Flux and InfluxQL parity.

- [Possible with Flux](#possible-with-flux)
- [InfluxQL and Flux parity](#influxql-and-flux-parity)

## Possible with Flux

- [Joins](#joins)
- [Math across measurements](#math-across-measurements)
- [Sort by tags](#sort-by-tags)
- [Group by any column](#group-by-any-column)
- [Window by calendar months and years](#window-by-calendar-months-and-years)
- [Work with multiple data sources](#work-with-multiple-data-sources)
- [Pivot](#pivot)
- [Histograms](#histograms)
- [Covariance](#covariance)
- [Cast booleans to integers](#cast-booleans-to-integers)
- [String manipulation and data shaping](#string-manipulation-and-data-shaping)
- [Work with geo-temporal data](#work-with-geo-temporal-data)

### Joins
InfluxQL has never supported joins. They can be accomplished using [TICKscript](/kapacitor/latest/tick/introduction/),
but even TICKscript's join capabilities are limited.
Flux's [`join()` function](/flux/v0.65/stdlib/built-in/transformations/join/) allows you
to join data **from any bucket, any measurement, and on any columns** as long as
each data set includes the columns on which they are to be joined.
This opens the door for really powerful and useful operations.

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


---

_For an in-depth walkthrough of using the `join()` function, see [How to join data with Flux](/flux/v0.65/guides/join)._

---

### Math across measurements
Being able to perform cross-measurement joins also allows you to run calculations using
data from separate measurements – a highly requested feature from the InfluxData community.
The example below takes two data streams from separate measurements, `mem` and `processes`,
joins them, then calculates the average amount of memory used per running process:

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

### Sort by tags
InfluxQL's sorting capabilities are very limited, allowing you only to control the
sort order of `time` using the `ORDER BY time` clause.
Flux's [`sort()` function](/flux/v0.65/stdlib/built-in/transformations/sort) sorts records based on list of columns.
Depending on the column type, records are sorted lexicographically, numerically, or chronologically.

```js
from(bucket:"telegraf/autogen")
  |> range(start:-12h)
  |> filter(fn: (r) =>
    r._measurement == "system" and
    r._field == "uptime"
  )
  |> sort(columns:["region", "host", "_value"])
```

### Group by any column
InfluxQL lets you group by tags or by time intervals, but nothing else.
Flux lets you group by any column in the dataset, including `_value`.
Use the Flux [`group()` function](/flux/v0.65/stdlib/built-in/transformations/group/)
to define which columns to group data by.

```js
from(bucket:"telegraf/autogen")
  |> range(start:-12h)
  |> filter(fn: (r) => r._measurement == "system" and r._field == "uptime" )
  |> group(columns:["host", "_value"])
```

### Window by calendar months and years
InfluxQL does not support windowing data by calendar months and years due to their varied lengths.
Flux supports calendar month and year duration units (`1mo`, `1y`) and lets you
window and aggregate data by calendar month and year.

```js
from(bucket:"telegraf/autogen")
  |> range(start:-1y)
  |> filter(fn: (r) => r._measurement == "mem" and r._field == "used_percent" )
  |> aggregateWindow(every: 1mo, fn: mean)
```

### Work with multiple data sources
InfluxQL can only query data stored in InfluxDB.
Flux can query data from other data sources such as CSV, PostgreSQL, MySQL, Google BigTable, and more.
Join that data with data in InfluxDB to enrich query results.

- [Flux CSV package](/flux/v0.65/stdlib/csv/)
- [Flux SQL package](/flux/v0.65/stdlib/sql/)
- [Flux BigTable package](/flux/v0.65/stdlib/experimental/bigtable/)

<!-- -->
```js
import "csv"
import "sql"

csvData = csv.from(csv: rawCSV)
sqlData = sql.from(
  driverName: "postgres",
  dataSourceName: "postgresql://user:password@localhost",
  query:"SELECT * FROM ExampleTable"
)
data = from(bucket: "telegraf/autogen")
  |> range(start: -24h)
  |> filter(fn: (r) => r._measurement == "sensor")

auxData = join(tables: {csv: csvData, sql: sqlData}, on: ["sensor_id"])
enrichedData = join(tables: {data: data, aux: auxData}, on: ["sensor_id"])

enrichedData
  |> yeild(name: "enriched_data")
```

---

_For an in-depth walkthrough of querying SQL data, see [Query SQL data sources](/flux/v0.65/guides/sql)._

---

### Pivot
Pivoting data tables has never been supported in InfluxQL.
The Flux [`pivot()` function](/flux/v0.65/stdlib/built-in/transformations/pivot) provides the ability
to pivot data tables by specifying `rowKey`, `columnKey`, and `valueColumn` parameters.

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
Flux's [`histogram()` function](/flux/v0.65/stdlib/built-in/transformations/histogram) uses input
data to generate a cumulative histogram with support for other histogram types coming in the future.

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

---

_For an example of using Flux to create a cumulative histogram, see [Create histograms](/flux/v0.65/guides/histograms)._

---

### Covariance
Flux provides functions for simple covariance calculation.
The [`covariance()` function](/flux/v0.65/stdlib/built-in/transformations/aggregates/covariance)
calculates the covariance between two columns and the [`cov()` function](/flux/v0.65/stdlib/built-in/transformations/aggregates/cov)
calculates the covariance between two data streams.

###### Covariance between two columns
```js
from(bucket: "telegraf/autogen")
  |> range(start:-5m)
  |> covariance(columns: ["x", "y"])
```

###### Covariance between two streams of data
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

### Cast booleans to integers
InfluxQL supports type casting, but only for numeric data types (floats to integers and vice versa).
[Flux type conversion functions](/flux/v0.65/stdlib/built-in/transformations/type-conversions/)
provide much broader support for type conversions and let you perform some long-requested
operations like casting a boolean values to integers.

##### Cast boolean field values to integers
```js
from(bucket: "telegraf/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "m" and
    r._field == "bool_field"
  )
  |> toInt()
```

### String manipulation and data shaping
InfluxQL doesn't support string manipulation when querying data.
The [Flux Strings package](/flux/v0.65/stdlib/strings/) is a collection of functions that operate on string data.
When combined with the [`map()` function](/flux/v0.65/stdlib/built-in/transformations/map/),
functions in the string package allow for operations like string sanitization and normalization.

```js
import "strings"

from(bucket: "telegraf/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "weather" and
    r._field == "temp"
  )
  |> map(fn: (r) => ({
    r with
    location: strings.toTitle(v: r.location),
    sensor: strings.replaceAll(v: r.sensor, t: " ", u: "-"),
    status: strings.substring(v: r.status, start: 0, end: 8)
  }))
```

### Work with geo-temporal data
InfluxQL doesn't provide functionality for working with geo-temporal data.
The [Flux Geo package](/flux/v0.65/stdlib/experimental/geo/) is a collection of functions that
let you shape, filter, and group geo-temporal data.

```js
import "experimental/geo"

from(bucket: "geo/autogen")
  |> range(start: -1w)
  |> filter(fn: (r) => r._measurement == "taxi")
  |> geo.shapeData(latField: "latitude", lonField: "longitude", level: 20)
  |> geo.filterRows(
    region: {lat: 40.69335938, lon: -73.30078125, radius: 20.0},
    strict: true
  )
  |> geo.asTracks(groupBy: ["fare-id"])
```


## InfluxQL and Flux parity
Flux is working towards complete parity with InfluxQL and new functions are being added to that end.
The table below shows InfluxQL statements, clauses, and functions along with their equivalent Flux functions.

_For a complete list of Flux functions, [view all Flux functions](/flux/v0.65/stdlib/all-functions)._

### InfluxQL and Flux parity

| InfluxQL                                                                                                                           | Flux Functions                                                                                                                               |
| --------                                                                                                                           | --------------                                                                                                                               |
| [SELECT](/influxdb/latest/query_language/explore-data/#the-basic-select-statement)                                                 | [filter()](/flux/v0.65/stdlib/built-in/transformations/filter/)                                                                              |
| [WHERE](/influxdb/latest/query_language/explore-data/#the-where-clause)                                                            | [filter()](/flux/v0.65/stdlib/built-in/transformations/filter/), [range()](/flux/v0.65/stdlib/built-in/transformations/range/)               |
| [GROUP BY](/influxdb/latest/query_language/explore-data/#the-group-by-clause)                                                      | [group()](/flux/v0.65/stdlib/built-in/transformations/group/)                                                                                |
| [INTO](/influxdb/latest/query_language/explore-data/#the-into-clause)                                                              | [to()](/flux/v0.65/stdlib/built-in/outputs/to/) <span><a style="color:orange" href="#footnote">*</a></span>                                  |
| [ORDER BY](/influxdb/latest/query_language/explore-data/#order-by-time-desc)                                                       | [sort()](/flux/v0.65/stdlib/built-in/transformations/sort/)                                                                                  |
| [LIMIT](/influxdb/latest/query_language/explore-data/#the-limit-clause)                                                            | [limit()](/flux/v0.65/stdlib/built-in/transformations/limit/)                                                                                |
| [SLIMIT](/influxdb/latest/query_language/explore-data/#the-slimit-clause)                                                          | --                                                                                                                                           |
| [OFFSET](/influxdb/latest/query_language/explore-data/#the-offset-clause)                                                          | --                                                                                                                                           |
| [SOFFSET](/influxdb/latest/query_language/explore-data/#the-soffset-clause)                                                        | --                                                                                                                                           |
| [SHOW DATABASES](/influxdb/latest/query_language/explore-schema/#show-databases)                                                   | [buckets()](/flux/v0.65/stdlib/built-in/inputs/buckets/)                                                                                     |
| [SHOW MEASUREMENTS](/influxdb/latest/query_language/explore-schema/#show-measurements)                                             | [v1.measurements](/flux/v0.65/stdlib/influxdb-v1/measurements)                                                                               |
| [SHOW FIELD KEYS](/influxdb/latest/query_language/explore-schema/#show-field-keys)                                                 | [keys()](/flux/v0.65/stdlib/built-in/transformations/keys/)                                                                                  |
| [SHOW RETENTION POLICIES](/influxdb/latest/query_language/explore-schema/#show-retention-policies)                                 | [buckets()](/flux/v0.65/stdlib/built-in/inputs/buckets/)                                                                                     |
| [SHOW TAG KEYS](/influxdb/latest/query_language/explore-schema/#show-tag-keys)                                                     | [v1.tagKeys()](/flux/v0.65/stdlib/influxdb-v1/tagkeys), [v1.measurementTagKeys()](/flux/v0.65/stdlib/influxdb-v1/measurementtagkeys)         |
| [SHOW TAG VALUES](/influxdb/latest/query_language/explore-schema/#show-tag-values)                                                 | [v1.tagValues()](/flux/v0.65/stdlib/influxdb-v1/tagvalues), [v1.measurementTagValues()](/flux/v0.65/stdlib/influxdb-v1/measurementtagvalues) |
| [SHOW SERIES](/influxdb/latest/query_language/explore-schema/#show-series)                                                         | --                                                                                                                                           |
| [CREATE DATABASE](/influxdb/latest/query_language/manage-database/#create-database)                                                | --                                                                                                                                           |
| [DROP DATABASE](/influxdb/latest/query_language/manage-database/#delete-a-database-with-drop-database)                             | --                                                                                                                                           |
| [DROP SERIES](/influxdb/latest/query_language/manage-database/#drop-series-from-the-index-with-drop-serie)                         | --                                                                                                                                           |
| [DELETE](/influxdb/latest/query_language/manage-database/#delete-series-with-delete)                                               | --                                                                                                                                           |
| [DROP MEASUREMENT](/influxdb/latest/query_language/manage-database/#delete-measurements-with-drop-measurement)                     | --                                                                                                                                           |
| [DROP SHARD](/influxdb/latest/query_language/manage-database/#delete-a-shard-with-drop-shard)                                      | --                                                                                                                                           |
| [CREATE RETENTION POLICY](/influxdb/latest/query_language/manage-database/#create-retention-policies-with-create-retention-policy) | --                                                                                                                                           |
| [ALTER RETENTION POLICY](/influxdb/latest/query_language/manage-database/#modify-retention-policies-with-alter-retention-policy)   | --                                                                                                                                           |
| [DROP RETENTION POLICY](/influxdb/latest/query_language/manage-database/#delete-retention-policies-with-drop-retention-policy)     | --                                                                                                                                           |
| [COUNT](/influxdb/latest/query_language/functions#count)                                                                           | [count()](/flux/v0.65/stdlib/built-in/transformations/aggregates/count/)                                                                     |
| [DISTINCT](/influxdb/latest/query_language/functions#distinct)                                                                     | [distinct()](/flux/v0.65/stdlib/built-in/transformations/selectors/distinct/)                                                                |
| [INTEGRAL](/influxdb/latest/query_language/functions#integral)                                                                     | [integral()](/flux/v0.65/stdlib/built-in/transformations/aggregates/integral/)                                                               |
| [MEAN](/influxdb/latest/query_language/functions#mean)                                                                             | [mean()](/flux/v0.65/stdlib/built-in/transformations/aggregates/mean/)                                                                       |
| [MEDIAN](/influxdb/latest/query_language/functions#median)                                                                         | [median()](/flux/v0.65/stdlib/built-in/transformations/aggregates/median/)                                                                   |
| [MODE](/influxdb/latest/query_language/functions#mode)                                                                             | [mode()](/flux/v0.65/stdlib/built-in/transformations/aggregates/mode/)                                                                       |
| [SPREAD](/influxdb/latest/query_language/functions#spread)                                                                         | [spread()](/flux/v0.65/stdlib/built-in/transformations/aggregates/spread/)                                                                   |
| [STDDEV](/influxdb/latest/query_language/functions#stddev)                                                                         | [stddev()](/flux/v0.65/stdlib/built-in/transformations/aggregates/stddev/)                                                                   |
| [SUM](/influxdb/latest/query_language/functions#sum)                                                                               | [sum()](/flux/v0.65/stdlib/built-in/transformations/aggregates/sum/)                                                                         |
| [BOTTOM](/influxdb/latest/query_language/functions#bottom)                                                                         | [bottom()](/flux/v0.65/stdlib/built-in/transformations/selectors/bottom/)                                                                    |
| [FIRST](/influxdb/latest/query_language/functions#first)                                                                           | [first()](/flux/v0.65/stdlib/built-in/transformations/selectors/first/)                                                                      |
| [LAST](/influxdb/latest/query_language/functions#last)                                                                             | [last()](/flux/v0.65/stdlib/built-in/transformations/selectors/last/)                                                                        |
| [MAX](/influxdb/latest/query_language/functions#max)                                                                               | [max()](/flux/v0.65/stdlib/built-in/transformations/selectors/max/)                                                                          |
| [MIN](/influxdb/latest/query_language/functions#min)                                                                               | [min()](/flux/v0.65/stdlib/built-in/transformations/selectors/min/)                                                                          |
| [PERCENTILE](/influxdb/latest/query_language/functions#percentile)                                                                 | [quantile()](/flux/v0.65/stdlib/built-in/transformations/aggregates/quantile/)                                                               |
| [SAMPLE](/influxdb/latest/query_language/functions#sample)                                                                         | [sample()](/flux/v0.65/stdlib/built-in/transformations/selectors/sample/)                                                                    |
| [TOP](/influxdb/latest/query_language/functions#top)                                                                               | [top()](/flux/v0.65/stdlib/built-in/transformations/selectors/top/)                                                                          |
| [ABS](/influxdb/latest/query_language/functions#abs)                                                                               | [math.abs()](/flux/v0.65/stdlib/math/abs/)                                                                                                   |
| [ACOS](/influxdb/latest/query_language/functions#acos)                                                                             | [math.acos()](/flux/v0.65/stdlib/math/acos/)                                                                                                 |
| [ASIN](/influxdb/latest/query_language/functions#asin)                                                                             | [math.asin()](/flux/v0.65/stdlib/math/asin/)                                                                                                 |
| [ATAN](/influxdb/latest/query_language/functions#atan)                                                                             | [math.atan()](/flux/v0.65/stdlib/math/atan/)                                                                                                 |
| [ATAN2](/influxdb/latest/query_language/functions#atan2)                                                                           | [math.atan2()](/flux/v0.65/stdlib/math/atan2/)                                                                                               |
| [CEIL](/influxdb/latest/query_language/functions#ceil)                                                                             | [math.ceil()](/flux/v0.65/stdlib/math/ceil/)                                                                                                 |
| [COS](/influxdb/latest/query_language/functions#cos)                                                                               | [math.cos()](/flux/v0.65/stdlib/math/cos/)                                                                                                   |
| [CUMULATIVE_SUM](/influxdb/latest/query_language/functions#cumulative-sum)                                                         | [cumulativeSum()](/flux/v0.65/stdlib/built-in/transformations/cumulativesum/)                                                                |
| [DERIVATIVE](/influxdb/latest/query_language/functions#derivative)                                                                 | [derivative()](/flux/v0.65/stdlib/built-in/transformations/aggregates/derivative/)                                                           |
| [DIFFERENCE](/influxdb/latest/query_language/functions#difference)                                                                 | [difference()](/flux/v0.65/stdlib/built-in/transformations/aggregates/difference/)                                                           |
| [ELAPSED](/influxdb/latest/query_language/functions#elapsed)                                                                       | [elapsed()](/flux/v0.65/stdlib/built-in/transformations/elapsed/)                                                                            |
| [EXP](/influxdb/latest/query_language/functions#exp)                                                                               | [math.exp()](/flux/v0.65/stdlib/math/exp/)                                                                                                   |
| [FLOOR](/influxdb/latest/query_language/functions#floor)                                                                           | [math.floor()](/flux/v0.65/stdlib/math/floor/)                                                                                               |
| [HISTOGRAM](/influxdb/latest/query_language/functions#histogram)                                                                   | [histogram()](/flux/v0.65/stdlib/built-in/transformations/histogram/)                                                                        |
| [LN](/influxdb/latest/query_language/functions#ln)                                                                                 | [math.log()](/flux/v0.65/stdlib/math/log/)                                                                                                   |
| [LOG](/influxdb/latest/query_language/functions#log)                                                                               | [math.logb()](/flux/v0.65/stdlib/math/logb/)                                                                                                 |
| [LOG2](/influxdb/latest/query_language/functions#log2)                                                                             | [math.log2()](/flux/v0.65/stdlib/math/log2/)                                                                                                 |
| [LOG10](/influxdb/latest/query_language/functions#logt10)                                                                          | [math.log10()](/flux/v0.65/stdlib/math/log10/)                                                                                               |
| [MOVING_AVERAGE](/influxdb/latest/query_language/functions#moving-average)                                                         | [movingAverage()](/flux/v0.65/stdlib/built-in/transformations/aggregates/movingaverage/)                                                     |
| [NON_NEGATIVE_DERIVATIVE](/influxdb/latest/query_language/functions#non-negative-derivative)                                       | [derivative(nonNegative:true)](/flux/v0.65/stdlib/built-in/transformations/aggregates/derivative/)                                           |
| [NON_NEGATIVE_DIFFERENCE](/influxdb/latest/query_language/functions#non-negative-difference)                                       | [difference(nonNegative:true)](/flux/v0.65/stdlib/built-in/transformations/aggregates/derivative/)                                           |
| [POW](/influxdb/latest/query_language/functions#pow)                                                                               | [math.pow()](/flux/v0.65/stdlib/math/pow/)                                                                                                   |
| [ROUND](/influxdb/latest/query_language/functions#round)                                                                           | [math.round()](/flux/v0.65/stdlib/math/round/)                                                                                               |
| [SIN](/influxdb/latest/query_language/functions#sin)                                                                               | [math.sin()](/flux/v0.65/stdlib/math/sin/)                                                                                                   |
| [SQRT](/influxdb/latest/query_language/functions#sqrt)                                                                             | [math.sqrt()](/flux/v0.65/stdlib/math/sqrt/)                                                                                                 |
| [TAN](/influxdb/latest/query_language/functions#tan)                                                                               | [math.tan()](/flux/v0.65/stdlib/math/tan/)                                                                                                   |
| [HOLT_WINTERS](/influxdb/latest/query_language/functions#holt-winters)                                                             | [holtWinters()](/flux/v0.65/stdlib/built-in/transformations/aggregates/holtwinters/)                                                         |
| [CHANDE_MOMENTUM_OSCILLATOR](/influxdb/latest/query_language/functions#chande-momentum-oscillator)                                 | [chandeMomentumOscillator()](/flux/v0.65/stdlib/built-in/transformations/aggregates/chandemomentumoscillator/)                               |
| [EXPONENTIAL_MOVING_AVERAGE](/influxdb/latest/query_language/functions#exponential-moving-average)                                 | [exponentialMovingAverage()](/flux/v0.65/stdlib/built-in/transformations/aggregates/exponentialmovingaverage/)                               |
| [DOUBLE_EXPONENTIAL_MOVING_AVERAGE](/influxdb/latest/query_language/functions#double-exponential-moving-average)                   | [doubleEMA()](/flux/v0.65/stdlib/built-in/transformations/aggregates/doubleema/)                                                             |
| [KAUFMANS_EFFICIENCY_RATIO](/influxdb/latest/query_language/functions#kaufmans-efficiency-ratio)                                   | [kaufmansER()](/flux/v0.65/stdlib/built-in/transformations/aggregates/kaufmanser/)                                                           |
| [KAUFMANS_ADAPTIVE_MOVING_AVERAGE](/influxdb/latest/query_language/functions#kaufmans-adaptive-moving-average)                     | [kaufmansAMA()](/flux/v0.65/stdlib/built-in/transformations/aggregates/kaufmansama/)                                                         |
| [TRIPLE_EXPONENTIAL_MOVING_AVERAGE](/influxdb/latest/query_language/functions#triple-exponential-moving-average)                   | [tripleEMA()](/flux/v0.65/stdlib/built-in/transformations/aggregates/tripleema/)                                                             |
| [TRIPLE_EXPONENTIAL_DERIVATIVE](/influxdb/latest/query_language/functions#triple-exponential-derivative)                           | [tripleExponentialDerivative()](/flux/v0.65/stdlib/built-in/transformations/aggregates/tripleexponentialderivative/)                         |
| [RELATIVE_STRENGTH_INDEX](/influxdb/latest/query_language/functions#relative-strength-index)                                       | [relativeStrengthIndex()](/flux/v0.65/stdlib/built-in/transformations/aggregates/relativestrengthindex/)                                     |

_<span style="font-size:.9rem" id="footnote"><span style="color:orange">*</span> The <code>to()</code> function only writes to InfluxDB 2.0.</span>_
