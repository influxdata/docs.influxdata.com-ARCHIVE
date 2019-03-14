---
title: math.m_max() function
description: The math.m_max() function returns the larger of `x` or `y`.
menu:
  flux_0_x:
    name: math.m_max
    parent: Math
weight: 1
---

The `math.m_max()` function returns the larger of `x` or `y`.

_**Output data type:** Float_

```js
import "math"

math.m_max(x: 1.23, y: 4.56)

// Returns 4.56
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
math.m_max(x:x, y:+Inf)  // Returns +Inf
math.m_max(x: +Inf, y:y) // Returns +Inf
math.m_max(x:x, y: NaN)  // Returns NaN
math.m_max(x: NaN, y:y)  // Returns NaN
math.m_max(x: +0, y: ±0) // Returns +0
math.m_max(x: ±0, y: +0) // Returns +0
math.m_max(x: -0, y: -0) // Returns -0
```
