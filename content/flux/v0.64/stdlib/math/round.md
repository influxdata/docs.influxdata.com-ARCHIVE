---
title: math.round() function
description: The math.round() function returns the nearest integer, rounding half
  away from zero.
menu:
  flux_0_64:
    name: math.round
    parent: Math
weight: 1
aliases:
  - /flux/v0.64/functions/math/round/
---

The `math.round()` function returns the nearest integer, rounding half away from zero.

_**Output data type:** Float_

```js
import "math"

math.round(x: 2.12)

// Returns 2.0
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.round(x: ±0)   // Returns ±0
math.round(x: ±Inf) // Returns ±Inf
math.round(x: NaN)  // Returns NaN
```
