---
title: math.expm1() function
description: >
  The math.expm1() function returns `e**x - 1`, the base-e exponential of `x` minus 1.
  It is more accurate than `math.exp(x:x) - 1` when `x` is near zero.
menu:
  flux_0_x:
    name: math.expm1
    parent: Math
weight: 1
---

The `math.expm1()` function returns `e**x - 1`, the base-e exponential of `x` minus 1.
It is more accurate than `math.exp(x:x) - 1` when `x` is near zero.

_**Output data type:** Float_

```js
import "math"

math.expm1(x: 1.22)

// Returns 2.3871877336213343
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.expm1(+Inf) // Returns +Inf
math.expm1(-Inf) // Returns -1
math.expm1(NaN)  // Returns NaN
```

Very large values overflow to -1 or +Inf.
