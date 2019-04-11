---
title: stddev() function
description: The stddev() function computes the standard deviation of non-null records in a specified column.
aliases:
  - /flux/v0.x/functions/transformations/aggregates/stddev
menu:
  flux_0_x:
    name: stddev
    parent: Aggregates
    weight: 1
---

The `stddev()` function computes the standard deviation of non-null records in a specified column.

_**Function type:** Aggregate_  
_**Output data type:** Float_

```js
stddev(column: "_value")
```

## Parameters

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
  |> stddev()
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[STDDEV()](/influxdb/latest/query_language/functions/#stddev)  
