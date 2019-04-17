---
title: int() function
description: The `int()` function converts a single value to an integer.
menu:
  flux_0_x:
    name: int
    parent: built-in-type-conversions
weight: 2
---

The `int()` function converts a single value to an integer.

_**Function type:** Type conversion_  
_**Output data type:** Integer_

```js
int(v: "4")
```

## Parameters

### v
The value to convert.

## Examples
```js
from(bucket: "sensor-data")
  |> filter(fn:(r) =>
    r._measurement == "camera" and
  )
  |> map(fn:(r) => int(v: r.exposures))
```
