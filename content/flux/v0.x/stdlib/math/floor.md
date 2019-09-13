---
title: math.floor() function
description: The math.floor() function returns the greatest integer value less than
  or equal to `x`.
menu:
  flux_0_x:
    name: math.floor
    parent: Math
weight: 1
aliases:
  - /flux/v0.x/functions/math/floor/
---

The `math.floor()` function returns the greatest integer value less than or equal to `x`.

_**Output data type:** Float_

```js
import "math"

math.floor(x: 1.22)

// Returns 1.0
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.floor(±0)   // Returns ±0
math.floor(±Inf) // Returns ±Inf
math.floor(NaN)  // Returns NaN
```
