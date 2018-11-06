---
title: spread() function
description: The spread() function outputs the difference between the minimum and maximum values in each specified column.
menu:
  flux_0_7:
    name: spread
    parent: Aggregates
    weight: 1
---

The `spread()` function outputs the difference between the minimum and maximum values in each specified column.
Only `uint`, `int`, and `float` column types can be used.
The type of the output column depends on the type of input column:

- For input columns with type `uint` or `int`, the output is an `int`
- For input columns with type `float` the output is a float.

_**Function type:** Aggregate_  
_**Output data type:** Integer or Float (inherited from input column type)_

```js
spread(columns: ["_value"])
```

## Parameters

### columns
Specifies a list of columns on which to operate. Defaults to `["_value"]`.

_**Data type:** Array of strings_

## Examples
```js
from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> filter(fn: (r) => r._measurement == "cpu" AND r._field == "usage_system")
  |> spread()
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[SPREAD()](/influxdb/latest/query_language/functions/#spread)  
