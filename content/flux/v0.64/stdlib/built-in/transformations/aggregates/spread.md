---
title: spread() function
description: The spread() function outputs the difference between the minimum and
  maximum values in a specified column.
aliases:
  - /flux/v0.64/functions/transformations/aggregates/spread
  - /flux/v0.64/functions/built-in/transformations/aggregates/spread/
menu:
  flux_0_64:
    name: spread
    parent: Aggregates
    weight: 1
---

The `spread()` function outputs the difference between the minimum and maximum values in a specified column.
Only `uint`, `int`, and `float` column types can be used.
The type of the output column depends on the type of input column:

- For columns with type `uint` or `int`, the output is an `int`
- For columns with type `float`, the output is a float.

_**Function type:** Aggregate_  
_**Output data type:** Integer or Float (inherited from input column type)_

```js
spread(column: "_value")
```

## Parameters

### column
The column on which to operate. Defaults to `"_value"`.

_**Data type:** String_

## Examples
```js
from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system"
  )
  |> spread()
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[SPREAD()](/influxdb/latest/query_language/functions/#spread)  
