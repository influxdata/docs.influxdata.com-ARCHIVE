---
title: toTime() function
description: placeholder
menu:
  flux_0_7:
    name: toTime
    parent: Functions
    weight: 1
---

The `toTime()` function converts a value to a time.

_**Function type:** Type conversion_  
_**Output data type:** Time_

```js
toTime()
```

## Examples
```js
from(bucket: "telegraf")
  |> filter(fn:(r) => r._measurement == "mem" and r._field == "used")
  |> toTime()
```

## Function definition
```js
toTime = (table=<-) => table |> map(fn:(r) => time(v:r._value))
```
