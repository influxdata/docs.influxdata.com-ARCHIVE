---
title: first() function
description: placeholder
menu:
  flux_0_7:
    name: first
    parent: Functions
    weight: 1
---

The `first()` function selects the first non-null record from an input table.

_**Function type:** selector_  
_**Output data type:** table_

```js
first()
```

## Examples
```js
from(bucket:"telegraf/autogen")
  |> range(start:-1h)
  |> filter(fn: (r) => r._measurement == "cpu" AND r._field == "usage_system")
  |> first()
```
