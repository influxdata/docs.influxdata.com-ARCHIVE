---
title: integral() function
description: The integral() function computes the area under the curve per unit of time of subsequent non-null records.
aliases:
  - /flux/v0.36/functions/transformations/aggregates/integral
menu:
  flux_0_36:
    name: integral
    parent: Aggregates
    weight: 1
---

The `integral()` function computes the area under the curve per [`unit`](#unit) of time of subsequent non-null records.
The curve is defined using `_time` as the domain and record values as the range.

_**Function type:** Aggregate_  
_**Output data type:** Float_

```js
integral(unit: 10s, column: "_value")
```

## Parameters

### unit
The time duration used when computing the integral.

_**Data type:** Duration_

### column
The column on which to operate.
Defaults to `"_value"`.

_**Data type:** String_

## Examples
```js
from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system"
  )
  |> integral(unit:10s)
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[INTEGRAL()](/influxdb/latest/query_language/functions/#integral)
