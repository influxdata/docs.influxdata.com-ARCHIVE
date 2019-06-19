---
title: math.ldexp() function
description: The math.ldexp() function is the inverse of `math.frexp()`. It returns `frac × 2**exp`.
menu:
  flux_0_24:
    name: math.ldexp
    parent: Math
weight: 1
---

The `math.ldexp()` function is the inverse of [`math.frexp()`](/v2.0/reference/flux/functions/math/frexp).
It returns `frac × 2**exp`.

_**Output data type:** Float_

```js
import "math"

math.ldexp(frac: 0.5, exp: 6)

// Returns 32.0
```

## Parameters

### frac
The fraction used in the operation.

_**Data type:** Float_

### exp
The exponent used in the operation.

_**Data type:** Integer_

## Special cases
```js
math.ldexp(frac: ±0, exp:exp)   // Returns ±0
math.ldexp(frac: ±Inf, exp:exp) // Returns ±Inf
math.ldexp(frac: NaN, exp:exp)  // Returns NaN
```
