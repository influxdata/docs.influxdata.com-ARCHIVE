---
title: filter() function
description: placeholder
menu:
  flux_0_7:
    name: filter
    parent: Functions
    weight: 1
---

The `filter()` function filters data based on conditions defined in a predicate function ([`fn`](#fn)).
The output tables have the same schema as the corresponding input tables.

_**Function type:** filter_  
_**Output data type:** table_

```js
filter(fn: (r) => r._measurement == "cpu")
```

## Parameters

### fn
A single argument function that evaluates true or false.
Records are passed to the function.
Those that evaluate to true are included in the output tables.

_**Data type:** function_

## Examples
```js
from(bucket:"telegraf/autogen")
  |> range(start:-1h)
  |> filter(fn: (r) =>
    r._measurement == "cpu" AND
    r._field == "usage_system" AND
    r.cpu == "cpu-total")
```
