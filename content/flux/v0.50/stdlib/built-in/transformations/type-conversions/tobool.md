---
title: toBool() function
description: The toBool() function converts a value to a boolean.
aliases:
  - /flux/v0.50/functions/transformations/type-conversions/tobool
  - /flux/v0.50/functions/built-in/transformations/type-conversions/tobool/
menu:
  flux_0_50:
    name: toBool
    parent: built-in-type-conversions
    weight: 1
---

The `toBool()` function converts a value to a boolean.

_**Function type:** Type conversion_  
_**Output data type:** Boolean_

```js
toBool()
```

## Examples
```js
from(bucket: "telegraf")
  |> filter(fn:(r) =>
    r._measurement == "mem" and
    r._field == "used"
  )
  |> toBool()
```

## Function definition
```js
toBool = (tables=<-) =>
  tables
    |> map(fn:(r) => ({ r with _value: bool(v: r._value) }))
```
