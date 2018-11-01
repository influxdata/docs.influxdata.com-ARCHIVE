---
title: skew() function
description: placeholder
menu:
  flux_0_7:
    name: skew
    parent: Functions
    weight: 1
---

The `skew()` function outputs the skew of non-null records as a float.

_**Function type:** aggregate_  
_**Output data type:** float_

```js
skew(columns: ["_value"])
```

## Parameters

### columns
Specifies a list of columns on which to operate. Defaults to `["_value"]`.

_**Data type:** list of strings_

## Examples
```js
from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> filter(fn: (r) => r._measurement == "cpu" AND r._field == "usage_system")
  |> skew()
```
