---
title: min() function
description: The min() function selects record with the lowest _value from the input
  table.
aliases:
  - /flux/v0.50/functions/transformations/selectors/min
  - /flux/v0.50/functions/built-in/transformations/selectors/min/
menu:
  flux_0_50:
    name: min
    parent: Selectors
    weight: 1
---

The `min()` function selects record with the lowest `_value` from the input table.

_**Function type:** Selector_  
_**Output data type:** Object_

```js
min(column: "_value")
```

## Parameters

### column
The column to use to calculate the minimum value.
Default is `"_value"`.

_**Data type:** String_

## Examples
```js
from(bucket:"telegraf/autogen")
  |> range(start:-1h)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system"
  )
  |> min()
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[MIN()](/influxdb/latest/query_language/functions/#min)  
