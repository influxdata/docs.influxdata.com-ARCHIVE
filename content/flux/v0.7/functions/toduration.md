---
title: toDuration() function
description: placeholder
menu:
  flux_0_7:
    name: toDuration
    parent: Functions
    weight: 1
---

The `toDuration()` function converts a value to a duration.

_**Function type:** type conversion_  
_**Output data type:** duration_

```js
toDuration()
```

## Examples
```js
from(bucket: "telegraf")
  |> filter(fn:(r) => r._measurement == "mem" AND r._field == "used")
  |> toDuration()
```

## Function definition
```js
toDuration = (table=<-) => table |> map(fn:(r) => duration(v: r._value))
```
