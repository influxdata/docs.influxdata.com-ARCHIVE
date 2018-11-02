---
title: stateCount() function
description: placeholder
menu:
  flux_0_7:
    name: stateCount
    parent: Functions
    weight: 1
---

The `stateCount()` function computes the number of consecutive records in a given state.
The state is defined via the function `fn`.
For each consecutive point that evaluates as `true`, the state count will be incremented.
When a point evaluates as `false`, the state count is reset.
The state count will be added as an additional column to each record.

_**Function type:** transformation_  
_**Output data type:** integer_

```js
stateCount(fn: (r) => r._field == "state", label: "stateCount")
```

_If the expression generates an error during evaluation, the point is discarded
and does not affect the state count._

## Parameters

### fn
A single argument function that evaluates true or false to identify the state of the record.
Records are passed to the function.
Those that evaluate to `true` increment the state count.
Those that evaluate to `false` reset the state count.

_**Data type:** function_

### label
The name of the column added to each record that contains the state count.

_**Data type:** string_

## Examples
```js
from("monitor/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "server_state")
  |> stateCount()
```
