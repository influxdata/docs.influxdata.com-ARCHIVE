---
title: duration() function
description: The `duration()` function converts a single value to a duration.
menu:
  flux_0_x:
    name: duration
    parent: built-in-type-conversions
weight: 2
---

The `duration()` function converts a single value to a duration.

_**Function type:** Type conversion_  
_**Output data type:** Duration_

```js
duration(v: "1m")
```

## Parameters

### v
The value to convert.

## Examples
```js
from(bucket: "sensor-data")
  |> range(start: -1m)
  |> filter(fn:(r) => r._measurement == "system" )
  |> map(fn:(r) => ({ r with uptime: duration(v: r.uptime) }))
```
