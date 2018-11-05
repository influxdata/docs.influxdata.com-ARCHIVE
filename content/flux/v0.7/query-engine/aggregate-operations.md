---
title: Aggregate operations
description:
menu:
  flux_0_7:
    parent: Query engine
    name: Aggregate operations
    weight:
---

Aggregate operations output a table for every input table they receive.
A list of columns to aggregate must be provided to the operation.
The `aggregate` function is applied to each column in isolation.

Any output table will have the following properties:

* It always contains a single record.
* It will have the same group key as the input table.
* It will contain a column for each provided aggregate column.
  * The column label will be the same as the input table.
  * The type of the column depends on the specific aggregate operation.
* It will not have a `_time` column

All aggregate operations have the following properties:

* `columns` list of string
  * columns specifies a list of columns to aggregate.

## Covariance

Covariance is an aggregate operation.
Covariance computes the covariance between two columns.

Covariance has the following properties:

* `columns` list of string
  * columns specifies a list of columns to aggregate. Defaults to `["_value"]`
* `pearsonr` bool
  * pearsonr indicates whether the result should be normalized to be the Pearson R coefficient.
* `valueDst` string
  * valueDst is the column into which the result will be placed.
  * Defaults to `_value`.

Additionally exactly two columns must be provided to the `columns` property.

Example:
`from(bucket: "telegraf) |> range(start:-5m) |> covariance(columns: [/autogen"x", "y"])`

## Count

Count is an aggregate operation.
For each aggregated column, it outputs the number of non null records as an integer.

Count has the following property:

* `columns` list of string
    columns specifies a list of columns to aggregate. Defaults to `["_value"]`

Example:
`from(bucket: "telegraf/autogen") |> range(start: -5m) |> count()`

## Integral

Integral is an aggregate operation.
For each aggregate column, it outputs the area under the curve of non null records.
The curve is defined as function where the domain is the record times and the range is the record values.

Integral has the following properties:

* `columns` list of string
  * columns specifies a list of columns to aggregate. Defaults to `["_value"]`
* `unit` duration
  * unit is the time duration to use when computing the integral

**Example:**

```
from(bucket: "telegraf/autogen")
    |> range(start: -5m)
    |> filter(fn: (r) => r._measurement == "cpu" and r._field == "usage_system")
    |> integral(unit:10s)
```

## Mean

Mean is an aggregate operation.
For each aggregated column, it outputs the mean of the non null records as a float.

Mean has the following property:

* `columns` list of string
  * columns specifies a list of columns to aggregate.
  * Defaults to `["_value"]`

**Example:**

```
from(bucket:"telegraf/autogen")
    |> filter(fn: (r) => r._measurement == "mem" AND
            r._field == "used_percent")
    |> range(start:-12h)
    |> window(every:10m)
    |> mean()
```

## Percentile (aggregate)

Percentile is both an aggregate operation and a selector operation depending on selected options.
In the aggregate methods, it outputs the value that represents the specified percentile of the non null record as a float.

Percentile has the following properties:

* `columns` list of string
  * columns specifies a list of columns to aggregate. Defaults to `["_value"]`
* `percentile` float
  * A value between `0` and `1` indicating the desired percentile.
* `method` string
  * percentile provides three methods for computation:
    * `estimate_tdigest`: an aggregate result that uses a tdigest data structure to compute an accurate percentile estimate on large data sources.
    * `exact_mean`: an aggregate result that takes the average of the two points closest to the percentile value.
    * `exact_selector`: see [Percentile (selector)](/flux/v0.7/language/query-engine/selector-operations#Percentile-selector)
* `compression` float
  * compression indicates how many centroids to use when compressing the dataset.
  * A larger number produces a more accurate result at the cost of increased memory requirements.
  * Defaults to 1000.

**Example:**

```
// Determine 99th percentile cpu system usage:
from(bucket: "telegraf/autogen")
	|> range(start: -5m)
	|> filter(fn: (r) => r._measurement == "cpu" and r._field == "usage_system")
	|> percentile(p: 0.99, method: "estimate_tdigest", compression: 1000)
```

## Skew

Skew is an aggregate operation.
For each aggregated column, it outputs the skew of the non null record as a float.

Skew has the following parameter:

* `columns` list of string
  * columns specifies a list of columns to aggregate. Defaults to `["_value"]`

**Example:**

```
from(bucket: "telegraf/autogen")
    |> range(start: -5m)
    |> filter(fn: (r) => r._measurement == "cpu" and r._field == "usage_system")
    |> skew()
```

## Spread

Spread is an aggregate operation.
For each aggregated column, it outputs the difference between the min and max values.
The type of the output column depends on the type of input column: for input columns with type `uint` or `int`, the output is an `int`; for `float` input columns the output is a `float`.
All other input types are invalid.

Spread has the following parameter:

* `columns` list of string
  * columns specifies a list of columns to aggregate. Defaults to `["_value"]`

**Example:**

```
from(bucket: "telegraf/autogen")
    |> range(start: -5m)
    |> filter(fn: (r) => r._measurement == "cpu" and r._field == "usage_system")
    |> spread()
```

## Stddev

Stddev is an aggregate operation.
For each aggregated column, it outputs the standard deviation of the non null record as a float.

Stddev has the following parameter:

* `columns` list of string
    columns specifies a list of columns to aggregate. Defaults to `["_value"]`

**Example:**

```
from(bucket: "telegraf/autogen")
    |> range(start: -5m)
    |> filter(fn: (r) => r._measurement == "cpu" and r._field == "usage_system")
    |> stddev()
```

## Sum

Sum is an aggregate operation.
For each aggregated column, it outputs the sum of the non null record.
The output column type is the same as the input column type.

Sum has the following parameter:

* `columns` list of string
  * `columns` specifies a list of columns to aggregate.
  * Defaults to `["_value"]`

**Example:**

```
from(bucket: "telegraf/autogen")
    |> range(start: -5m)
    |> filter(fn: (r) => r._measurement == "cpu" and r._field == "usage_system")
    |> sum()
```

## Multiple aggregates

Multiple aggregates can be applied to the same table using the `aggregate` function.

[IMPL#139](https://github.com/influxdata/platform/issues/139) Add aggregate function
