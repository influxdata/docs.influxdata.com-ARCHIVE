---
title: date.minute() function
description: >
  The `date.minute()` function returns the minute of a specified time.
  Results range from `[0-59]`.
menu:
  flux_0_x:
    name: date.minute
    parent: Date
    weight: 1
aliases:
  - /flux/v0.x/functions/date/minute/
---

The `date.minute()` function returns the minute of a specified time.
Results range from `[0-59]`.

_**Function type:** Transformation_  

```js
import "date"

date.minute(t: 2019-07-17T12:05:21.012Z)

// Returns 21
```

## Parameters

### t
The time to operate on.

_**Data type:** Time_
