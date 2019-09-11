---
title: math.sqrt() function
description: The math.sqrt() function returns the square root of `x`.
menu:
  flux_0_36:
    name: math.sqrt
    parent: Math
weight: 1
---

The `math.sqrt()` function returns the square root of `x`.

_**Output data type:** Float_

```js
import "math"

math.sqrt(x: 4.0)

// Returns 2.0
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.sqrt(x: +Inf) // Returns +Inf
math.sqrt(x: ±0)   // Returns ±0
math.sqrt(x: <0)   // Returns NaN
math.sqrt(x: NaN)  // Returns NaN
```
