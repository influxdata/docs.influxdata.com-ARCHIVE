---
title: max() function
description: placeholder
menu:
  flux_0_7:
    name: max
    parent: Functions
    weight: 1
---

The `max()` function selects record with the highest `_value` from the input table.

_**Function type:** Selector_  
_**Output data type:** Object_

```js
max()
```

## Examples
```js
from(bucket:"telegraf/autogen")
  |> range(start:-1h)
  |> filter(fn: (r) => r._measurement == "cpu" AND r._field == "usage_system")
  |> max()
```
