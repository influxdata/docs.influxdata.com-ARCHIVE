---
title: toBool() function
description: The toBool() function converts a value to a boolean.
menu:
  flux_0_7:
    name: toBool
    parent: Type conversions
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
  |> filter(fn:(r) => r._measurement == "mem" AND r._field == "used")
  |> toBool()
```

## Function definition
```js
toBool = (table=<-) => table |> map(fn:(r) => bool(v: r._value))
```
