---
title: median() function
description: >
  The `median()` function returns the median `_value` of an input table or all non-null
  records in the input table with values that fall within the `0.5` quantile (50th percentile).
aliases:
  - /flux/v0.x/functions/transformations/aggregates/median
menu:
  flux_0_x:
    name: median
    parent: Aggregates
    weight: 1
---

The `median()` function is a special application of the [`quantile()` function](/flux/v0.x/functions/built-in/transformations/aggregates/quantile)
that returns the median `_value` of an input table or all non-null records in the input table
with values that fall within the `0.5` quantile (50th percentile) depending on the [method](#method) used.

_**Function type:** Selector or Aggregate_  
_**Output data type:** Object_


```js
median(method: "estimate_tdigest", compression: 0.0)
```

When using the `estimate_tdigest` or `exact_mean` methods, it outputs non-null
records with values that fall within the `0.5` quantile.

When using the `exact_selector` method, it outputs the non-null record with the
value that represents the `0.5` quantile.

> The `median()` function can only be used with float value types.
> It is a special application of the [`quantile()` function](/flux/v0.x/functions/built-in/transformations/aggregates/quantile) which
> uses an approximation implementation that requires floats.
> You can convert your value column to a float column using the [`toFloat()` function](/flux/v0.x/functions/built-in/transformations/type-conversions/tofloat).

## Parameters

### method
Defines the method of computation. Defaults to `"estimate_tdigest"`.

_**Data type:** String_

The available options are:

##### estimate_tdigest
An aggregate method that uses a [t-digest data structure](https://github.com/tdunning/t-digest)
to compute an accurate quantile estimate on large data sources.

##### exact_mean
An aggregate method that takes the average of the two points closest to the quantile value.

##### exact_selector
A selector method that returns the data point for which at least quantile points are less than.

### compression
Indicates how many centroids to use when compressing the dataset.
A larger number produces a more accurate result at the cost of increased memory requirements.
Defaults to `1000.0`.

_**Data type:** Float_

## Examples

###### Median as an aggregate
```js
from(bucket: "telegraf/autogen")
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used_percent"
  )
  |> range(start:-12h)
  |> window(every:10m)
  |> median()
```

###### Median as a selector
```js
from(bucket: "telegraf/autogen")
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used_percent"
  )
  |> range(start:-12h)
  |> window(every:10m)
  |> median(method: "exact_selector")
```

## Function definition
```js
median = (method="estimate_tdigest", compression=0.0, tables=<-) =>
  quantile(
    q:0.5,
    method:method,
    compression:compression
  )
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[MEDIAN()](/influxdb/latest/query_language/functions/#median)  
