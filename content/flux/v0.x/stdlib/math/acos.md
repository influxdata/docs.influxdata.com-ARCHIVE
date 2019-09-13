---
title: math.acos() function
description: The math.acos() function returns the arccosine of `x` in radians.
menu:
  flux_0_x:
    name: math.acos
    parent: Math
weight: 1
aliases:
  - /flux/v0.x/functions/math/acos/
---

The `math.acos()` function returns the arccosine of `x` in radians.

_**Output data type:** Float_

```js
import "math"

math.acos(x: 0.22)

// Returns 1.3489818562981022
```

## Parameters

### x
`x` should be greater than -1 and less than 1.
Otherwise, the operation will return `NaN`.

_**Data type:** Float_

## Special cases
```js
math.acos(x: <-1) // Returns NaN
math.acos(x: >1)  // Returns NaN
```
