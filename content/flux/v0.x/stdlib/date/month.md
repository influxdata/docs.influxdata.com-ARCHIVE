---
title: date.month() function
description: >
  The `date.month()` function returns the month of a specified time. Results
  range from `[1-12]`
menu:
  flux_0_x:
    name: date.month
    parent: Date
    weight: 1
aliases:
  - /flux/v0.x/functions/date/month/
---

The `date.month()` function returns the month of a specified time.
Results range from `[1-12]`

_**Function type:** Transformation_  

```js
import "date"

date.month(t: 2019-07-17T12:05:21.012Z)

// Returns 7
```

## Parameters

### t
The time to operate on.

_**Data type:** Time_
