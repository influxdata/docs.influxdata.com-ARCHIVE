---
title: date.nanosecond() function
description: >
  The `date.nanosecond()` function returns the nanosecond of a specified time.
  Results range from `[0-999999999]`.
menu:
  flux_0_x:
    name: date.nanosecond
    parent: Date
    weight: 1
---

The `date.nanosecond()` function returns the nanosecond of a specified time.
Results range from `[0-999999999]`.

_**Function type:** Transformation_  

```js
import "date"

date.nanosecond(t: 2019-07-17T12:05:21.012934584Z)

// Returns 12934584
```

## Parameters

### t
The time to operate on.

_**Data type:** Time_
