---
title: min() function
description: The min() function selects record with the lowest _value from the input table.
menu:
  flux_0_7:
    name: min
    parent: Functions
    weight: 1
---

The `min()` function selects record with the lowest `_value` from the input table.

_**Function type:** Selector_  
_**Output data type:** Object_

```js
min()
```

## Examples
```js
from(bucket:"telegraf/autogen")
  |> range(start:-1h)
  |> filter(fn: (r) => r._measurement == "cpu" AND r._field == "usage_system")
  |> min()
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[MIN()](/influxdb/latest/query_language/functions/#min)  
