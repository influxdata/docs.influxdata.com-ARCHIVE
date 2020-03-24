---
title: derivative() function
description: The derivative() function computes the rate of change per unit of time
  between subsequent non-null records.
aliases:
  - /flux/v0.64/functions/transformations/aggregates/derivative
  - /flux/v0.64/functions/built-in/transformations/aggregates/derivative/
menu:
  flux_0_64:
    name: derivative
    parent: Aggregates
    weight: 1
---

The `derivative()` function computes the rate of change per [`unit`](#unit) of time between subsequent non-null records.
It assumes rows are ordered by the `_time` column.
The output table schema is the same as the input table.

_**Function type:** Aggregate_  
_**Output data type:** Float_

```js
derivative(
  unit: 1s,
  nonNegative: false,
  column: "_value",
  timeSrc: "_time"
)
```

## Parameters

### unit
The time duration used when creating the derivative.
Defaults to `1s`.

_**Data type:** Duration_

### nonNegative
Indicates if the derivative is allowed to be negative.
When set to `true`, if a value is less than the previous value, it is assumed the previous value should have been a zero.

_**Data type:** Boolean_

### column
The column to use to compute the derivative.
Defaults to `"_value"`.

_**Data type:** String_

### timeSrc
The column containing time values.
Defaults to `"_time"`.

_**Data type:** String_

## Examples
```js
from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> derivative(unit: 1s, nonNegative: true)
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[DERIVATIVE()](/influxdb/latest/query_language/functions/#derivative)
