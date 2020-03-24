---
title: math.erf() function
description: The math.erf() function returns the error function of `x`.
menu:
  flux_0_64:
    name: math.erf
    parent: Math
weight: 1
aliases:
  - /flux/v0.64/functions/math/erf/
---

The `math.erf()` function returns the error function of `x`.

_**Output data type:** Float_

```js
import "math"

math.erf(x: 22.6)

// Returns 1.0
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.erf(+Inf) // Returns 1
math.erf(-Inf) // Returns -1
math.erf(NaN)  // Returns NaN
```
