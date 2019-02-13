---
title: stateDuration() function
description: The stateDuration() function computes the duration of a given state.
aliases:
  - /flux/v0.x/functions/transformations/stateduration
menu:
  flux_0_x:
    name: stateDuration
    parent: Transformations
    weight: 1
---

The `stateDuration()` function computes the duration of a given state.
The state is defined via the function `fn`.
For each consecutive point for that evaluates as `true`, the state duration will be
incremented by the duration between points.
When a point evaluates as `false`, the state duration is reset.
The state duration is added as an additional column to each record.

_**Function type:** Transformation_  
_**Output data type:** Duration_

> As the first point in the given state has no previous point, its
> state duration will be 0.

```js
stateDuration(fn: (r) => r._measurement == "state", column: "stateDuration", unit: 1s)
```

_If the expression generates an error during evaluation, the point is discarded,
and does not affect the state duration._

## Parameters

### fn
A single argument function that evaluates true or false to identify the state of the record.
Records are passed to the function.
Those that evaluate to `true` increment the state duration.
Those that evaluate to `false` reset the state duration.

_**Data type:** Function_

### column
The name of the column added to each record that contains the state duration.

_**Data type:** String_

### unit
The unit of time in which the state duration is incremented.
For example: `1s`, `1m`, `1h`, etc.

_**Data type:** Duration_

## Examples
```js
from("monitor/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "http")
  |> stateDuration(
    fn: (r) => r.http_response_code == "500",
    column: "server_error_duration"
  )
```
