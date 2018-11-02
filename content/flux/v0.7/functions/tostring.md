---
title: toString() function
description: The toString() function converts a value to a string.
menu:
  flux_0_7:
    name: toString
    parent: Functions
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
  |> filter(fn:(r) => r._measurement == "mem" and r._field == "used")
  |> toString()
```

## Function definition
```js
toString = (table=<-) => table |> map(fn:(r) => string(v: r._value))
```
