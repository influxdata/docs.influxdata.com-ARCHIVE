---
title: date.hour() function
description: >
  The `date.hour()` function returns the hour of a specified time. Results
  range from `[0-23]`.
menu:
  flux_0_50:
    name: date.hour
    parent: Date
    weight: 1
aliases:
  - /flux/v0.50/functions/date/hour/
---

The `date.hour()` function returns the hour of a specified time.
Results range from `[0-23]`.

_**Function type:** Transformation_  

```js
import "date"

date.hour(t: 2019-07-17T12:05:21.012Z)

// Returns 12
```

## Parameters

### t
The time to operate on.

_**Data type:** Time_
