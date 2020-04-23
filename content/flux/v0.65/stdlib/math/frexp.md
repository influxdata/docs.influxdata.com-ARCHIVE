---
title: math.frexp() function
description: >
  The math.frexp() function breaks `f` into a normalized fraction and
  an integral power of two. It returns `frac` and `exp` satisfying `f == frac × 2**exp`,
  with the absolute value of `frac` in the interval [½, 1).
menu:
  flux_0_65:
    name: math.frexp
    parent: Math
weight: 1
aliases:
  - /flux/v0.65/functions/math/frexp/
---

The `math.frexp()` function breaks `f` into a normalized fraction and an integral power of two.
It returns `frac` and `exp` satisfying `f == frac × 2**exp`, with the absolute value
of `frac` in the interval `[½, 1)`.

_**Output data type:** Object_

```js
import "math"

math.frexp(f: 22.0)

// Returns {frac: 0.6875, exp: 5}
```

## Parameters

### f
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.frexp(f: ±0)   // Returns {frac: ±0, exp: 0}
math.frexp(f: ±Inf) // Returns {frac: ±Inf, exp: 0}
math.frexp(f: NaN)  // Returns {frac: NaN, exp: 0}
```
