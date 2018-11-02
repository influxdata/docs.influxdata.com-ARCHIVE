---
title: toUInt() function
description: The toUInt() function converts a value to an uinteger.
menu:
  flux_0_7:
    name: toUInt
    parent: Type conversions
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
  |> filter(fn:(r) => r._measurement == "mem" AND r._field == "used")
  |> toUInt()
```

## Function definition
```js
toUInt = (table=<-) => table |> map(fn:(r) => uint(v:r._value))
```
