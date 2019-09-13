---
title: toUInt() function
description: The toUInt() function converts a value to an uinteger.
aliases:
  - /flux/v0.x/functions/transformations/type-conversions/touint
  - /flux/v0.x/functions/built-in/transformations/type-conversions/touint/
menu:
  flux_0_x:
    name: toUInt
    parent: built-in-type-conversions
    weight: 1
---

The `toUInt()` function converts a value to an UInteger.

_**Function type:** Type conversion_  
_**Output data type:** UInteger_

```js
toUInt()
```

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
