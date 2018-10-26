---
title: toFloat() function
description: placeholder
menu:
  flux_0_7:
    name: toFloat
    parent: Functions
    weight: 1
---

The `toFloat()` function converts a value to a float.

_**Function type:** type conversion_  
_**Output data type:** float_

```js
toFloat()
```

## Examples
```js
from(bucket: "telegraf")
  |> filter(fn:(r) => r._measurement == "mem" and r._field == "used")
  |> toFloat()
```

## Function definition
```js
toFloat = (table=<-) => table |> map(fn:(r) => float(v: r._value))
```
