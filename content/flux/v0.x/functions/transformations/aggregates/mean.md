---
title: mean() function
description: The mean() function computes the mean or average of non-null records in the input table.
menu:
  flux_0_x:
    name: mean
    parent: Aggregates
    weight: 1
---

The `mean()` function computes the mean or average of non-null records in the input table.

_**Function type:** Aggregate_  
_**Output data type:** Float_

```js
mean(columns: ["_value"])
```

## Parameters

### columns
A list of columns on which to compute the mean.
Defaults to `["_value"]`.

_**Data type:** Array of strings_

## Examples
```js
from(bucket:"telegraf/autogen")
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used_percent")
  |> range(start:-12h)
  |> window(every:10m)
  |> mean()
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[MEAN()](/influxdb/latest/query_language/functions/#mean)  
