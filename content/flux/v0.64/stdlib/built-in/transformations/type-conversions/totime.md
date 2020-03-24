---
title: toTime() function
description: The toTime() function converts a value to a time.
aliases:
  - /flux/v0.64/functions/transformations/type-conversions/totime
  - /flux/v0.64/functions/built-in/transformations/type-conversions/totime/
menu:
  flux_0_64:
    name: toTime
    parent: built-in-type-conversions
    weight: 1
---

The `toTime()` function converts a value to a time.

_**Function type:** Type conversion_  

```js
toTime()
```

_**Supported data types:** Integer | String | Uinteger_

{{% note %}}
`toTime()` assumes all numeric input values are nanosecond epoch timestamps.
{{% /note %}}

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
  |> toTime()
```

## Function definition
```js
toTime = (tables=<-) =>
  tables
    |> map(fn:(r) => ({ r with _value: time(v:r._value) }))
```
