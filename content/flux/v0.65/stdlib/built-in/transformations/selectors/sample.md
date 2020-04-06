---
title: sample() function
description: The sample() function selects a subset of the records from the input
  table.
aliases:
  - /flux/v0.65/functions/transformations/selectors/sample
  - /flux/v0.65/functions/built-in/transformations/selectors/sample/
menu:
  flux_0_65:
    name: sample
    parent: Selectors
    weight: 1
---

The `sample()` function selects a subset of the records from the input table.

_**Function type:** Selector_  
_**Output data type:** Object_

```js
sample(n:5, pos: -1)
```

## Parameters

### n
Sample every Nth element.

_**Data type:** Integer_

### pos
The position offset from the start of results where sampling begins.
`pos` must be less than `n`.
If `pos` is less than 0, a random offset is used.
Defaults to `-1` (random offset).

_**Data type:** Integer_

## Examples
```js
from(bucket:"telegraf/autogen")
  |> range(start:-1d)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system"
  )
  |> sample(n: 5, pos: 1)
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[SAMPLE()](/influxdb/latest/query_language/functions/#sample)  
