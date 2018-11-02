---
title: toUInt() function
description: placeholder
menu:
  flux_0_7:
    name: toUInt
    parent: Functions
    weight: 1
---

The `toUInt()` function converts a value to an uinteger.

_**Function type:** Type conversion_  
_**Output data type:** UInteger_

```js
toUInt()
```

## Examples
```js
from(bucket: "telegraf")
  |> filter(fn:(r) => r._measurement == "mem" and r._field == "used")
  |> toUInt()
```

## Function definition
```js
toUInt = (table=<-) => table |> map(fn:(r) => uint(v:r._value))
```
