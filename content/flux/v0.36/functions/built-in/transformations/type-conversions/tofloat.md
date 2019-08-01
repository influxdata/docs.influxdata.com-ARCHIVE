---
title: toFloat() function
description: The toFloat() function converts a value to a float.
aliases:
  - /flux/v0.36/functions/transformations/type-conversions/tofloat
menu:
  flux_0_36:
    name: toFloat
    parent: built-in-type-conversions
    weight: 1
---

The `toFloat()` function converts a value to a float.

_**Function type:** Type conversion_  
_**Output data type:** Float_

```js
toFloat()
```

## Examples
```js
from(bucket: "telegraf")
  |> filter(fn:(r) =>
    r._measurement == "mem" and
    r._field == "used"
  )
  |> toFloat()
```

## Function definition
```js
toFloat = (tables=<-) =>
  tables
    |> map(fn:(r) => float(v: r._value))
```
