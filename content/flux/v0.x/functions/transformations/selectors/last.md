---
title: last() function
description: The last() function selects the last non-null record from an input table.
menu:
  flux_0_x:
    name: last
    parent: Selectors
    weight: 1
---

The `last()` function selects the last non-null record from an input table.

_**Function type:** Selector_  
_**Output data type:** Object_

```js
last()
```

## Examples
```js
from(bucket:"telegraf/autogen")
  |> range(start:-1h)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system"
  )
  |> last()
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[LAST()](/influxdb/latest/query_language/functions/#last)  
