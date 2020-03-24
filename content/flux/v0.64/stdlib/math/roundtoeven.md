---
title: math.roundtoeven() function
description: The math.roundtoeven() function returns the nearest integer, rounding
  ties to even.
menu:
  flux_0_64:
    name: math.roundtoeven
    parent: Math
weight: 1
aliases:
  - /flux/v0.64/functions/math/roundtoeven/
---

The `math.roundtoeven()` function returns the nearest integer, rounding ties to even.

_**Output data type:** Float_

```js
import "math"

math.roundtoeven(x: 3.14)
// Returns 3.0

math.roundtoeven(x: 3.5)
// Returns 4.0
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.roundtoeven(x: ±0)   // Returns ±0
math.roundtoeven(x: ±Inf) // Returns ±Inf
math.roundtoeven(x: NaN)  // Returns NaN
```
