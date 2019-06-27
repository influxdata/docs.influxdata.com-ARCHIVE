---
title: cumulativeSum() function
description: The cumulativeSum() function computes a running sum for non-null records in the table.
aliases:
  - /flux/v0.33/functions/transformations/cumulativesum
menu:
  flux_0_33:
    name: cumulativeSum
    parent: Transformations
    weight: 1
---

The `cumulativeSum()` function computes a running sum for non-null records in the table.
The output table schema will be the same as the input table.

_**Function type:** Transformation  
_**Output data type:** Float_

```js
cumulativeSum(columns: ["_value"])
```

## Parameters

### columns
A list of columns on which to operate.
Defaults to `["_value"]`.

_**Data type:** Array of strings_

## Examples
```js
from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> filter(fn: (r) =>
    r._measurement == "disk" and
    r._field == "used_percent"
  )
  |> cumulativeSum(columns: ["_value"])
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[CUMULATIVE_SUM()](/influxdb/latest/query_language/functions/#cumulative-sum)
