---
title: percentile() function
description: placeholder
menu:
  flux_0_7:
    name: percentile
    parent: Functions
    weight: 1
---

The `percentile()` function is both an aggregate and selector function depending on the [`method`](#method) used.

When using the `estimate_tdigest` or `exact_mean` methods, it outputs non-null records with values that fall within the specified percentile.

When using the `exact_selector` method, it outputs the non-null record with the value that represents the specified percentile.

_**Function type:** aggregate and selector_  
_**Output data type:** float_

```js
percentile(columns: ["_value"], percentile: 0.99, method: "estimate_tdigest", compression: 1000)
```

## Parameters

### columns
A list of columns on which to compute the percentile.
Defaults to `["_value"]`

_**Data type:** array of strings_

### percentile
A value between 0 and 1 indicating the desired percentile.

_**Data type:** float_

### method
Defines the method of computation.

_**Data type:** string_

The available options are:

##### estimate_tdigest
An aggregate method that uses a [t-digest data structure](https://github.com/tdunning/t-digest)
to compute an accurate percentile estimate on large data sources.

##### exact_mean
An aggregate method that takes the average of the two points closest to the percentile value.

##### exact_selector
A selector method that returns the data point for which at least percentile points are less than.

### compression
Indicates how many centroids to use when compressing the dataset.
A larger number produces a more accurate result at the cost of increased memory requirements.
Defaults to 1000.

_**Data type:** float_

## Examples

###### Percentile as an aggregate
```js
from(bucket: "telegraf/autogen")
	|> range(start: -5m)
	|> filter(fn: (r) =>
    r._measurement == "cpu" AND
    r._field == "usage_system")
	|> percentile(percentile: 0.99, method: "estimate_tdigest", compression: 1000)
```

###### Percentile as a selector
```js
from(bucket: "telegraf/autogen")
	|> range(start: -5m)
	|> filter(fn: (r) =>
    r._measurement == "cpu" AND
    r._field == "usage_system")
	|> percentile(percentile: 0.99, method: "exact_selector")
```
