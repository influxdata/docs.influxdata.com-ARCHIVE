---
title: math.erfc() function
description: The math.erfc() function returns the complementary error function of
  `x`.
menu:
  flux_0_65:
    name: math.erfc
    parent: Math
weight: 1
aliases:
  - /flux/v0.65/functions/math/erfc/
---

The `math.erfc()` function returns the complementary error function of `x`.

_**Output data type:** Float_

```js
import "math"

math.erfc(x: 22.6)

// Returns 3.7726189138490583e-224
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.erfc(+Inf) // Returns 0
math.erfc(-Inf) // Returns 2
math.erfc(NaN)  // Returns NaN
```
