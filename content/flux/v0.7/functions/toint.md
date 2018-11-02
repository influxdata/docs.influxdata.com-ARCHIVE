---
title: toInt() function
description: placeholder
menu:
  flux_0_7:
    name: toInt
    parent: Functions
    weight: 1
---

The `toInt()` function converts a value to an integer.

_**Function type:** Type conversion_  
_**Output data type:** Integer_

```js
toInt()
```

## Examples
```js
from(bucket: "telegraf")
  |> filter(fn:(r) => r._measurement == "mem" and r._field == "used")
  |> toInt()
```

## Function definition
```js
toInt = (table=<-) => table |> map(fn:(r) => int(v: r._value))
```
