---
title: math.tanh() function
description: The math.tanh() function returns the hyperbolic tangent of `x`.
menu:
  flux_0_50:
    name: math.tanh
    parent: Math
weight: 1
aliases:
  - /flux/v0.50/functions/math/tanh/
---

The `math.tanh()` function returns the hyperbolic tangent of `x`.

_**Output data type:** Float_

```js
import "math"

math.tanh(x: 1.23)

// Returns 0.8425793256589296
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.tanh(x: ±0)   // Returns ±0
math.tanh(x: ±Inf) // Returns ±1
math.tanh(x: NaN)  // Returns NaN
```
