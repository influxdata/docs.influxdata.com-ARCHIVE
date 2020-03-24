---
title: bool() function
description: The `bool()` function converts a single value to a boolean.
menu:
  flux_0_64:
    name: bool
    parent: built-in-type-conversions
weight: 2
aliases:
  - /flux/v0.64/functions/built-in/transformations/type-conversions/bool/
---

The `bool()` function converts a single value to a boolean.

_**Function type:** Type conversion_  
_**Output data type:** Boolean_

```js
bool(v: "true")
```

## Parameters

### v
The value to convert.

_**Data type:** String | Float | Integer | Uinteger_

## Examples
```js
from(bucket: "sensor-data")
  |> range(start: -1m)
  |> filter(fn:(r) => r._measurement == "system" )
  |> map(fn:(r) => ({ r with responsive: bool(v: r.responsive) }))
```
