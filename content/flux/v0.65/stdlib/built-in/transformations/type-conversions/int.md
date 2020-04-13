---
title: int() function
description: The `int()` function converts a single value to an integer.
menu:
  flux_0_65:
    name: int
    parent: built-in-type-conversions
weight: 2
aliases:
  - /flux/v0.65/functions/built-in/transformations/type-conversions/int/
---

The `int()` function converts a single value to an integer.

_**Function type:** Type conversion_  
_**Output data type:** Integer_

```js
int(v: "4")
```

## Parameters

### v
The value to convert.

_**Data type:** Boolean | Duration | Float | Numeric String | Time | Uinteger_

For duration and time values, `int()` returns the following:

| Input type | Returned value                                      |
|:---------- |:--------------                                      |
| Duration   | The number of nanoseconds in the specified duration |
| Time       | A nanosecond epoch timestamp                        |

## Examples
```js
from(bucket: "sensor-data")
  |> range(start: -1m)
  |> filter(fn:(r) => r._measurement == "camera" )
  |> map(fn:(r) => ({ r with exposures: int(v: r.exposures) }))
```
