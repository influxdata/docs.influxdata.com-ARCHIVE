---
title: quantile() function
description: >
  The quantile() function outputs non-null records with values that fall within the specified
  quantile or the non-null record with the value that represents the specified quantile.
aliases:
  - /flux/v0.36/functions/transformations/aggregates/percentile
  - /flux/v0.36/functions/built-in/transformations/aggregates/percentile
menu:
  flux_0_36:
    name: quantile
    parent: Aggregates
    weight: 1
---

The `quantile()` function returns records from an input table with `_value`s that fall within
a specified quantile or it returns the record with the `_value` that represents the specified quantile.
Which it returns depends on the [method](#method) used.

_**Function type:** Aggregate or Selector_  
_**Output data type:** Float or Object_

```js
quantile(
  column: "_value",
  q: 0.99,
  method: "estimate_tdigest",
  compression: 1000.0
)
```

When using the `estimate_tdigest` or `exact_mean` methods, it outputs non-null
records with values that fall within the specified quantile.

When using the `exact_selector` method, it outputs the non-null record with the
value that represents the specified quantile.

## Parameters

### column
The column to use to compute the quantile.
Defaults to `"_value"`.

_**Data type:** String_

### q
A value between 0 and 1 indicating the desired quantile.

_**Data type:** Float_

### method
Defines the method of computation.

_**Data type:** String_

The available options are:

##### estimate_tdigest
An aggregate method that uses a [t-digest data structure](https://github.com/tdunning/t-digest)
to compute an accurate quantile estimate on large data sources.

##### exact_mean
An aggregate method that takes the average of the two points closest to the quantile value.

##### exact_selector
A selector method that returns the data point for which at least `q` points are less than.

### compression
Indicates how many centroids to use when compressing the dataset.
A larger number produces a more accurate result at the cost of increased memory requirements.
Defaults to 1000.

_**Data type:** Float_

## Examples

###### Quantile as an aggregate
```js
from(bucket: "telegraf/autogen")
	|> range(start: -5m)
	|> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system")
	|> quantile(
    q: 0.99,
    method: "estimate_tdigest",
    compression: 1000.0
  )
```

###### Quantile as a selector
```js
from(bucket: "telegraf/autogen")
	|> range(start: -5m)
	|> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system")
	|> quantile(
    q: 0.99,
    method: "exact_selector"
  )
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[PERCENTILE()](/influxdb/latest/query_language/functions/#percentile)  
