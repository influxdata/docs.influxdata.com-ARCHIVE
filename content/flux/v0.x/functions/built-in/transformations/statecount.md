---
title: stateCount() function
description: The stateCount() function computes the number of consecutive records in a given state.
aliases:
  - /flux/v0.x/functions/transformations/statecount
menu:
  flux_0_x:
    name: stateCount
    parent: Transformations
    weight: 1
---

The `stateCount()` function computes the number of consecutive records in a given state.
The state is defined via the function `fn`.
For each consecutive point that evaluates as `true`, the state count will be incremented.
When a point evaluates as `false`, the state count is reset.
The state count is added as an additional column to each record.

_**Function type:** Transformation_  
_**Output data type:** Integer_

```js
stateCount(fn: (r) => r._field == "state", column: "stateCount")
```

_If the expression generates an error during evaluation, the point is discarded
and does not affect the state count._

## Parameters

### fn
A single argument function that evaluates true or false to identify the state of the record.
Records are passed to the function.
Those that evaluate to `true` increment the state count.
Those that evaluate to `false` reset the state count.

_**Data type:** Function_

{{% note %}}
Make sure `fn` parameter names match each specified parameter.
To learn why, see [Match parameter names](/flux/v0.x/language/data-model/#match-parameter-names).
{{% /note %}}

### column
The name of the column added to each record that contains the incremented state count.

_**Data type:** String_

## Examples
```js
from("monitor/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "http")
  |> stateCount(
    fn: (r) => r.http_response_code == "500",
    column: "server_error_count"
  )
```
