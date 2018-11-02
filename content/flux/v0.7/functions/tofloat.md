---
title: toFloat() function
description: The toFloat() function converts a value to a float.
menu:
  flux_0_7:
    name: toFloat
    parent: Functions
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
  |> filter(fn:(r) => r._measurement == "mem" AND r._field == "used")
  |> toFloat()
```

## Function definition
```js
toFloat = (table=<-) => table |> map(fn:(r) => float(v: r._value))
```
