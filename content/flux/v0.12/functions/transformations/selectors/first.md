---
title: first() function
description: The first() function selects the first non-null record from an input table.
menu:
  flux_0_12:
    name: first
    parent: Selectors
    weight: 1
---

The `first()` function selects the first non-null record from an input table.

_**Function type:** Selector_  
_**Output data type:** Object_

```js
first()
```

## Examples
```js
from(bucket:"telegraf/autogen")
  |> range(start:-1h)
  |> filter(fn: (r) =>
    r._measurement == "cpu" AND
    r._field == "usage_system"
  )
  |> first()
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[FIRST()](/influxdb/latest/query_language/functions/#first)
