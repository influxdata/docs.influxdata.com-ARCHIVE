---
title: date.microsecond() function
description: >
  The `date.microsecond()` function returns the microsecond of a specified
  time. Results range from `[0-999999]`.
menu:
  flux_0_50:
    name: date.microsecond
    parent: Date
    weight: 1
aliases:
  - /flux/v0.50/functions/date/microsecond/
---

The `date.microsecond()` function returns the microsecond of a specified time.
Results range from `[0-999999]`.

_**Function type:** Transformation_  

```js
import "date"

date.microsecond(t: 2019-07-17T12:05:21.012934584Z)

// Returns 12934
```

## Parameters

### t
The time to operate on.

_**Data type:** Time_
