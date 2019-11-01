---
title: math.mMin() function
description: The math.mMin() function returns the smaller of `x` or `y`.
menu:
  flux_0_50:
    name: math.mMin
    parent: Math
weight: 1
aliases:
  - /flux/v0.50/functions/math/m_min/
  - /flux/v0.50/stdlib/math/m_min/
---

The `math.mMin()` function returns the smaller of `x` or `y`.

_**Output data type:** Float_

```js
import "math"

math.mMin(x: 1.23, y: 4.56)

// Returns 1.23
```

## Parameters

### x
The X value used in the operation.

_**Data type:** Float_

### y
The Y value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.mMin(x:x, y: -Inf) // Returns -Inf
math.mMin(x: -Inf, y:y) // Returns -Inf
math.mMin(x:x, y: NaN)  // Returns NaN
math.mMin(x: NaN, y:y)  // Returns NaN
math.mMin(x: -0, y: ±0) // Returns -0
math.mMin(x: ±0, y: -0) // Returns -0
```
