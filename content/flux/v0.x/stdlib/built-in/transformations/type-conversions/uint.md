---
title: uint() function
description: The `uint()` function converts a single value to a UInteger.
menu:
  flux_0_x:
    name: uint
    parent: built-in-type-conversions
weight: 2
aliases:
  - /flux/v0.x/functions/built-in/transformations/type-conversions/uint/
---

The `uint()` function converts a single value to a UInteger.

_**Function type:** Type conversion_  

```js
uint(v: "4")
```

_**Data type:** Boolean | Duration | Float | Integer | Numeric String | Time_

For duration and time values, `uint()` returns the following:

| Input type | Returned value                                      |
|:---------- |:--------------                                      |
| Duration   | The number of nanoseconds in the specified duration |
| Time       | A nanosecond epoch timestamp                        |

## Parameters

### v
The value to convert.

## Examples
```js
from(bucket: "sensor-data")
  |> range(start: -1m)
  |> filter(fn:(r) => r._measurement == "camera" )
  |> map(fn:(r) => ({ r with exposures: uint(v: r.exposures) }))
```
