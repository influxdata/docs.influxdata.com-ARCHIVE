---
title: math.yn() function
description: The math.yn() function returns the order-n Bessel function of the second
  kind.
menu:
  flux_0_64:
    name: math.yn
    parent: Math
weight: 1
aliases:
  - /flux/v0.64/functions/math/yn/
---

The `math.yn()` function returns the order-n Bessel function of the second kind.

_**Output data type:** Float_

```js
import "math"

math.yn(n: 3, x: 3.14)

// Returns -0.4866506930365083
```

## Parameters

### n
The order number used in the operation.

_**Data type:** Integer_

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.yn(n:n, x: +Inf) // Returns 0
math.yn(n: ≥0, x: 0)  // Returns -Inf
math.yn(n: <0, x: 0)  // Returns +Inf if n is odd, -Inf if n is even
math.yn(n:n, x: <0)   // Returns NaN
math.yn(n:n, x:NaN)   // Returns NaN
```
