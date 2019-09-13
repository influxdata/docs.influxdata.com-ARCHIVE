---
title: date.truncate() function
description: >
  The `date.truncate()` function truncates a time to a specified unit.
menu:
  flux_0_x:
    name: date.truncate
    parent: Date
    weight: 1
aliases:
  - /flux/v0.x/functions/date/truncate/
---

The `date.truncate()` function truncates a time to a specified unit.

_**Function type:** Transformation_  

```js
import "date"

date.truncate(
  t: 2019-07-17T12:05:21.012Z
  unit: 1s
)

// Returns 2019-07-17T12:05:21.000000000Z
```

## Parameters

### t
The time to operate on.

_**Data type:** Time_

### unit
The unit of time to truncate to.

_**Data type:** Duration_

{{% note %}}
Only use `1` and the unit of time to specify the `unit`.
For example: `1s`, `1m`, `1h`.
{{% /note %}}

## Examples
```js
import "date"

date.truncate(t: "2019-06-03T13:59:01.000000000Z", unit: 1s)
// Returns  2019-06-03T13:59:01.000000000Z

date.truncate(t: "2019-06-03T13:59:01.000000000Z", unit: 1m)
// Returns  2019-06-03T13:59:00.000000000Z

date.truncate(t: "2019-06-03T13:59:01.000000000Z", unit: 1h)
// Returns  2019-06-03T13:00:00.000000000Z
```
