---
title: toDuration() function
description: The toDuration() function converts a value to a duration.
aliases:
  - /flux/v0.50/functions/transformations/type-conversions/toduration
  - /flux/v0.50/functions/built-in/transformations/type-conversions/toduration/
menu:
  flux_0_50:
    name: toDuration
    parent: built-in-type-conversions
    weight: 1
---

{{% warn %}}
**`toDuration()` was removed in Flux 0.37.**
{{% /warn %}}

The `toDuration()` function converts a value to a duration.

_**Function type:** Type conversion_  
_**Output data type:** Duration_

```js
toDuration()
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
  |> toDuration()
```

## Function definition
```js
toDuration = (tables=<-) =>
  tables
    |> map(fn:(r) => ({ r with _value: duration(v: r._value) }))
```
