---
title: math.sinh() function
description: The math.sinh() function returns the hyperbolic sine of `x`.
menu:
  flux_0_33:
    name: math.sinh
    parent: Math
weight: 1
---

The `math.sinh()` function returns the hyperbolic sine of `x`.

_**Output data type:** Float_

```js
import "math"

math.sinh(x: 1.23)

// Returns 1.564468479304407
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.sinh(x: ±0)   // Returns ±0
math.sinh(x: ±Inf) // Returns ±Inf
math.sinh(x: NaN)  // Returns NaN
```
