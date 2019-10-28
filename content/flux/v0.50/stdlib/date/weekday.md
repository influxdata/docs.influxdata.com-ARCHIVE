---
title: date.weekDay() function
description: >
  The `date.weekDay()` function returns the day of the week for a specified
  time. Results range from `[0-6]`.
menu:
  flux_0_50:
    name: date.weekDay
    parent: Date
    weight: 1
aliases:
  - /flux/v0.50/functions/date/weekday/
---

The `date.weekDay()` function returns the day of the week for a specified time.
Results range from `[0-6]`.

_**Function type:** Transformation_  

```js
import "date"

date.weekDay(t: 2019-07-17T12:05:21.012Z)

// Returns 3
```

## Parameters

### t
The time to operate on.

_**Data type:** Time_
