---
title: uint() function
description: The `uint()` function converts a single value to a UInteger.
menu:
  flux_0_x:
    name: uint
    parent: built-in-type-conversions
weight: 2
---

The `uint()` function converts a single value to a UInteger.

_**Function type:** Type conversion_  
_**Output data type:** UInteger_

```js
uint(v: "4")
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
  |> map(fn:(r) => uint(v: r.exposures))
```
