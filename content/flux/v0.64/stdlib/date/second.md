---
title: date.second() function
description: >
  The `date.second()` function returns the second of a specified time.
  Results range from `[0-59]`.
menu:
  flux_0_64:
    name: date.second
    parent: Date
    weight: 1
aliases:
  - /flux/v0.64/functions/date/second/
---

The `date.second()` function returns the second of a specified time.
Results range from `[0-59]`.

_**Function type:** Transformation_  

```js
import "date"

date.second(t: 2019-07-17T12:05:21.012Z)

// Returns 21
```

## Parameters

### t
The time to operate on.

_**Data type:** Time_
