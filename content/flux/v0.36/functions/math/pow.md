---
title: math.pow() function
description: The math.pow() function returns `x**y`, the base-x exponential of y.
menu:
  flux_0_36:
    name: math.pow
    parent: Math
weight: 1
---

The `math.pow()` function returns `x**y`, the base-x exponential of y.

_**Output data type:** Float_

```js
import "math"

math.pow(x: 2.0, y: 3.0)

// Returns 8.0
```

## Parameters

### x
The X value used in the operation.

_**Data type:** Float_

### y
The Y value used in the operation.

_**Data type:** Float_

## Special cases
```js
// In order of priority
math.pow(x:x, y:±0)     // Returns 1 for any x
math.pow(x:1, y:y)      // Returns 1 for any y
math.pow(x:X, y:1)      // Returns x for any x
math.pow(x:NaN, y:y)    // Returns NaN
math.pow(x:x, y:NaN)    // Returns NaN
math.pow(x:±0, y:y)     // Returns ±Inf for y an odd integer < 0
math.pow(x:±0, y:-Inf)  // Returns +Inf
math.pow(x:±0, y:+Inf)  // Returns +0
math.pow(x:±0, y:y)     // Returns +Inf for finite y < 0 and not an odd integer
math.pow(x:±0, y:y)     // Returns ±0 for y an odd integer > 0
math.pow(x:±0, y:y)     // Returns +0 for finite y > 0 and not an odd integer
math.pow(x:-1, y:±Inf)  // Returns 1
math.pow(x:x, y:+Inf)   // Returns +Inf for |x| > 1
math.pow(x:x, y:-Inf)   // Returns +0 for |x| > 1
math.pow(x:x, y:+Inf)   // Returns +0 for |x| < 1
math.pow(x:x, y:-Inf)   // Returns +Inf for |x| < 1
math.pow(x:+Inf, y:y)   // Returns +Inf for y > 0
math.pow(x:+Inf, y:y)   // Returns +0 for y < 0
math.pow(x:-Inf, y:y)   // Returns math.pow(-0, -y)
math.pow(x:x, y:y)      // Returns NaN for finite x < 0 and finite non-integer y
```
