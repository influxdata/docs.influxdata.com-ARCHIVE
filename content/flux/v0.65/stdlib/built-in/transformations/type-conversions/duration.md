---
title: duration() function
description: The `duration()` function converts a single value to a duration.
menu:
  flux_0_65:
    name: duration
    parent: built-in-type-conversions
weight: 2
aliases:
  - /flux/v0.65/functions/built-in/transformations/type-conversions/duration/
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

_**Data type:** String | Integer | Uinteger_

{{% note %}}
`duration()` assumes **numeric** input values are **nanoseconds**.
**String** input values must use [duration literal representation](/flux/v0.65/language/lexical-elements/#duration-literals).
{{% /note %}}

## Examples
```js
from(bucket: "sensor-data")
  |> range(start: -1m)
  |> filter(fn:(r) => r._measurement == "system" )
  |> map(fn:(r) => ({ r with uptime: duration(v: r.uptime) }))
```
