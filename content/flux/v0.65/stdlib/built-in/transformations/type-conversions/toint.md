---
title: toInt() function
description: The toInt() function converts a value to an integer.
aliases:
  - /flux/v0.65/functions/transformations/type-conversions/toint
  - /flux/v0.65/functions/built-in/transformations/type-conversions/toint/
menu:
  flux_0_65:
    name: toInt
    parent: built-in-type-conversions
    weight: 1
---

The `toInt()` function converts a value to an integer.

_**Function type:** Type conversion_  

```js
toInt()
```

_**Supported data types:** Boolean | Duration | Float | Numeric String | Time | Uinteger_

For duration and time values, `toInt()` returns the following:

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
  |> toInt()
```

## Function definition
```js
toInt = (tables=<-) =>
  tables
    |> map(fn:(r) => ({ r with _value: int(v: r._value) }))
```
