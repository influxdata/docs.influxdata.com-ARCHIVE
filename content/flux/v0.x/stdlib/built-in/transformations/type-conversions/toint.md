---
title: toInt() function
description: The toInt() function converts a value to an integer.
aliases:
  - /flux/v0.x/functions/transformations/type-conversions/toint
  - /flux/v0.x/functions/built-in/transformations/type-conversions/toint/
menu:
  flux_0_x:
    name: toInt
    parent: built-in-type-conversions
    weight: 1
---

The `toInt()` function converts a value to an integer.

_**Function type:** Type conversion_  
_**Output data type:** Integer_

```js
toInt()
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
  |> toInt()
```

## Function definition
```js
toInt = (tables=<-) =>
  tables
    |> map(fn:(r) => ({ r with _value: int(v: r._value) }))
```
