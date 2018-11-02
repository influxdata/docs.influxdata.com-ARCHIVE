---
title: last() function
description: The last() function selects the last non-null record from an input table.
menu:
  flux_0_7:
    name: last
    parent: Functions
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
  |> filter(fn: (r) => r._measurement == "cpu" AND r._field == "usage_system")
  |> last()
```
