---
title: toUInt() function
description: The toUInt() function converts a value to an uinteger.
aliases:
  - /flux/v0.24/functions/transformations/type-conversions/touint
menu:
  flux_0_24:
    name: toUInt
    parent: built-in-type-conversions
    weight: 1
---

The `toUInt()` function converts a value to an UInteger.

_**Function type:** Type conversion_  
_**Output data type:** UInteger_

```js
toUInt()
```

## Examples
```js
from(bucket: "telegraf")
  |> filter(fn:(r) =>
    r._measurement == "mem" and
    r._field == "used"
  )
  |> toUInt()
```

## Function definition
```js
toUInt = (tables=<-) =>
  tables
    |> map(fn:(r) => uint(v:r._value))
```
