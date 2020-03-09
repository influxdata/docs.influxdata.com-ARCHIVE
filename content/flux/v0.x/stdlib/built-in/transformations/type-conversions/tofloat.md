---
title: toFloat() function
description: The toFloat() function converts a value to a float.
aliases:
  - /flux/v0.x/functions/transformations/type-conversions/tofloat
  - /flux/v0.x/functions/built-in/transformations/type-conversions/tofloat/
menu:
  flux_0_x:
    name: toFloat
    parent: built-in-type-conversions
    weight: 1
---

The `toFloat()` function converts a value to a float.

_**Function type:** Type conversion_  

```js
toFloat()
```

_**Supported data types:** Boolean | Integer | Numeric String | Uinteger_

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
  |> toFloat()
```

## Function definition
```js
toFloat = (tables=<-) =>
  tables
    |> map(fn:(r) => ({ r with _value: float(v: r._value) }))
```
