---
title: math.cbrt() function
description: The math.cbrt() function returns the cube root of `x`.
menu:
  flux_0_x:
    name: math.cbrt
    parent: Math
weight: 1
aliases:
  - /flux/v0.x/functions/math/cbrt/
---

The `math.cbrt()` function returns the cube root of `x`.

_**Output data type:** Float_

```js
import "math"

math.cbrt(x: 1728.0)

// Returns 12.0
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.cbrt(±0)   // Returns ±0
math.cbrt(±Inf) // Returns ±Inf
math.cbrt(NaN)  // Returns NaN
```
