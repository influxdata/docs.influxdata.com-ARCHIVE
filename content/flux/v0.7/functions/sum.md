---
title: sum() function
description: placeholder
menu:
  flux_0_7:
    name: sum
    parent: Functions
    weight: 1
---

The `sum()` function computes the sum of non-null records in specified columns.

_**Function type:** aggregate_  
_**Output data type:** integer, uinteger, or float (inherited from column type)_

```js
sum(columns: ["_value"])
```

## Parameters

### columns
Specifies a list of columns on which to operate.
Defaults to `["_value"]`.

_**Data type:** array of strings_

## Examples
```js
from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> filter(fn: (r) => r._measurement == "cpu" and r._field == "usage_system")
  |> sum()
```
