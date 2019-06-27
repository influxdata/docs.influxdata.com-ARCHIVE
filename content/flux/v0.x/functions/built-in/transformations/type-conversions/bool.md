---
title: bool() function
description: The `bool()` function converts a single value to a boolean.
menu:
  flux_0_x:
    name: bool
    parent: built-in-type-conversions
weight: 2
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

## Examples
```js
from(bucket: "sensor-data")
  |> filter(fn:(r) =>
    r._measurement == "system" and
  )
  |> map(fn:(r) => ({ r with responsive: bool(v: r.responsive) }))
```
