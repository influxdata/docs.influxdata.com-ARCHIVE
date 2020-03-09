---
title: float() function
description: The `float()` function converts a single value to a float.
menu:
  flux_0_x:
    name: float
    parent: built-in-type-conversions
weight: 2
aliases:
  - /flux/v0.x/functions/built-in/transformations/type-conversions/float/
---

The `float()` function converts a single value to a float.

_**Function type:** Type conversion_  
_**Output data type:** Float_

```js
float(v: "3.14")
```

## Parameters

### v
The value to convert.

_**Data type:** Boolean | Numeric String | Integer | Uinteger_

## Examples
```js
from(bucket: "sensor-data")
  |> range(start: -1m)
  |> filter(fn:(r) => r._measurement == "camera" )
  |> map(fn:(r) => ({ r with aperature: float(v: r.aperature) }))
```
