---
title: mean() function
description: placeholder
menu:
  flux_0_7:
    name: mean
    parent: Functions
    weight: 1
---

The `mean()` function computes the mean or average of non-null records in the input table.

_**Function type:** aggregate_  
_**Output data type:** float_

```js
mean(columns: ["_value"])
```

## Parameters

### columns
A list of columns on which to compute the mean.
Defaults to `["_value"]`

_**Data type:** array of strings_

## Examples
```js
from(bucket:"telegraf/autogen")
    |> filter(fn: (r) =>
      r._measurement == "mem" AND
      r._field == "used_percent")
    |> range(start:-12h)
    |> window(every:10m)
    |> mean()
```
