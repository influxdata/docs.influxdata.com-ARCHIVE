---
title: math.log10() function
description: The math.log10() function returns the decimal logarithm of `x`.
menu:
  flux_0_64:
    name: math.log10
    parent: Math
weight: 1
aliases:
  - /flux/v0.64/functions/math/log10/
---

The `math.log10()` function returns the decimal logarithm of `x`.

_**Output data type:** Float_

```js
import "math"

math.log10(x: 3.14)

// Returns 0.4969296480732149
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.log10(x: +Inf) // Returns +Inf
math.log10(x: 0)    // Returns -Inf
math.log10(x: <0)   // Returns NaN
math.log10(x: NaN)  // Returns NaN
```
