---
title: kaufmansER() function
description: >
  The `kaufmansER()` function calculates the Kaufman''s Efficiency Ratio
  (KER) using values in an input table.
menu:
  flux_0_x:
    name: kaufmansER
    parent: Aggregates
    weight: 1
aliases:
  - /flux/v0.x/functions/built-in/transformations/aggregates/kaufmanser/
---

The `kaufmansER()` function calculates the Kaufman's Efficiency Ratio (KER) using
values in an input table.
The function operates on the `_value` column.

_**Function type:** Aggregate_

```js
kaufmansER(n: 10)
```

Kaufman's Efficiency Ratio indicator divides the absolute value of the
Chande Momentum Oscillator by 100 to return a value between 0 and 1.
Higher values represent a more efficient or trending market.

## Parameters

### n
The period or number of points to use in the calculation.

_**Data type: Integer**_

## Examples
```js
from(bucket: "telegraf/autogen")
  |> range(start: -7d)
  |> kaufmansER(n: 10)
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[KAUFMANS_EFFICIENCY_RATIO](/influxdb/latest/query_language/functions/#kaufmans-efficiency-ratio)
