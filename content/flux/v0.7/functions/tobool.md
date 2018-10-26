---
title: toBool() function
description: placeholder
menu:
  flux_0_7:
    name: toBool
    parent: Functions
    weight: 1
---

The `toBool()` function converts a value to a boolean.

_**Function type:** type conversion_  
_**Output data type:** boolean_

```js
toBool()
```

## Examples
```js
from(bucket: "telegraf")
  |> filter(fn:(r) => r._measurement == "mem" AND r._field == "used")
  |> toBool()
```

## Function definition
```js
toBool = (table=<-) => table |> map(fn:(r) => bool(v: r._value))
```
