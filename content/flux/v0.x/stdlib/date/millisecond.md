---
title: date.millisecond() function
description: >
  The `date.millisecond()` function returns the millisecond of a specified
  time. Results range from `[0-999999]`.
menu:
  flux_0_x:
    name: date.millisecond
    parent: Date
    weight: 1
aliases:
  - /flux/v0.x/functions/date/millisecond/
---

The `date.millisecond()` function returns the millisecond of a specified time.
Results range from `[0-999]`.

_**Function type:** Transformation_  

```js
import "date"

date.millisecond(t: 2019-07-17T12:05:21.012934584Z)

// Returns 12
```

## Parameters

### t
The time to operate on.

_**Data type:** Time_
