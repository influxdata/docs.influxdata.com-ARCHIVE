---
title: math.modf() function
description: >
  The math.modf() function returns integer and fractional floating-point numbers that sum to `f`.
  Both values have the same sign as `f`.
menu:
  flux_0_x:
    name: math.modf
    parent: Math
weight: 1
---

The `math.modf()` function returns integer and fractional floating-point numbers that sum to `f`.
Both values have the same sign as `f`.

_**Output data format:** Object_

```js
import "math"

math.modf(x: 3.14)

// Returns {int: 3, frac: 0.14000000000000012}
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.modf(x: ±Inf) // Returns {int: ±Inf, frac: NaN}
math.modf(x: NaN)  // Returns {int: NaN, frac: NaN}
```
