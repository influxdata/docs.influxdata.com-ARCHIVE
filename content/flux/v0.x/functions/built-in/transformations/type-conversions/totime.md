---
title: toTime() function
description: The toTime() function converts a value to a time.
aliases:
  - /flux/v0.x/functions/transformations/type-conversions/totime
menu:
  flux_0_x:
    name: toTime
    parent: Type conversions
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
  |> filter(fn:(r) =>
    r._measurement == "mem" and
    r._field == "used"
  )
  |> toTime()
```

## Function definition
```js
toTime = (tables=<-) =>
  tables
    |> map(fn:(r) => time(v:r._value))
```
