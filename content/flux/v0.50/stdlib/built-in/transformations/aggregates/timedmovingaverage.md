---
title: timedMovingAverage() function
description: >
  The `timedMovingAverage()` function calculates the mean of values in
  a defined time range at a specified frequency.
menu:
  flux_0_50:
    name: timedMovingAverage
    parent: Aggregates
weight: 501
aliases:
  - /flux/v0.50/functions/built-in/transformations/aggregates/timedmovingaverage/
---

The `timedMovingAverage()` function calculates the mean of values in a defined time
range at a specified frequency.

_**Function type:** Aggregate_  

```js
timedMovingAverage(
  every: 1d,
  period: 5d,
  column="_value"
)
```

## Parameters

### every
The frequency of time windows.

_**Data type:** Duration_

### period
The length of each averaged time window.
_A negative duration indicates start and stop boundaries are reversed._

_**Data type:** Duration_

### column
The column used to compute the moving average.
Defaults to `"_value"`.

_**Data type:** String_

## Examples

###### Calculate a seven day moving average every day
```js
from(bucket: "telegraf/autogen"):
  |> range(start: -7y)
  |> filter(fn: (r) =>
    r._measurement == "financial" and
    r._field == "closing_price"
  )
  |> timedMovingAverage(every: 1y, period: 5y)
```

###### Calculate a five year moving average every year
```js
from(bucket: "telegraf/autogen"):
  |> range(start: -50d)
  |> filter(fn: (r) =>
    r._measurement == "financial" and
    r._field == "closing_price"
  )
  |> timedMovingAverage(every: 1d, period: 7d)
```

## Function definition
```js
timedMovingAverage = (every, period, column="_value", tables=<-) =>
  tables
    |> window(every: every, period: period)
    |> mean(column:column)
    |> duplicate(column: "_stop", as: "_time")
    |> window(every: inf)
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[MOVING_AVERAGE()](/influxdb/latest/query_language/functions/#moving-average)
