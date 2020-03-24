---
title: math.exp() function
description: The math.exp() function returns `e**x`, the base-e exponential of `x`.
menu:
  flux_0_64:
    name: math.exp
    parent: Math
weight: 1
aliases:
  - /flux/v0.64/functions/math/exp/
---

The `math.exp()` function returns `e**x`, the base-e exponential of `x`.

_**Output data type:** Float_

```js
import "math"

math.exp(x: 21.0)

// Returns 1.3188157344832146e+09
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.exp(x: +Inf) // Returns +Inf
math.exp(x: NaN)  // Returns NaN
```

Very large values overflow to 0 or +Inf. Very small values underflow to 1.
