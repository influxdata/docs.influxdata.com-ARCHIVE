---
title: kaufmansAMA() function
description: >
  The `kaufmansAMA()` function calculates the Kaufman''s Adaptive Moving
  Average (KAMA) using values in an input table.
menu:
  flux_0_65:
    name: kaufmansAMA
    parent: Aggregates
    weight: 1
aliases:
  - /flux/v0.65/functions/built-in/transformations/aggregates/kaufmansama/
---

The `kaufmansAMA()` function calculates the Kaufman's Adaptive Moving Average (KAMA)
using values in an input table.

_**Function type:** Aggregate_

```js
kaufmansAMA(
  n: 10,
  columns: ["_value"]
)
```

Kaufman's Adaptive Moving Average is a trend-following indicator designed to account
for market noise or volatility.

## Parameters

### n
The period or number of points to use in the calculation.

_**Data type:** Integer_

### column
The column to operate on.
Defaults to `"_value"`.

_**Data type:** String_

## Examples
```js
from(bucket: "telegraf/autogen"):
  |> range(start: -7d)
  |> kaufmansAMA(
    n: 10,
    column: "_value"
  )
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[KAUFMANS_ADAPTIVE_MOVING_AVERAGE](/influxdb/latest/query_language/functions/#kaufmans-adaptive-moving-average)
