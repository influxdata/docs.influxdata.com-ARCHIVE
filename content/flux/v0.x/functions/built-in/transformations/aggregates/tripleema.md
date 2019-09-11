---
title: tripleEMA() function
description: >
  The `tripleEMA()` function calculates the exponential moving average of values
  grouped into `n` number of points, giving more weight to recent data with less lag
  than `exponentialMovingAverage()` and `doubleEMA()`.
menu:
  flux_0_x:
    name: tripleEMA
    parent: Aggregates
    weight: 1
---

The `tripleEMA()` function calculates the exponential moving average of values in
the `_value` column grouped into `n` number of points, giving more weight to recent
data with less lag than
[`exponentialMovingAverage()`](/flux/v0.x/functions/built-in/transformations/aggregates/exponentialmovingaverage/)
and [`doubleEMA()`](/flux/v0.x/functions/built-in/transformations/aggregates/doubleema/).

_**Function type:** Aggregate_  

```js
tripleEMA(n: 5)
```

##### Triple exponential moving average rules:
- A triple exponential moving average is defined as `tripleEMA = (3 * EMA_1) - (3 * EMA_2) + EMA_3`.
  - `EMA_1` is the exponential moving average of the original data.
  - `EMA_2` is the exponential moving average of `EMA_1`.
  - `EMA_3` is the exponential moving average of `EMA_2`.
- A true triple exponential moving average requires at least requires at least `3 * n - 2` values.
  If not enough values exist to calculate the triple EMA, it returns a `NaN` value.
- `tripleEMA()` inherits all [exponential moving average rules](/flux/v0.x/functions/built-in/transformations/aggregates/exponentialmovingaverage/#exponential-moving-average-rules).

## Parameters

### n
The number of points to average.

_**Data type:** Integer_

## Examples

#### Calculate a five point triple exponential moving average
```js
from(bucket: "telegraf/autogen"):
  |> range(start: -12h)
  |> tripleEMA(n: 5)
```

## Function definition
```js
tripleEMA = (n, tables=<-) =>
	tables
		|> exponentialMovingAverage(n:n)
		|> duplicate(column:"_value", as:"ema1")
    |> exponentialMovingAverage(n:n)
		|> duplicate(column:"_value", as:"ema2")
		|> exponentialMovingAverage(n:n)
		|> map(fn: (r) => ({r with _value: 3.0 * r.ema1 - 3.0 * r.ema2 + r._value}))
		|> drop(columns: ["ema1", "ema2"])
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[TRIPLE_EXPONENTIAL_MOVING_AVERAGE](/influxdb/latest/query_language/functions/#triple-exponential-moving-average)
