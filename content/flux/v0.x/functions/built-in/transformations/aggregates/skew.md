---
title: skew() function
description: The skew() function outputs the skew of non-null records as a float.
aliases:
  - /flux/v0.x/functions/transformations/aggregates/skew
menu:
  flux_0_x:
    name: skew
    parent: Aggregates
    weight: 1
---

The `skew()` function outputs the skew of non-null records as a float.

_**Function type:** Aggregate_  
_**Output data type:** Float_

```js
skew(columns: ["_value"])
```

## Parameters

### columns
Specifies a list of columns on which to operate. Defaults to `["_value"]`.

_**Data type:** Array of strings_

## Examples
```js
from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system"
  )
  |> skew()
```
