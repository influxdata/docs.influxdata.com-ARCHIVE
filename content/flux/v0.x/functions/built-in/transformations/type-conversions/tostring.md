---
title: toString() function
description: The toString() function converts a value to a string.
aliases:
  - /flux/v0.x/functions/transformations/type-conversions/tostring
menu:
  flux_0_x:
    name: toString
    parent: built-in-type-conversions
    weight: 1
---

The `toString()` function converts a value to a string.

_**Function type:** Type conversion_  
_**Output data type:** String_

```js
toString()
```

## Examples
```js
from(bucket: "telegraf")
  |> filter(fn:(r) =>
    r._measurement == "mem" and
    r._field == "used"
  )
  |> toString()
```

## Function definition
```js
toString = (tables=<-) =>
  tables
    |> map(fn:(r) => string(v: r._value))
```
