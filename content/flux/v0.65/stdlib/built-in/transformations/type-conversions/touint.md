---
title: toUInt() function
description: The toUInt() function converts a value to an uinteger.
aliases:
  - /flux/v0.65/functions/transformations/type-conversions/touint
  - /flux/v0.65/functions/built-in/transformations/type-conversions/touint/
menu:
  flux_0_65:
    name: toUInt
    parent: built-in-type-conversions
    weight: 1
---

The `toUInt()` function converts a value to an UInteger.

_**Function type:** Type conversion_  

```js
toUInt()
```

_**Supported data types:** Boolean | Duration | Float | Integer | Numeric String | Time_

For duration and time values, `toUint()` returns the following:

| Input type | Returned value                                      |
|:---------- |:--------------                                      |
| Duration   | The number of nanoseconds in the specified duration |
| Time       | A nanosecond epoch timestamp                        |

{{% note %}}
To convert values in a column other than `_value`, define a custom function
patterned after the [function definition](#function-definition),
but replace `_value` with your desired column.
{{% /note %}}

## Examples
```js
from(bucket: "telegraf")
  |> filter(fn:(r) =>
    r._measurement == "mem" and
    r._field == "used"
  )
  |> toUInt()
```

## Function definition
```js
toUInt = (tables=<-) =>
  tables
    |> map(fn:(r) => ({ r with _value: uint(v:r._value) }))
```
