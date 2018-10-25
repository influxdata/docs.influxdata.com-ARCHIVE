---
title: cumulativeSum() function
description: placeholder
menu:
  flux_0_7:
    name: cumulativeSum
    parent: Functions
    weight: 1
---

The `cumulativeSum()` function computes a running sum for non-null records in the table.
The output table schema will be the same as the input table.

_**Function type:** aggregate_  
_**Output data type:** float_

```js
covariance(columns: ["_value"])
```

## Parameters

### columns
A list of columns on which to operate.
Defaults to `["_value"]`.

_**Data type:** array of strings_

## Examples
```js
from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> filter(fn: (r) => r._measurement == "disk" AND r._field == "used_percent")
  |> cumulativeSum(columns: ["_value"])
```
