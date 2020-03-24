---
title: skew() function
description: The skew() function outputs the skew of non-null records as a float.
aliases:
  - /flux/v0.64/functions/transformations/aggregates/skew
  - /flux/v0.64/functions/built-in/transformations/aggregates/skew/
menu:
  flux_0_64:
    name: skew
    parent: Aggregates
    weight: 1
---

The `skew()` function outputs the skew of non-null records as a float.

_**Function type:** Aggregate_  
_**Output data type:** Float_

```js
skew(column: "_value")
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
  |> skew()
```
